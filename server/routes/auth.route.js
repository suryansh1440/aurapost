import { Router } from "express";
import { loginByEmail, logout, signupByEmail, googleLogin, facebookLogin, getMe, forgotPassword, verifyOtp, resetPassword, updateProfile, changePassword, updateNotificationPreferences, deactivateAccount, deleteAccount, exportUserData } from "../controllers/auth.controller.js";
import { authLimiter } from "../middleware/rateLimiter.middleware.js";
import { protect } from "../middleware/protect.middleware.js";
import upload from "../middleware/multer.js";

const router = Router();

router.get("/me", protect, getMe)
router.post("/signupByEmail", authLimiter, signupByEmail)
router.post("/loginByEmail", authLimiter, loginByEmail)
router.post("/googleLogin", authLimiter, googleLogin)
router.post("/facebookLogin", authLimiter, facebookLogin)
router.post("/logout", protect, logout)

router.put("/profile", protect, upload.single("avatar"), updateProfile)
router.put("/change-password", protect, changePassword)
router.put("/notification-preferences", protect, updateNotificationPreferences)
router.put("/account/deactivate", protect, deactivateAccount)
router.delete("/account", protect, deleteAccount)
router.get("/account/export", protect, exportUserData)

router.post("/forgot-password", forgotPassword)
router.post("/verify-otp", verifyOtp)
router.post("/reset-password", resetPassword)

export default router;