import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,

    },
    phone: {
        type: String,
        required: function() { return this.authProvider === 'EMAIL'; },
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        required: function() { return this.authProvider === 'EMAIL'; },
        min: 8
    },
    role: {
        type: String,
        required: true,
        default: "USER",
        enum: ["USER", "ADMIN"]
    },
    profile: {
        avatar: {
            type: String,
            default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
        },
        bio: {
            type: String,
            default: ""
        },
        location: {
            type: String,
            default: ""
        },
        website: {
            type: String,
            default: ""
        },
    },
    isEmailVerified:{
        type:Boolean,
        default:false
    },
    isPhoneVerified:{
        type:Boolean,
        default:false
    },
    authProvider:{
        type:String,
        enum:["EMAIL","GOOGLE","FACEBOOK"],
        default:"EMAIL"
    },
    resetPasswordOTP: String,
    resetPasswordExpires: Date,
    createdAt: Date,
    updatedAt: Date
})

// Pre-save hook to hash password
userSchema.pre("save", async function() {
    if (!this.isModified("password")) return;
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};

export const User = mongoose.model("User", userSchema)