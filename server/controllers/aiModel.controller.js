import Influencer from "../models/influencer.model.js";
import Workplace from "../models/workplace.model.js";
import Outfit from "../models/outfit.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../services/cloudinary.js";
import { getModel, AI_MODELS } from "../ai-models/index.js";

// @desc    Create a new AI Model (Influencer)
// @route   POST /api/ai-models
// @access  Private
export const createAiModel = async (req, res) => {
    try {
        const { 
            workspaceId, name, nationality, ageRange, gender, niche, 
            traits, backstory, sliders, captionStyle, modelType,
            generationMethod = "ai" 
        } = req.body;

        if (!workspaceId || !name) {
            return res.status(400).json({ success: false, message: "Workspace ID and Name are required" });
        }

        // Verify workspace access
        const workspace = await Workplace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ success: false, message: "Workspace not found" });
        }

        // Create the model FIRST
        const influencer = await Influencer.create({
            workspaceId,
            name,
            nationality,
            ageRange,
            gender,
            niche,
            traits,
            backstory,
            sliders,
            captionStyle,
            modelType,
            profilePhotoUrl: "",
            isGenerating: generationMethod === "ai",
            completionScore: 20 
        });

        // Send response immediately
        res.status(201).json({
            success: true,
            influencer,
            message: generationMethod === "ai" ? "AI Model generation started" : "AI Model created. Please upload a profile photo."
        });

        // Option 1: Generate with AI (Run asynchronously)
        if (generationMethod === "ai") {
            const runGeneration = async () => {
                try {
                    // Construct the prompt based on traits
                    const attireText = traits?.attire && traits.attire.length > 0 ? `wearing ${traits.attire.join(", ")}, ` : "";
                    const uniqueFeaturesText = traits?.uniqueFeatures && traits.uniqueFeatures.length > 0 ? `with ${traits.uniqueFeatures.join(", ")}, ` : "";
                    const tattoosText = traits?.tattoos && traits.tattoos.length > 0 ? `visible tattoos like ${traits.tattoos.join(", ")}, ` : "";
                    const facialHairText = traits?.facialHair && !["None", "Clean Shaven"].includes(traits.facialHair) ? `${traits.facialHair}, ` : "";
                    const faceShapeText = traits?.faceShape && traits.faceShape !== "Neutral" ? `${traits.faceShape} face shape, ` : "";
                    const makeupText = traits?.makeup && traits.makeup !== "None" ? `wearing ${traits.makeup} makeup, ` : "";
                    const clothingStyle = traits?.clothingStyle || "premium fashionable attire";
                    
                    let styleDirective = "photorealistic, 8k resolution, elegant composition";
                    if (modelType === "Anime") styleDirective = "Japanese anime style, vibrant colors, sharp lines, stylized features, high-quality illustration";
                    if (modelType === "Cartoon") styleDirective = "3D Disney/Pixar animation style, smooth textures, expressive character, high-quality 3D render";
                    if (modelType === "Eternal") styleDirective = "ethereal glow, mystical atmosphere, angelic features, divine lighting, photorealistic but magical";
                    if (modelType === "Robot/Cybernetic") styleDirective = "futuristic android, visible cybernetic parts, mechanical details, glowing LED accents, photorealistic metallic textures";

                    const prompt = `Medium shot portrait, chest-up framing, of a ${nationality} ${gender} ${modelType === 'Real Human' ? '' : modelType + ' style'}, age ${ageRange}, ${traits?.skinTone || "wheatish"} skin tone, ${traits?.build || "slim"} physique, ${faceShapeText}${traits?.eyeColor || "brown"} eyes, ${traits?.hairLength || "long"} ${traits?.hairTexture || "wavy"} ${traits?.hairColor || "brown"} hair. 
                    ${facialHairText}${makeupText}${uniqueFeaturesText}${tattoosText}${attireText}Wearing high-quality ${clothingStyle}. Expression: ${traits?.expression || "neutral/friendly"}, Lighting: ${traits?.lighting || "soft daylight"}, ${styleDirective}.`;

                    console.log("🎨 [AI Generation] Calling modular model:", AI_MODELS.GPT_IMAGE_2, "for:", name);
                    
                    const modelImplementation = getModel(AI_MODELS.GPT_IMAGE_2);
                    const imageBuffer = await modelImplementation.generateImage(prompt, {
                        size: "1024x1024",
                        quality: "low"
                    });

                    if (imageBuffer) {
                        console.log("☁️ [Cloudinary] Uploading generated image...");
                        const uploadResult = await uploadOnCloudinary(imageBuffer, "model/images");
                        
                        await Influencer.findByIdAndUpdate(influencer._id, {
                            profilePhotoUrl: uploadResult?.secure_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
                            isGenerating: false,
                            completionScore: 80
                        });
                        
                        if (uploadResult?.secure_url) {
                            await Outfit.create({
                                workspaceId,
                                influencerId: influencer._id,
                                photoUrl: uploadResult.secure_url,
                                canBeRemoved: false
                            });
                        }
                        
                        console.log("✅ [AI Generation] Model generation & Outfit creation completed for:", name);
                    }
                } catch (genError) {
                    console.error("AI Generation failed:", genError.message);
                    // Fallback to placeholder if AI fails
                    await Influencer.findByIdAndUpdate(influencer._id, {
                        profilePhotoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
                        isGenerating: false,
                        completionScore: 80
                    });
                }
            };
            
            // Fire and forget
            runGeneration();
        }
    } catch (error) {
        console.error("Error in createAiModel:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Upload Profile Photo for AI Model
// @route   POST /api/ai-models/:modelId/image
// @access  Private
export const uploadAiModelImage = async (req, res) => {
    try {
        const { modelId } = req.params;
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image file provided" });
        }

        const model = await Influencer.findById(modelId);
        if (!model) {
            return res.status(404).json({ success: false, message: "AI Model not found" });
        }

        // Upload to Cloudinary
        const uploadResult = await uploadOnCloudinary(req.file.buffer, "model/images");
        
        if (!uploadResult) {
            return res.status(500).json({ success: false, message: "Cloudinary upload failed" });
        }

        model.profilePhotoUrl = uploadResult.secure_url;
        model.completionScore = Math.max(model.completionScore, 80);
        await model.save();

        res.status(200).json({
            success: true,
            profilePhotoUrl: uploadResult.secure_url,
            message: "Profile photo uploaded successfully"
        });
    } catch (error) {
        console.error("Error in uploadAiModelImage:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Get all AI Models for a workspace
// @route   GET /api/ai-models/workspace/:workspaceId
// @access  Private
export const getAiModelsByWorkspace = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const models = await Influencer.find({ workspaceId, isActive: true }).sort({ updatedAt: -1 });
        res.status(200).json({ success: true, models });
    } catch (error) {
        console.error("Error in getAiModelsByWorkspace:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
// @desc    Get a single AI Model by ID
// @route   GET /api/ai-models/:modelId
// @access  Private
export const getAiModelById = async (req, res) => {
    try {
        const { modelId } = req.params;
        const model = await Influencer.findById(modelId);
        
        if (!model) {
            return res.status(404).json({ success: false, message: "AI Model not found" });
        }

        res.status(200).json({ success: true, model });
    } catch (error) {
        console.error("Error in getAiModelById:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Delete AI Model
// @route   DELETE /api/ai-models/:modelId
// @access  Private
export const deleteAiModel = async (req, res) => {
    try {
        const { modelId } = req.params;
        const model = await Influencer.findById(modelId);

        if (!model) {
            return res.status(404).json({ success: false, message: "AI Model not found" });
        }

        let imageDeleted = false;
        if (model.profilePhotoUrl && model.profilePhotoUrl.includes("cloudinary.com")) {
            const result = await deleteFromCloudinary(model.profilePhotoUrl);
            if (result) {
                console.log("✅ Image deleted successfully from Cloudinary");
                imageDeleted = true;
            }
        }

        await Influencer.findByIdAndDelete(modelId);

        res.status(200).json({
            success: true,
            message: imageDeleted ? "AI Model and generated image deleted successfully" : "AI Model deleted successfully"
        });
    } catch (error) {
        console.error("Error in deleteAiModel:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
