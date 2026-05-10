import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        members: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                role: {
                    type: String,
                    enum: ["ADMIN", "EDITOR", "VIEWER"],
                    default: "VIEWER"
                }
            }
        ],

        status: {
            type: String,
            enum: ["ACTIVE", "INACTIVE"],
            default: "ACTIVE"
        },
        plan: {
            type: String,
            enum: ["FREE", "PRO", "ENTERPRISE"],
            default: "FREE"
        },
        postCount: {
            type: Number,
            default: 0
        },
        accountIdentity: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AccountIdentity"
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        workspaceLogo: {
            type: String,
            default: ""
        },
        emoji: {
            type: String,
            default: "🚀"
        },
        themeColor: {
            type: String,
            default: "#39FF14"
        },
        bg: {
            type: String,
            default: "rgba(57,255,20,0.12)"
        },
        isDeleted: {
            type: Boolean,
            default: false
        }

    }, { timestamps: true }
)

const Workplace = mongoose.model("Workplace", workspaceSchema);
export default Workplace;
