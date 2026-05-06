import { User } from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";
import { sendEmail } from "../services/mail.service.js";
import { OTP_TEMPLATE } from "../constants/emailTemplates.js";
import { generateOTP } from "../utils/generateOtp.js";
import { uploadOnCloudinary } from "../services/cloudinary.js";

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required", success: false });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found with this email", success: false });
        }

        const otp = generateOTP();
        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        const htmlContent = OTP_TEMPLATE(user.name, otp);
        const emailSent = await sendEmail(email, "Reset Your Password - AuraPost", htmlContent);
        
        if (!emailSent) {
            return res.status(500).json({ message: "Failed to send OTP email", success: false });
        }

        return res.status(200).json({ message: "OTP sent to your email", success: true });
    } catch (error) {
        console.log("error in forgotPassword controller", error.message);
        return res.status(500).json({ message: error.message, success: false });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required", success: false });
        }

        const user = await User.findOne({ 
            email, 
            resetPasswordOTP: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired OTP", success: false });
        }

        return res.status(200).json({ message: "OTP verified successfully", success: true });
    } catch (error) {
        console.log("error in verifyOtp controller", error.message);
        return res.status(500).json({ message: error.message, success: false });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const user = await User.findOne({ 
            email, 
            resetPasswordOTP: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired OTP", success: false });
        }

        

        user.password = newPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return res.status(200).json({ message: "Password reset successful", success: true });
    } catch (error) {
        console.log("error in resetPassword controller", error.message);
        return res.status(500).json({ message: error.message, success: false });
    }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


export const getMe = (req,res) => {
    try {
        const user = req.user;
        return res.status(200).json({ message: "User fetched successfully", success: true, user })
    } catch (error) {
        console.log("error in me controller", error.message);
        return res.status(500).json({ message: error.message, success: false })
    }
}

export const signupByEmail = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({ message: "All fields are required", success: false })
        }

        // check is email or phone is allready exist 
        const emailUserExists = await User.findOne({ email })
        if (emailUserExists) {
            return res.status(400).json({ message: "Email already exists", success: false })
        }
        const phoneUserExists = await User.findOne({ phone })
        if (phoneUserExists) {
            return res.status(400).json({ message: "Phone number already exists", success: false })
        }

        const user = await User.create({ name, email, phone, password })

        // filter password from user
        const { password: _, ...filteredUser } = user.toObject();

        // Generate JWT token
        generateToken(filteredUser._id,res);        

        return res.status(201).json({ message: "User created successfully", success: true, user: filteredUser })

    } catch (error) {
        console.log("error in signupByEmail controller", error.message);
        return res.status(500).json({ message: error.message, success: false })
    }
}


export const loginByEmail = async (req,res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required", success: false })
        }

        // check if email exists 
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Email not found", success: false })
        }

        // check password using model method
        const isPasswordValid = await user.comparePassword(password)
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password", success: false })
        }

        // filter password from user
        const { password: _, ...filteredUser } = user.toObject();

        // Generate JWT token
        generateToken(filteredUser._id,res);        

        return res.status(200).json({ message: "Login successful", success: true, user: filteredUser })

    } catch (error) {
        console.log("error in loginByEmail controller", error.message);
        return res.status(500).json({ message: error.message, success: false })
    }
}


export const logout = async (req,res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0})
        res.status(200).json({message: "User logged out successfully", success: true})
        
    } catch (error) {
        console.log("error in logout controller", error.message);
        return res.status(500).json({ message: error.message, success: false })
    }
}

