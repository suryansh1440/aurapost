import mongoose from "mongoose";

const integrationSchema = new mongoose.Schema({
    workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workplace",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    provider: {
        type: String,
        enum: ["META"],
        required: true
    },
    
    // Meta specific fields
    facebookPageId: { type: String },
    facebookPageName: { type: String },
    instagramBusinessId: { type: String },
    instagramUsername: { type: String },
    instagramProfilePicture: { type: String },
    
    // Encrypted Tokens
    pageAccessToken: { type: String }, 
    longLivedUserToken: { type: String }, 
    expiresAt: { type: Date },
    
    status: {
        type: String,
        enum: ["ACTIVE", "EXPIRED", "ERROR", "PENDING_PAGE_SELECTION"],
        default: "ACTIVE"
    }
}, { timestamps: true });

export const Integration = mongoose.model("Integration", integrationSchema);
