import Outfit from "../models/outfit.model.js";
import Influencer from "../models/influencer.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../services/cloudinary.js";
import mongoose from "mongoose";
import axios from "axios";
import { generateImageWithRefs } from "../ai-models/refToImage.js";
import { compressImage } from "../utils/imageProcess.js";

// @desc    Create a new Outfit (AI Powered)
// @route   POST /api/outfits
// @access  Private
export const createOutfit = async (req, res) => {
    try {
        const {
            workspaceId,
            influencerId,
            copyBackground,
            copyOutfit,
            copyPose,
            copyAccessories,
            sourceOutfitId
        } = req.body;

        if (!workspaceId || !influencerId) {
            return res.status(400).json({ success: false, message: "Workspace ID and Influencer ID are required" });
        }

        const influencer = await Influencer.findById(influencerId);
        if (!influencer) {
            return res.status(404).json({ success: false, message: "Influencer not found" });
        }

        // 1. Get Reference Image & Metadata Defaults
        let referenceSource = null;
        if (req.file) {
            referenceSource = req.file.buffer;
        }

        if (!referenceSource) {
            return res.status(400).json({ success: false, message: "No reference image provided" });
        }

        // Determine Model Image (Character context)
        let modelImageUrl = influencer.profilePhotoUrl;
        let isModelSourceUrl = true;

        if (sourceOutfitId) {
            const sourceOutfit = await Outfit.findById(sourceOutfitId);
            if (sourceOutfit) {
                modelImageUrl = sourceOutfit.photoUrl;
            }
        }

        // 2. Decide if AI Generation is needed
        const isAiGenNeeded = (copyBackground === 'true' || copyBackground === true ||
            copyOutfit === 'true' || copyOutfit === true ||
            copyPose === 'true' || copyPose === true ||
            copyAccessories === 'true' || copyAccessories === true);

        if (!isAiGenNeeded) {
            // Direct Upload (Blocking)
            const uploadResult = await uploadOnCloudinary(referenceSource, "outfits");
            const outfit = await Outfit.create({
                workspaceId,
                influencerId,
                photoUrl: uploadResult.secure_url
            });
            return res.status(201).json({ success: true, outfit, message: "Outfit created successfully" });
        }

        // --- NON-BLOCKING AI GENERATION ---

        // A. Create Placeholder Outfit
        const placeholderOutfit = await Outfit.create({
            workspaceId,
            influencerId,
            photoUrl: "generating", // Bypass Mongoose required validation
            isGenerating: true,
            canBeRemoved: true
        });

        // Respond immediately
        res.status(201).json({
            success: true,
            outfit: placeholderOutfit,
            message: "Outfit AI generation started in background"
        });

        // B. Run Async Pipeline
        (async () => {
            try {
                console.log("🚀 [AI Generation] Starting Outfit Remix pipeline for:", influencer.name);

                // 1. Compress for Generation (Buffers needed, not Base64 strings)
                const profileBuffer = await compressImage(modelImageUrl, true);
                const outfitBuffer = await compressImage(referenceSource, false);

                // 2. Build the Prompt Dynamically based on Options
                const t = influencer.traits || {};
                
                // Strictly extract ONLY character consistency traits to avoid confusing the AI
                const physicalTraits = [];
                if (t.faceShape) physicalTraits.push(`Face Shape: ${t.faceShape}`);
                if (t.skinTone) physicalTraits.push(`Skin Tone: ${t.skinTone}`);
                if (t.eyeColor) physicalTraits.push(`Eye Color: ${t.eyeColor}`);
                if (t.build) physicalTraits.push(`Body Build: ${t.build}`);
                if (t.hairLength || t.hairColor || t.hairTexture) {
                    physicalTraits.push(`Hair: ${[t.hairLength, t.hairTexture, t.hairColor].filter(Boolean).join(" ")}`);
                }
                if (t.facialHair && t.facialHair !== 'None') physicalTraits.push(`Facial Hair: ${t.facialHair}`);
                if (t.makeup && t.makeup !== 'None') physicalTraits.push(`Makeup Style: ${t.makeup}`);
                if (t.tattoos && t.tattoos.length > 0) physicalTraits.push(`Tattoos: ${t.tattoos.join(", ")}`);
                if (t.uniqueFeatures && t.uniqueFeatures.length > 0) physicalTraits.push(`Unique Features: ${t.uniqueFeatures.join(", ")}`);
                if (t.attire && t.attire.length > 0) physicalTraits.push(`Core Identity Attire: ${t.attire.join(", ")}`);

                const characterString = physicalTraits.length > 0 
                    ? physicalTraits.map(pt => `- ${pt}`).join("\n")
                    : "- Match the reference photo exactly.";

                const outfitSection = (copyOutfit === 'true' || copyOutfit === true)
                    ? `OUTFIT & ATTIRE — COPY EXACTLY from the second reference image:
- Reproduce every clothing item, fabric texture, and color faithfully.
- The subject should wear the exact same outfit as seen in the second image.`
                    : `OUTFIT & ATTIRE — DO NOT COPY the outfit from the reference image. Use stylish, professional attire instead.`;

                const accessoriesSection = (copyAccessories === 'true' || copyAccessories === true)
                    ? `ACCESSORIES — COPY EXACTLY from the second reference image:
- Replicate all jewelry, bags, hats, glasses, or other accessories seen in the reference.`
                    : `ACCESSORIES — DO NOT COPY any accessories from the reference image. Keep it minimal unless specified by character traits.`;

                const backgroundSection = (copyBackground === 'true' || copyBackground === true)
                    ? `BACKGROUND & AESTHETIC — COPY EXACTLY from the second reference image:
- Reproduce the exact setting, lighting, and any photographic filters or post-processing effects.
- Match the color grading, film grain, contrast, and overall atmosphere perfectly.`
                    : `BACKGROUND & AESTHETIC — DO NOT COPY the background from the reference image. Use a clean, professional studio setting with neutral lighting.`;

                const poseSection = (copyPose === 'true' || copyPose === true)
                    ? `POSE & POSTURE — COPY EXACTLY from the second reference image:
- Replicate the exact body posture, camera angle, and framing of the subject.`
                    : `POSE & POSTURE — DO NOT COPY the pose from the reference image. Use a standard portrait or lifestyle pose instead.`;

                const finalPrompt = `
A photorealistic, high-end professional cinematic portrait of ${influencer.name}, a ${influencer.nationality} ${influencer.gender?.toLowerCase() || 'person'}, age ${influencer.ageRange}.

${poseSection}
${outfitSection}
${accessoriesSection}
${backgroundSection}

EXPRESSION & REALISM:
- Give the subject a natural, authentic facial expression that matches the mood of the scene.
- Ensure the skin texture is realistic with fine details, pores, and natural imperfections (no heavy airbrushing).
- The final image must look like a raw, unedited professional photograph.

CHARACTER CONSISTENCY:
Ensure the subject matches the person in the first reference photo exactly. Strictly enforce the following character traits:
${characterString}
`.trim();

                // 3. Generate using Multi-modal gpt-image-2
                console.log("🎨 Calling multi-modal model with prompt...");
                const finalImageBuffer = await generateImageWithRefs(finalPrompt, profileBuffer, outfitBuffer);

                // Upload to Cloudinary
                console.log("☁️ Uploading to Cloudinary...");
                const uploadResult = await uploadOnCloudinary(finalImageBuffer, "outfits");
                if (!uploadResult) throw new Error("Cloudinary upload failed");

                // Update DB
                await Outfit.findByIdAndUpdate(placeholderOutfit._id, {
                    photoUrl: uploadResult.secure_url,
                    isGenerating: false,
                    isFailed: false
                });

                console.log(`✅ AI Outfit generated successfully for ${influencer.name}`);

            } catch (error) {
                console.error("❌ Background Outfit Generation failed:", error.message);
                await Outfit.findByIdAndUpdate(placeholderOutfit._id, {
                    isGenerating: false,
                    isFailed: true
                });
            }
        })();

    } catch (error) {
        console.error("Error in createOutfit:", error.message);
        res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
};

// @desc    Get all Outfits for an influencer
// @route   GET /api/outfits/influencer/:influencerId
// @access  Private
export const getOutfitsByInfluencer = async (req, res) => {
    try {
        const { influencerId } = req.params;
        const outfits = await Outfit.find({ influencerId, isActive: true }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, outfits });
    } catch (error) {
        console.error("Error in getOutfitsByInfluencer:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Delete Outfit
// @route   DELETE /api/outfits/:outfitId
// @access  Private
export const deleteOutfit = async (req, res) => {
    try {
        const { outfitId } = req.params;
        const outfit = await Outfit.findById(outfitId);

        if (!outfit) {
            return res.status(404).json({ success: false, message: "Outfit not found" });
        }

        if (outfit.canBeRemoved === false) {
            return res.status(403).json({ success: false, message: "This outfit is tied to the AI Model's core identity and cannot be removed." });
        }

        // Delete from Cloudinary if it's a valid URL
        if (outfit.photoUrl && outfit.photoUrl !== "generating" && outfit.photoUrl.includes("cloudinary.com")) {
            await deleteFromCloudinary(outfit.photoUrl);
        }

        await Outfit.findByIdAndDelete(outfitId);

        res.status(200).json({
            success: true,
            message: "Outfit deleted successfully"
        });
    } catch (error) {
        console.error("Error in deleteOutfit:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
