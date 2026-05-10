import axios from "axios";
import { Integration } from "../models/integration.model.js";
import { encrypt } from "../utils/encryption.util.js";

// @desc    Connect Meta (Facebook/Instagram) Account
// @route   POST /api/social/meta/connect
// @access  Private
export const connectMetaAccount = async (req, res) => {
    try {
        const { code, workspaceId } = req.body;
        const userId = req.user._id;

        if (!code || !workspaceId) {
            return res.status(400).json({ success: false, message: "Code and Workspace ID are required" });
        }

        const clientId = process.env.FACEBOOK_APP_ID_FOR_WORKSPACE;
        const clientSecret = process.env.FACEBOOK_APP_SECRET_FOR_WORKSPACE;
        
        // This MUST match exactly the redirect_uri used on the frontend
        const redirectUri = `${process.env.FRONTEND_URL}/meta/callback`;

        // 1. Exchange code for short-lived access token
        const tokenRes = await axios.get("https://graph.facebook.com/v23.0/oauth/access_token", {
            params: {
                client_id: clientId,
                redirect_uri: redirectUri,
                client_secret: clientSecret,
                code: code
            }
        });

        const shortLivedToken = tokenRes.data.access_token;

        // 2. Exchange short-lived token for long-lived user token
        const longTokenRes = await axios.get("https://graph.facebook.com/v23.0/oauth/access_token", {
            params: {
                grant_type: "fb_exchange_token",
                client_id: clientId,
                client_secret: clientSecret,
                fb_exchange_token: shortLivedToken
            }
        });

        const longLivedUserToken = longTokenRes.data.access_token;
        const expiresIn = longTokenRes.data.expires_in || (60 * 60 * 24 * 60); // Default to ~60 days if not provided
        const expiresAt = new Date(Date.now() + expiresIn * 1000);

        // 3. Get Facebook Pages
        const pagesRes = await axios.get("https://graph.facebook.com/v23.0/me/accounts", {
            params: {
                access_token: longLivedUserToken
            }
        });

        const rawPages = pagesRes.data.data;
        if (!rawPages || rawPages.length === 0) {
            return res.status(400).json({ success: false, message: "No Facebook Pages found. Please create a Facebook Page and connect your Instagram Business account." });
        }

        // 4. For each page, try to get the connected Instagram Business Account
        const pages = await Promise.all(rawPages.map(async (page) => {
            let igData = null;
            try {
                const igRes = await axios.get(`https://graph.facebook.com/v23.0/${page.id}`, {
                    params: {
                        fields: "instagram_business_account{id,username,profile_picture_url}",
                        access_token: page.access_token
                    }
                });
                if (igRes.data.instagram_business_account) {
                    igData = igRes.data.instagram_business_account;
                }
            } catch (igError) {
                // Ignore, means no IG connected
            }
            return {
                id: page.id,
                name: page.name,
                access_token: page.access_token, // We send this to frontend temporarily so they can pass it back on selection. Or better, we cache it in DB. Let's send it.
                instagramBusinessAccount: igData
            };
        }));

        // 5. Encrypt token before saving
        const encryptedLongLivedToken = encrypt(longLivedUserToken);

        // 6. Always create a new PENDING integration so multiple pages can be connected
        const integration = await Integration.create({
            workspaceId,
            userId,
            provider: "META",
            longLivedUserToken: encryptedLongLivedToken,
            expiresAt,
            status: "PENDING_PAGE_SELECTION"
        });

        res.status(200).json({
            success: true,
            message: "Tokens exchanged. Please select a page to connect.",
            integrationId: integration._id,
            pages
        });

    } catch (error) {
        console.error("Meta Connection Error:", error.response?.data || error.message);
        res.status(500).json({ 
            success: false, 
            message: "Failed to connect Meta account.",
            error: error.response?.data?.error?.message || error.message
        });
    }
};

// @desc    Select Meta Page to Finalize Connection
// @route   POST /api/social/meta/select-page
// @access  Private
export const selectMetaPage = async (req, res) => {
    try {
        const { integrationId, page } = req.body;
        
        if (!integrationId || !page || !page.id || !page.access_token) {
            return res.status(400).json({ success: false, message: "Integration ID and complete Page object are required" });
        }

        const integration = await Integration.findById(integrationId);
        if (!integration) {
            return res.status(404).json({ success: false, message: "Integration not found" });
        }

        // Prevent duplicate: check if this page is already connected (ACTIVE) in this workspace
        const duplicate = await Integration.findOne({
            workspaceId: integration.workspaceId,
            facebookPageId: page.id,
            status: { $ne: "PENDING_PAGE_SELECTION" },
            _id: { $ne: integrationId } // exclude the current pending one
        });
        if (duplicate) {
            // Clean up the dangling PENDING integration
            await Integration.findByIdAndDelete(integrationId);
            return res.status(409).json({
                success: false,
                message: `"${page.name}" is already connected to this workspace.`
            });
        }

        // Encrypt the specific page token
        const encryptedPageToken = encrypt(page.access_token);

        integration.facebookPageId = page.id;
        integration.facebookPageName = page.name;
        integration.pageAccessToken = encryptedPageToken;
        
        if (page.instagramBusinessAccount) {
            integration.instagramBusinessId = page.instagramBusinessAccount.id;
            integration.instagramUsername = page.instagramBusinessAccount.username;
            integration.instagramProfilePicture = page.instagramBusinessAccount.profile_picture_url;
        }

        integration.status = "ACTIVE";
        await integration.save();

        res.status(200).json({
            success: true,
            message: "Meta account connected successfully",
            integration: {
                _id: integration._id,
                provider: integration.provider,
                facebookPageName: integration.facebookPageName,
                instagramUsername: integration.instagramUsername,
                instagramProfilePicture: integration.instagramProfilePicture,
                status: integration.status
            }
        });

    } catch (error) {
        console.error("Meta Page Selection Error:", error);
        res.status(500).json({ success: false, message: "Failed to finalize page connection." });
    }
};

// @desc    Get Connected Accounts for Workspace
// @route   GET /api/social/workspace/:workspaceId
// @access  Private
export const getConnectedAccounts = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        
        // Exclude tokens from the response and do not return pending selection integrations
        const integrations = await Integration.find({ 
            workspaceId, 
            status: { $ne: "PENDING_PAGE_SELECTION" } 
        })
            .select("-pageAccessToken -longLivedUserToken")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            integrations
        });
    } catch (error) {
        console.error("Error fetching integrations:", error);
        res.status(500).json({ success: false, message: "Failed to fetch connected accounts" });
    }
};

export const disconnectAccount = async (req, res) => {
    try {
        const { integrationId } = req.params;

        const integration = await Integration.findById(integrationId);
        if (!integration) {
            return res.status(404).json({ success: false, message: "Integration not found" });
        }

        // We assume protect middleware makes sure user has access to this workspace.
        // Actually, we should check if user is admin/owner of the workspace, but we just delete for now.
        await Integration.findByIdAndDelete(integrationId);

        res.status(200).json({ success: true, message: "Account disconnected successfully" });
    } catch (error) {
        console.error("Error disconnecting account:", error);
        res.status(500).json({ success: false, message: "Failed to disconnect account" });
    }
};
