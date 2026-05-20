import { create } from "zustand";
import axios from "../utils/axios";
import { toast } from "react-hot-toast";

export const useAiModelStore = create((set, get) => ({
    aiModels: [],
    isLoading: false,
    error: null,

    fetchAiModels: async (workspaceId, silent = false) => {
        if (!silent) set({ isLoading: true });
        try {
            const response = await axios.get(`/ai-models/workspace/${workspaceId}`);
            set({ aiModels: response.data.models, isLoading: false });
        } catch (error) {
            set({ 
                error: error.response?.data?.message || "Error fetching AI models", 
                isLoading: false 
            });
            toast.error(get().error);
        }
    },

    fetchAiModelById: async (modelId) => {
        set({ isLoading: true });
        try {
            const response = await axios.get(`/ai-models/${modelId}`);
            set({ isLoading: false });
            return response.data.model;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || "Error fetching AI model", 
                isLoading: false 
            });
            toast.error(get().error);
            throw error;
        }
    },

    createAiModel: async (modelData) => {
        set({ isLoading: true });
        try {
            const response = await axios.post("/ai-models", modelData);
            set((state) => ({ 
                aiModels: [...state.aiModels, response.data.influencer],
                isLoading: false 
            }));
            toast.success("AI Model created successfully!");
            return response.data.influencer;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || "Error creating AI model", 
                isLoading: false 
            });
            toast.error(get().error);
            throw error;
        }
    },

    deleteAiModel: async (modelId) => {
        set({ isLoading: true });
        try {
            await axios.delete(`/ai-models/${modelId}`);
            set((state) => ({ 
                aiModels: state.aiModels.filter(m => m._id !== modelId),
                isLoading: false 
            }));
            toast.success("AI Model deleted successfully!");
        } catch (error) {
            set({ 
                error: error.response?.data?.message || "Error deleting AI model", 
                isLoading: false 
            });
            toast.error(get().error);
            throw error;
        }
    }
}));
