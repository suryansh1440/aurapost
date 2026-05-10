import Notification from "../models/notification.model.js";
import Invitation from "../models/invitation.model.js";

// @desc    Get all notifications for logged in user
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .sort({ createdAt: -1 })
            .populate("workspace", "name workspaceLogo themeColor");

        // We also need to get pending invitations where recipientEmail matches req.user.email
        // We can either return them together or separately. Let's fetch them too.
        const pendingInvites = await Invitation.find({ 
            recipientEmail: req.user.email, 
            status: "PENDING" 
        }).populate("workspace", "name workspaceLogo themeColor").populate("sender", "name email");

        res.status(200).json({ success: true, notifications, pendingInvites });
    } catch (error) {
        console.error("Error in getNotifications:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipient: req.user._id },
            { isRead: true },
            { new: true }
        );

        if (!notification) return res.status(404).json({ success: false, message: "Notification not found" });

        res.status(200).json({ success: true, notification });
    } catch (error) {
        console.error("Error in markAsRead:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
