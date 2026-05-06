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

    fetchWorkspaces: async (page = 1, limit = 10, force = false) => {
        // If we already have workspaces and not forcing a refresh, return early
        if (!force && get().workspaces.length > 0 && get().pagination.currentPage === page) {
            return;
        }

        set({ isLoading: true });
        try {
            const res = await apiClient.get(`/workspaces?page=${page}&limit=${limit}`);
            if (res.data.success) {
                set({ 
                    workspaces: res.data.workspaces,
                    pagination: res.data.pagination 
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
}));
