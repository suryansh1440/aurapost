import { create } from "zustand";
import { toast } from "react-hot-toast";
import apiClient from "../utils/axios";

export const useWorkspaceStore = create((set, get) => ({
    workspaces: [],
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalWorkspaces: 0,
        limit: 10
    },
    isLoading: false,
    isCreating: false,
    isDeleting: false,
    isUpdating: false,
    hasFullList: false,  // true only after a real list fetch

    clearWorkspaces: () => set({ 
        workspaces: [], 
        pagination: { currentPage: 1, totalPages: 1, totalWorkspaces: 0, limit: 10 },
        hasFullList: false 
    }),

    fetchWorkspaces: async (page = 1, limit = 10, force = false) => {
        // Skip only if we've done a real full-list fetch already (not just a single fetchById)
        if (!force && get().hasFullList && get().pagination.currentPage === page) {
            return;
        }

        set({ isLoading: true });
        try {
            const res = await apiClient.get(`/workspaces?page=${page}&limit=${limit}`);
            if (res.data.success) {
                set({ 
                    workspaces: res.data.workspaces,
                    pagination: res.data.pagination,
                    hasFullList: true,  // mark that we have the full list
                });
            }
        } catch (error) {
            console.error("Error fetching workspaces", error);
            toast.error(error.response?.data?.message || "Failed to fetch workspaces");
        } finally {
            set({ isLoading: false });
        }
    },

    createWorkspace: async (data) => {
        set({ isCreating: true });
        try {
            const isFormData = data instanceof FormData;
            const res = await apiClient.post("/workspaces", data, {
                headers: isFormData ? { "Content-Type": "multipart/form-data" } : {}
            });
            if (res.data.success) {
                set((state) => ({ workspaces: [res.data.workspace, ...state.workspaces] }));
                toast.success(res.data.message);
                return res.data;
            }
        } catch (error) {
            console.error("Error creating workspace", error);
            toast.error(error.response?.data?.message || "Failed to create workspace");
            throw error;
        } finally {
            set({ isCreating: false });
        }
    },

    updateWorkspace: async (id, data) => {
        set({ isUpdating: true });
        try {
            const isFormData = data instanceof FormData;
            const res = await apiClient.put(`/workspaces/${id}`, data, {
                headers: isFormData ? { "Content-Type": "multipart/form-data" } : {}
            });
            if (res.data.success) {
                set((state) => ({
                    workspaces: state.workspaces.map((ws) => (ws._id === id ? res.data.workspace : ws)),
                }));
                toast.success(res.data.message);
                return res.data;
            }
        } catch (error) {
            console.error("Error updating workspace", error);
            toast.error(error.response?.data?.message || "Failed to update workspace");
            throw error;
        } finally {
            set({ isUpdating: false });
        }
    },

    deleteWorkspace: async (id) => {
        set({ isDeleting: true });
        try {
            const res = await apiClient.delete(`/workspaces/${id}`);
            if (res.data.success) {
                set((state) => ({
                    workspaces: state.workspaces.filter((ws) => ws._id !== id),
                }));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error("Error deleting workspace", error);
            toast.error(error.response?.data?.message || "Failed to delete workspace");
            throw error;
        } finally {
            set({ isDeleting: false });
        }
    },

    fetchWorkspaceById: async (id) => {
        // First check if we have it in our store
        const existing = get().workspaces.find(ws => ws._id === id);
        if (existing) return existing;

        set({ isLoading: true });
        try {
            const res = await apiClient.get(`/workspaces/${id}`);
            if (res.data.success) {
                set(state => ({
                    // Add to list but do NOT set hasFullList — this is a single-item fetch
                    workspaces: state.workspaces.some(w => w._id === id) 
                        ? state.workspaces.map(w => w._id === id ? res.data.workspace : w)
                        : [...state.workspaces, res.data.workspace]
                }));
                return res.data.workspace;
            }
        } catch (error) {
            console.error("Error fetching workspace by id", error);
        } finally {
            set({ isLoading: false });
        }
    },

    inviteMember: async (workspaceId, email, role) => {
        try {
            const res = await apiClient.post(`/workspaces/${workspaceId}/invite`, { email, role });
            if (res.data.success) {
                toast.success(res.data.message);
                return true;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to invite user");
            return false;
        }
    },

    updateMemberRole: async (workspaceId, userId, role) => {
        try {
            const res = await apiClient.put(`/workspaces/${workspaceId}/members/${userId}`, { role });
            if (res.data.success) {
                toast.success(res.data.message);
                // Optionally update the local workspace object if needed
                return true;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update role");
            return false;
        }
    },

    removeMember: async (workspaceId, userId) => {
        try {
            const res = await apiClient.delete(`/workspaces/${workspaceId}/members/${userId}`);
            if (res.data.success) {
                toast.success(res.data.message);
                return true;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to remove member");
            return false;
        }
    },

    fetchConnectedAccounts: async (workspaceId) => {
        try {
            const res = await apiClient.get(`/social/workspace/${workspaceId}`);
            if (res.data.success) {
                return res.data.integrations;
            }
        } catch (error) {
            console.error("Error fetching connected accounts", error);
            return [];
        }
    },

    connectMetaAccount: async (workspaceId, code) => {
        try {
            const res = await apiClient.post(`/social/meta/connect`, { workspaceId, code });
            if (res.data.success) {
                toast.success(res.data.message);
                toast.success(res.data.message);
                return res.data;
            }
        } catch (error) {
            console.error("Error connecting meta account", error);
            toast.error(error.response?.data?.message || "Failed to connect account");
            return null;
        }
    },

    selectMetaPage: async (integrationId, page) => {
        try {
            const res = await apiClient.post(`/social/meta/select-page`, { integrationId, page });
            if (res.data.success) {
                toast.success(res.data.message);
                return res.data.integration;
            }
        } catch (error) {
            console.error("Error selecting meta page", error);
            toast.error(error.response?.data?.message || "Failed to select page");
            return null;
        }
    },

    disconnectAccount: async (integrationId) => {
        try {
            const res = await apiClient.delete(`/social/${integrationId}`);
            if (res.data.success) {
                toast.success(res.data.message);
                return true;
            }
        } catch (error) {
            console.error("Error disconnecting account", error);
            toast.error(error.response?.data?.message || "Failed to disconnect account");
            return false;
        }
    }
}));