export const googleLogin = async (req, res) => {
    const { credential } = req.body; // In this case, credential is the access_token
    if (!credential) {
        return res.status(400).json({ message: 'No credential provided', success: false });
    }
    try {
        // Fetch user info using the access_token
        let userInfoRes;
        try {
            userInfoRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${credential}` }
            });
        } catch (error) {
            return res.status(400).json({ message: 'Invalid Google token', success: false });
        }
        
        const payload = userInfoRes.data;
        if (!payload || !payload.email) {
            return res.status(400).json({ message: 'Invalid Google token payload', success: false });
        }
        
        let user = await User.findOne({ email: payload.email });
        if (!user) {
            user = new User({
                name: payload.name,
                email: payload.email,
                profile: { avatar: payload.picture },
                authProvider: 'GOOGLE',
            });
            await user.save();
        } else {
            let updated = false;
            if (user.name !== payload.name) {
                user.name = payload.name;
                updated = true;
            }
            if (user.authProvider !== 'GOOGLE') {
                user.authProvider = 'GOOGLE';
                updated = true;
            }
            if (!user.profile?.avatar || user.profile.avatar === "https://cdn-icons-png.flaticon.com/512/149/149071.png") {
                user.profile = { ...user.profile, avatar: payload.picture };
                updated = true;
            }
            if (updated) await user.save();
        }
        
        const userObj = user.toObject();
        const { password: _, ...filteredUser } = userObj;
        
        generateToken(filteredUser._id, res);
        
        return res.status(200).json({ message: "Google login successful", success: true, user: filteredUser });
    } catch (error) {
        console.log('Error in googleLogin controller', error);
        return res.status(500).json({ message: 'Google login failed', success: false });
    }
};

export const facebookLogin = async (req, res) => {
    const { accessToken } = req.body;
    if (!accessToken) {
        return res.status(400).json({ message: 'No access token provided', success: false });
    }
    try {
        let userInfoRes;
        try {
            userInfoRes = await axios.get(`https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${accessToken}`);
        } catch (error) {
            return res.status(400).json({ message: 'Invalid Facebook token', success: false });
        }
        
        const payload = userInfoRes.data;
        if (!payload || !payload.email) {
            return res.status(400).json({ message: 'Invalid Facebook token payload (Email missing)', success: false });
        }
        
        let user = await User.findOne({ email: payload.email });
        if (!user) {
            user = new User({
                name: payload.name,
                email: payload.email,
                profile: { avatar: payload.picture?.data?.url || "" },
                authProvider: 'FACEBOOK',
            });
            await user.save();
        } else {
            let updated = false;
            if (user.name !== payload.name) {
                user.name = payload.name;
                updated = true;
            }
            if (user.authProvider !== 'FACEBOOK') {
                user.authProvider = 'FACEBOOK';
                updated = true;
            }
            const fbAvatar = payload.picture?.data?.url;
            if (fbAvatar && (!user.profile?.avatar || user.profile.avatar === "https://cdn-icons-png.flaticon.com/512/149/149071.png")) {
                user.profile = { ...user.profile, avatar: fbAvatar };
                updated = true;
            }
            if (updated) await user.save();
        }
        
        const userObj = user.toObject();
        const { password: _, ...filteredUser } = userObj;
        
        generateToken(filteredUser._id, res);
        
        return res.status(200).json({ message: "Facebook login successful", success: true, user: filteredUser });
    } catch (error) {
        console.log('Error in facebookLogin controller', error);
        return res.status(500).json({ message: 'Facebook login failed', success: false });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { name, bio, location, website } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        if (name) user.name = name;
        
        // Prepare updated profile object
        const updatedProfile = { ...user.profile.toObject() };
        if (bio !== undefined) updatedProfile.bio = bio;
        if (location !== undefined) updatedProfile.location = location;
        if (website !== undefined) updatedProfile.website = website;

        if (req.file) {
            const result = await uploadOnCloudinary(req.file.buffer, "avatars");
            if (result) {
                updatedProfile.avatar = result.secure_url;
            }
        }

        user.profile = updatedProfile;
        await user.save();

        const userObj = user.toObject();
        const { password: _, ...filteredUser } = userObj;

        return res.status(200).json({ 
            message: "Profile updated successfully", 
            success: true, 
            user: filteredUser 
        });
    } catch (error) {
        console.log("error in updateProfile controller", error.message);
        return res.status(500).json({ message: error.message, success: false });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id).select("+password");

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect old password", success: false });
        }

        user.password = newPassword;
        await user.save();

        return res.status(200).json({ message: "Password updated successfully", success: true });
    } catch (error) {
        console.log("error in changePassword controller", error.message);
        return res.status(500).json({ message: error.message, success: false });
    }
};

export const updateNotificationPreferences = async (req, res) => {
    try {
        const { preferences } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        user.notificationPreferences = preferences;
        await user.save();

        return res.status(200).json({ 
            message: "Notification preferences updated successfully", 
            success: true,
            preferences: user.notificationPreferences
        });
    } catch (error) {
        console.log("error in updateNotificationPreferences controller", error.message);
        return res.status(500).json({ message: error.message, success: false });
    }
};

export const deactivateAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.isActive = !user.isActive;
        await user.save();
        return res.status(200).json({ 
            message: `Account ${user.isActive ? 'activated' : 'deactivated'} successfully`, 
            success: true, 
            isActive: user.isActive 
        });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};

export const deleteAccount = async (req, res) => {
    try {
        const { password } = req.body;
        const user = await User.findById(req.user._id).select("+password");
        
        if (user.authProvider === 'EMAIL') {
            const isMatch = await user.comparePassword(password);
            if (!isMatch) return res.status(400).json({ message: "Incorrect password", success: false });
        }

        await User.findByIdAndDelete(req.user._id);
        return res.status(200).json({ message: "Account deleted permanently", success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};

export const exportUserData = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const data = {
            user: {
                name: user.name,
                email: user.email,
                profile: user.profile,
                notificationPreferences: user.notificationPreferences,
                createdAt: user.createdAt
            },
            exportedAt: new Date()
        };
        return res.status(200).json({ data, success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};