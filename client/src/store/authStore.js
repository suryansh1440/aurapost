import { create } from "zustand"
import { toast } from "react-hot-toast"
import apiClient from "../utils/axios";

export const useAuthStore = create((set, get) => ({
    user:null,
    isAuthenticated: false,
    isSigningUp: false,
    isLoggingIn: false,
    isGoogleLoggingIn: false,
    isFacebookLoggingIn: false,
    isLoggingOut: false,
    isFetchingMe: true,
    isUpdatingProfile: false,
    isChangingPassword: false,
    isUpdatingNotifications: false,
    isDeactivatingAccount: false,
    isDeletingAccount: false,
    isExportingData: false,

    signupByEmail: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await apiClient.post("/auth/signupByEmail",data);

            if(res.data.success){
                set({user:res.data.user,isAuthenticated: true});
                toast.success(res.data.message)
                return res.data;
            }
            toast.error(res.data.message)
            return res.data;

        } catch (error) {
            console.log("error in signupByEmail", error.response?.data?.message || error.message)
            toast.error(error.response?.data?.message || "An error occurred")
            throw error.response?.data?.message || error.message;
        } finally {
            set({ isSigningUp: false });
        }
    },

    loginByEmail: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await apiClient.post("/auth/loginByEmail", data);

            if(res.data.success){
                set({user:res.data.user,isAuthenticated: true});
                toast.success(res.data.message)
                return res.data;
            }
            toast.error(res.data.message)
            return res.data;
            
        } catch (error) {
            console.log("error in loginByEmail", error.response?.data?.message || error.message)
            toast.error(error.response?.data?.message || "An error occurred")
            throw error.response?.data?.message || error.message;
        } finally {
            set({ isLoggingIn: false });
        }
    },

    googleLogin: async (credential) => {
        set({ isGoogleLoggingIn: true });
        try {
            const res = await apiClient.post("/auth/googleLogin", { credential });

            if(res.data.success){
                set({user:res.data.user,isAuthenticated: true});
                toast.success(res.data.message)
                return res.data;
            }
            toast.error(res.data.message)
            return res.data;
            
        } catch (error) {
            console.log("error in googleLogin", error.response?.data?.message || error.message)
            toast.error(error.response?.data?.message || "An error occurred")
            throw error.response?.data?.message || error.message;
        } finally {
            set({ isGoogleLoggingIn: false });
        }
    },

    facebookLogin: async (accessToken) => {
        set({ isFacebookLoggingIn: true });
        try {
            const res = await apiClient.post("/auth/facebookLogin", { accessToken });

            if(res.data.success){
                set({user:res.data.user,isAuthenticated: true});
                toast.success(res.data.message)
                return res.data;
            }
            toast.error(res.data.message)
            return res.data;
            
        } catch (error) {
            console.log("error in facebookLogin", error.response?.data?.message || error.message)
            toast.error(error.response?.data?.message || "An error occurred")
            throw error.response?.data?.message || error.message;
        } finally {
            set({ isFacebookLoggingIn: false });
        }
    },

    logout: async () => {
        set({ isLoggingOut: true });
        try {
            await apiClient.post("/auth/logout");
            set({user:null,isAuthenticated: false});
            toast.success("User logged out successfully")
            
        } catch (error) {
            console.log("error in logout", error.response?.data?.message || error.message)
            toast.error(error.response?.data?.message || "An error occurred")
        } finally {
            set({ isLoggingOut: false });
        }
    },

    getMe: async () => {
        set({ isFetchingMe: true });
        try {
            const res = await apiClient.get("/auth/me");
            if(res.data.success){
                set({user:res.data.user,isAuthenticated: true});
                return res.data;
            }
            return res.data;
        } catch (error) {
            console.log("error in getMe", error.response?.data?.message || error.message)
        } finally {
            set({ isFetchingMe: false });
        }
    },

    forgotPassword: async (email) => {
        try {
            const res = await apiClient.post("/auth/forgot-password", { email });
            if (res.data.success) {
                toast.success(res.data.message);
                return res.data;
            }
            toast.error(res.data.message);
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send OTP");
            throw error;
        }
    },

    verifyOtp: async (email, otp) => {
        try {
            const res = await apiClient.post("/auth/verify-otp", { email, otp });
            if (res.data.success) {
                toast.success(res.data.message);
                return res.data;
            }
            toast.error(res.data.message);
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid OTP");
            throw error;
        }
    },

    resetPassword: async (email, otp, newPassword) => {
        try {
            const res = await apiClient.post("/auth/reset-password", { email, otp, newPassword });
            if (res.data.success) {
                toast.success(res.data.message);
                return res.data;
            }
            toast.error(res.data.message);
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reset password");
            throw error;
        }
    },

    updateProfile: async (formData) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await apiClient.put("/auth/profile", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (res.data.success) {
                set({ user: res.data.user });
                toast.success(res.data.message);
                return res.data;
            }
            toast.error(res.data.message);
            return res.data;
        } catch (error) {
            console.log("error in updateProfile", error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || "Failed to update profile");
            throw error;
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    changePassword: async (oldPassword, newPassword) => {
        set({ isChangingPassword: true });
        try {
            const res = await apiClient.put("/auth/change-password", { oldPassword, newPassword });
            if (res.data.success) {
                toast.success(res.data.message);
                return res.data;
            }
            toast.error(res.data.message);
            return res.data;
        } catch (error) {
            console.log("error in changePassword", error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || "Failed to change password");
            throw error;
        } finally {
            set({ isChangingPassword: false });
        }
    },

    updateNotificationPreferences: async (preferences) => {
        set({ isUpdatingNotifications: true });
        try {
            const res = await apiClient.put("/auth/notification-preferences", { preferences });
            if (res.data.success) {
                set({ user: { ...get().user, notificationPreferences: res.data.preferences } });
                toast.success(res.data.message);
                return res.data;
            }
            toast.error(res.data.message);
            return res.data;
        } catch (error) {
            console.log("error in updateNotificationPreferences", error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || "Failed to update preferences");
            throw error;
        } finally {
            set({ isUpdatingNotifications: false });
        }
    },

    deactivateAccount: async () => {
        set({ isDeactivatingAccount: true });
        try {
            const res = await apiClient.put("/auth/account/deactivate");
            if (res.data.success) {
                set({ user: { ...get().user, isActive: res.data.isActive } });
                toast.success(res.data.message);
                return res.data;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to toggle account status");
        } finally {
            set({ isDeactivatingAccount: false });
        }
    },

    deleteAccount: async (password) => {
        set({ isDeletingAccount: true });
        try {
            const res = await apiClient.delete("/auth/account", { data: { password } });
            if (res.data.success) {
                set({ user: null, isAuthenticated: false });
                toast.success(res.data.message);
                return res.data;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete account");
        } finally {
            set({ isDeletingAccount: false });
        }
    },

    exportUserData: async () => {
        set({ isExportingData: true });
        try {
            const res = await apiClient.get("/auth/account/export");
            if (res.data.success) {
                const blob = new Blob([JSON.stringify(res.data.data, null, 2)], { type: "application/json" });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `aurapost-data-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                toast.success("Data exported successfully");
                return res.data;
            }
        } catch (error) {
            toast.error("Failed to export data");
        } finally {
            set({ isExportingData: false });
        }
    }
}))