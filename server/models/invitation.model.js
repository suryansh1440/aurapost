import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema(
    {
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workplace",
            required: true
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        recipientEmail: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["ADMIN", "EDITOR", "VIEWER"],
            default: "VIEWER"
        },
        status: {
            type: String,
            enum: ["PENDING", "ACCEPTED", "REJECTED"],
            default: "PENDING"
        }
    },
    { timestamps: true }
);

const Invitation = mongoose.model("Invitation", invitationSchema);
export default Invitation;
