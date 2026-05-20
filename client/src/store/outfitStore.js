import { create } from "zustand";
import axios from "../utils/axios";
import { toast } from "react-hot-toast";

export const useOutfitStore = create((set, get) => ({
    outfits: [],
    isLoading: false,
    error: null,

    fetchOutfits: async (influencerId) => {
        set({ isLoading: true });
        try {
            const response = await axios.get(`/outfits/influencer/${influencerId}`);
            set({ outfits: response.data.outfits, isLoading: false });
        } catch (error) {
            set({ 
                error: error.response?.data?.message || "Error fetching outfits", 
                isLoading: false 
            });
            toast.error(get().error);
        }
    },

    createOutfit: async (formData) => {
        set({ isLoading: true });
        try {
            // Using multipart/form-data for image upload
            const response = await axios.post("/outfits", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            set((state) => ({ 
                outfits: [response.data.outfit, ...state.outfits],
                isLoading: false 
            }));
            toast.success("Outfit added to gallery!");
            return response.data.outfit;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || "Error creating outfit", 
                isLoading: false 
            });
            toast.error(get().error);
            throw error;
        }
    },

    deleteOutfit: async (outfitId) => {
        set({ isLoading: true });
        try {
            await axios.delete(`/outfits/${outfitId}`);
            set((state) => ({ 
                outfits: state.outfits.filter(o => o._id !== outfitId),
                isLoading: false 
            }));
            toast.success("Outfit removed!");
        } catch (error) {
            set({ 
                error: error.response?.data?.message || "Error deleting outfit", 
                isLoading: false 
            });
            toast.error(get().error);
            throw error;
        }
    }
}));
