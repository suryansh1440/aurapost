import Workplace from "../models/workplace.model.js";
import Invitation from "../models/invitation.model.js";
import Notification from "../models/notification.model.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../services/cloudinary.js";

// Helper to check role
const checkRole = (workspace, userId, requiredRoles) => {
    if (workspace.owner.toString() === userId.toString()) return true;
    const member = workspace.members.find(m => m.user.toString() === userId.toString() || (m.user._id && m.user._id.toString() === userId.toString()));
    if (!member) return false;
    return requiredRoles.includes(member.role);
};

// @desc    Create a new workspace
// @route   POST /api/workspaces
// @access  Private
export const createWorkspace = async (req, res) => {
    try {
        const { name, description, emoji, themeColor, bg } = req.body;
        let { workspaceLogo } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Workspace name is required", success: false });
        }

        if (req.file) {
            const uploadResult = await uploadOnCloudinary(req.file.buffer, "workspaces/logos");
            if (uploadResult) {
                workspaceLogo = uploadResult.secure_url;
            }
        }

        const workspace = await Workplace.create({
            name,
            description: description || "A new workspace",
            owner: req.user._id,
            emoji: emoji || "🚀",
            workspaceLogo: workspaceLogo || "",
            themeColor: themeColor || "#39FF14",
            bg: bg || "rgba(57,255,20,0.12)",
        });

        res.status(201).json({ success: true, workspace, message: "Workspace created successfully" });
    } catch (error) {
        console.error("Error in createWorkspace controller:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Get all workspaces for the logged in user
// @route   GET /api/workspaces
// @access  Private
export const getWorkspaces = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const userId = req.user._id;

        // Use aggregation to fetch workspaces and count their integrations
        const workspaces = await Workplace.aggregate([
            {
                $match: {
                    $or: [{ owner: userId }, { "members.user": userId }],
                    isDeleted: false
                }
            },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: "integrations", // name of the collection in MongoDB
                    localField: "_id",
                    foreignField: "workspaceId",
                    as: "integrations"
                }
            },
            {
                $addFields: {
                    integrationCount: { $size: "$integrations" },
                    connectedPlatforms: {
                        $reduce: {
                            input: "$integrations",
                            initialValue: [],
                            in: {
                                $setUnion: [
                                    "$$value",
                                    {
                                        $concatArrays: [
                                            { $cond: [{ $gt: ["$$this.facebookPageId", null] }, ["FACEBOOK"], []] },
                                            { $cond: [{ $gt: ["$$this.instagramBusinessId", null] }, ["INSTAGRAM"], []] }
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    integrations: 0 // Remove the full integration objects to keep response small
                }
            }
        ]);

        const totalWorkspaces = await Workplace.countDocuments({
            $or: [{ owner: userId }, { "members.user": userId }],
            isDeleted: false
        });
        
        const totalPages = Math.ceil(totalWorkspaces / limit);

        res.status(200).json({ 
            success: true, 
            workspaces,
            pagination: { currentPage: page, totalPages, totalWorkspaces, limit }
        });
    } catch (error) {
        console.error("Error in getWorkspaces controller:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Get single workspace
// @route   GET /api/workspaces/:id
// @access  Private
export const getWorkspaceById = async (req, res) => {
    try {
        const workspace = await Workplace.findOne({
            _id: req.params.id,
            $or: [{ owner: req.user._id }, { "members.user": req.user._id }],
            isDeleted: false
        }).populate("members.user", "name email profile.avatar").populate("owner", "name email profile.avatar");

        if (!workspace) {
            return res.status(404).json({ success: false, message: "Workspace not found" });
        }
        res.status(200).json({ success: true, workspace });
    } catch (error) {
        console.error("Error in getWorkspaceById controller:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Update a workspace
// @route   PUT /api/workspaces/:id
// @access  Private
export const updateWorkspace = async (req, res) => {
    try {
        const workspace = await Workplace.findOne({ _id: req.params.id, isDeleted: false });
        if (!workspace) return res.status(404).json({ success: false, message: "Workspace not found" });

        if (!checkRole(workspace, req.user._id, ["ADMIN"])) {
            return res.status(403).json({ success: false, message: "Not authorized to update workspace" });
        }

        const { name, description, emoji, themeColor, bg } = req.body;
        let { workspaceLogo } = req.body;

        if (req.file) {
            const uploadResult = await uploadOnCloudinary(req.file.buffer, "workspaces/logos");
            if (uploadResult) {
                workspaceLogo = uploadResult.secure_url;
            }
        }

        workspace.name = name || workspace.name;
        workspace.description = description || workspace.description;
        workspace.emoji = emoji || workspace.emoji;
        workspace.themeColor = themeColor || workspace.themeColor;
        workspace.bg = bg || workspace.bg;
        if (workspaceLogo) workspace.workspaceLogo = workspaceLogo;

        await workspace.save();

        res.status(200).json({ success: true, workspace, message: "Workspace updated" });
    } catch (error) {
        console.error("Error in updateWorkspace controller:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Soft Delete a workspace
// @route   DELETE /api/workspaces/:id
// @access  Private
export const deleteWorkspace = async (req, res) => {
    try {
        const workspace = await Workplace.findOneAndUpdate(
            { _id: req.params.id, owner: req.user._id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );

        if (!workspace) {
            return res.status(404).json({ success: false, message: "Workspace not found or unauthorized (Owner only)" });
        }

        res.status(200).json({ success: true, message: "Workspace deleted" });
    } catch (error) {
        console.error("Error in deleteWorkspace controller:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// --- INVITATION & MEMBER MANAGEMENT ---

// @desc    Invite user to workspace
// @route   POST /api/workspaces/:id/invite
export const inviteUser = async (req, res) => {
    try {
        const { email, role } = req.body;
        const workspaceId = req.params.id;

        const workspace = await Workplace.findById(workspaceId);
        if (!workspace) return res.status(404).json({ success: false, message: "Workspace not found" });

        if (!checkRole(workspace, req.user._id, ["ADMIN"])) {
            return res.status(403).json({ success: false, message: "Not authorized to invite users" });
        }

        const targetUser = await User.findOne({ email });
        if (!targetUser) {
            return res.status(404).json({ success: false, message: "User not found with this email" });
        }

        // Check if already a member
        if (workspace.owner.toString() === targetUser._id.toString() || workspace.members.some(m => m.user.toString() === targetUser._id.toString())) {
            return res.status(400).json({ success: false, message: "User is already in this workspace" });
        }

        // Check if invitation already exists
        const existingInvite = await Invitation.findOne({ workspace: workspaceId, recipientEmail: email, status: "PENDING" });
        if (existingInvite) return res.status(400).json({ success: false, message: "Invitation already sent" });

        const invite = await Invitation.create({
            workspace: workspaceId,
            sender: req.user._id,
            recipientEmail: email,
            role: role || "VIEWER"
        });

        // Create notification for recipient
        await Notification.create({
            recipient: targetUser._id,
            workspace: workspaceId,
            type: "INVITE",
            title: `Invitation to join ${workspace.name}`,
            body: `${req.user.name} invited you to join ${workspace.name} as a ${role || "VIEWER"}.`,
            metadata: { invitationId: invite._id }
        });

        res.status(200).json({ success: true, message: "Invitation sent successfully" });
    } catch (error) {
        console.error("Error in inviteUser:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Update member role
// @route   PUT /api/workspaces/:id/members/:userId
export const updateMemberRole = async (req, res) => {
    try {
        const { role } = req.body;
        const { id: workspaceId, userId } = req.params;

        const workspace = await Workplace.findById(workspaceId);
        if (!workspace) return res.status(404).json({ success: false, message: "Workspace not found" });

        // Only owner or admin can update roles
        if (!checkRole(workspace, req.user._id, ["ADMIN"])) {
            return res.status(403).json({ success: false, message: "Not authorized to update roles" });
        }

        // Find member
        const memberIndex = workspace.members.findIndex(m => m.user.toString() === userId);
        if (memberIndex === -1) return res.status(404).json({ success: false, message: "Member not found" });

        // Cannot change owner role through this (owner is separate)
        if (workspace.owner.toString() === userId) return res.status(400).json({ success: false, message: "Cannot change owner role" });

        workspace.members[memberIndex].role = role;
        await workspace.save();

        res.status(200).json({ success: true, message: "Role updated successfully" });
    } catch (error) {
        console.error("Error in updateMemberRole:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Remove member
// @route   DELETE /api/workspaces/:id/members/:userId
export const removeMember = async (req, res) => {
    try {
        const { id: workspaceId, userId } = req.params;

        const workspace = await Workplace.findById(workspaceId);
        if (!workspace) return res.status(404).json({ success: false, message: "Workspace not found" });

        // Only owner or admin can remove, or the user themselves
        if (!checkRole(workspace, req.user._id, ["ADMIN"]) && req.user._id.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Not authorized to remove member" });
        }

        workspace.members = workspace.members.filter(m => m.user.toString() !== userId);
        await workspace.save();

        res.status(200).json({ success: true, message: "Member removed successfully" });
    } catch (error) {
        console.error("Error in removeMember:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Accept invitation
// @route   POST /api/workspaces/invitations/:id/accept
export const acceptInvitation = async (req, res) => {
    try {
        const invite = await Invitation.findById(req.params.id);
        if (!invite || invite.status !== "PENDING") {
            return res.status(404).json({ success: false, message: "Invitation not found or no longer pending" });
        }

        if (invite.recipientEmail !== req.user.email) {
            return res.status(403).json({ success: false, message: "Not authorized for this invitation" });
        }

        const workspace = await Workplace.findById(invite.workspace);
        if (!workspace) return res.status(404).json({ success: false, message: "Workspace not found" });

        // Update invitation
        invite.status = "ACCEPTED";
        await invite.save();

        // Add to workspace
        workspace.members.push({ user: req.user._id, role: invite.role });
        await workspace.save();

        // Notify sender
        await Notification.create({
            recipient: invite.sender,
            workspace: workspace._id,
            type: "INFO",
            title: "Invitation Accepted",
            body: `${req.user.name} accepted your invitation to join ${workspace.name}.`
        });

        res.status(200).json({ success: true, message: "Invitation accepted successfully" });
    } catch (error) {
        console.error("Error in acceptInvitation:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Reject invitation
// @route   POST /api/workspaces/invitations/:id/reject
export const rejectInvitation = async (req, res) => {
    try {
        const invite = await Invitation.findById(req.params.id);
        if (!invite || invite.status !== "PENDING") {
            return res.status(404).json({ success: false, message: "Invitation not found or no longer pending" });
        }

        if (invite.recipientEmail !== req.user.email) {
            return res.status(403).json({ success: false, message: "Not authorized for this invitation" });
        }

        invite.status = "REJECTED";
        await invite.save();

        // Notify sender
        await Notification.create({
            recipient: invite.sender,
            workspace: invite.workspace,
            type: "INFO",
            title: "Invitation Declined",
            body: `${req.user.name} declined your invitation.`
        });

        res.status(200).json({ success: true, message: "Invitation rejected" });
    } catch (error) {
        console.error("Error in rejectInvitation:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
