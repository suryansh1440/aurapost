import Workplace from "../models/workplace.model.js";
import { uploadOnCloudinary } from "../services/cloudinary.js";

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

        // Handle file upload if present
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

// @desc    Get all workspaces for the logged in user with pagination
// @route   GET /api/workspaces
// @access  Private
export const getWorkspaces = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = { owner: req.user._id, isDeleted: false };
        
        const workspaces = await Workplace.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
            
        const totalWorkspaces = await Workplace.countDocuments(query);
        const totalPages = Math.ceil(totalWorkspaces / limit);

        res.status(200).json({ 
            success: true, 
            workspaces,
            pagination: {
                currentPage: page,
                totalPages,
                totalWorkspaces,
                limit
            }
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
        const workspace = await Workplace.findOne({ _id: req.params.id, owner: req.user._id, isDeleted: false });
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
        const { name, description, emoji, themeColor, bg } = req.body;
        let { workspaceLogo } = req.body;

        if (req.file) {
            const uploadResult = await uploadOnCloudinary(req.file.buffer, "workspaces/logos");
            if (uploadResult) {
                workspaceLogo = uploadResult.secure_url;
            }
        }

        const workspace = await Workplace.findOneAndUpdate(
            { _id: req.params.id, owner: req.user._id, isDeleted: false },
            { name, description, emoji, themeColor, bg, workspaceLogo },
            { new: true, runValidators: true }
        );

        if (!workspace) {
            return res.status(404).json({ success: false, message: "Workspace not found or unauthorized" });
        }

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
            return res.status(404).json({ success: false, message: "Workspace not found or unauthorized" });
        }

        res.status(200).json({ success: true, message: "Workspace deleted" });
    } catch (error) {
        console.error("Error in deleteWorkspace controller:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
