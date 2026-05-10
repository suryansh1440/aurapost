import { create } from "zustand";
import { toast } from "react-hot-toast";
import apiClient from "../utils/axios";

export const useNotificationStore = create((set, get) => ({
    notifications: [],
    pendingInvites: [],
    isLoading: false,

    clearNotifications: () => set({ notifications: [], pendingInvites: [] }),

    fetchNotifications: async () => {
        set({ isLoading: true });
        try {
            const res = await apiClient.get("/notifications");
            if (res.data.success) {
                set({ 
                    notifications: res.data.notifications,
                    pendingInvites: res.data.pendingInvites
                });
            }
        } catch (error) {
            console.error("Error fetching notifications", error);
        } finally {
            set({ isLoading: false });
        }
    },

    markAsRead: async (id) => {
        try {
            // Optimistic UI update
            set(state => ({
                notifications: state.notifications.filter(n => n._id !== id)
            }));
            await apiClient.put(`/notifications/${id}/read`);
        } catch (error) {
            console.error("Error marking notification as read", error);
        }
    },

    acceptInvite: async (id) => {
        try {
            const res = await apiClient.post(`/workspaces/invitations/${id}/accept`);
            if (res.data.success) {
                set(state => ({
                    pendingInvites: state.pendingInvites.filter(inv => inv._id !== id)
                }));
                toast.success("Invitation accepted!");
                return true;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to accept invite");
            return false;
        }
    },

    rejectInvite: async (id) => {
        try {
            const res = await apiClient.post(`/workspaces/invitations/${id}/reject`);
            if (res.data.success) {
                set(state => ({
                    pendingInvites: state.pendingInvites.filter(inv => inv._id !== id)
                }));
                toast.success("Invitation declined");
                return true;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to decline invite");
            return false;
        }
    }
}));
