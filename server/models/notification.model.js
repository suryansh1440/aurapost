import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workplace"
        },
        type: {
            type: String,
            enum: ["INVITE", "ALERT", "INFO"],
            required: true
        },
        title: {
            type: String,
            required: true
        },
        body: {
            type: String,
            required: true
        },
        isRead: {
            type: Boolean,
            default: false
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed
        }
    },
    { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
