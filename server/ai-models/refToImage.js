import axios from "axios";

/**
 * Multi-modal image generation using gpt-image-2 (/v1/images/edits endpoint).
 * It accepts multiple reference images (profile and outfit) and a text prompt.
 * 
 * @param {string} prompt - The text prompt
 * @param {Buffer} profileBuffer - Buffer of the profile/character reference image (image[0])
 * @param {Buffer} outfitBuffer - Buffer of the outfit/scene reference image (image[1])
 * @returns {Buffer} - The generated image buffer
 */
export const generateImageWithRefs = async (prompt, profileBuffer, outfitBuffer) => {
    console.log("🎨 Calling multi-modal gpt-image-2 (/v1/images/edits)...");

    const formData = new FormData();
    formData.append("model", "gpt-image-2");
    formData.append("prompt", prompt);
    formData.append("n", "1");
    formData.append("size", "1024x1024");
    formData.append("quality", "low");

    // Add reference images as file blobs
    // image[0] -> profile photo (character reference)
    // image[1] -> outfit/scene reference
    formData.append("image[]", new Blob([profileBuffer], { type: "image/jpeg" }), "profile.jpg");
    formData.append("image[]", new Blob([outfitBuffer], { type: "image/jpeg" }), "outfit.jpg");

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/images/edits",
            formData,
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
                },
            }
        );

        const imageData = response.data?.data?.[0];
        if (!imageData) {
            throw new Error("No image in response: " + JSON.stringify(response.data, null, 2));
        }

        const imageUrl = imageData.url;
        const b64Data = imageData.b64_json;

        let imageBuffer;
        if (imageUrl) {
            console.log("🔗 [Download] Fetching image from URL...");
            const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
            imageBuffer = Buffer.from(imageResponse.data);
        } else if (b64Data) {
            console.log("📦 [Processing] Converting Base64 data to image...");
            imageBuffer = Buffer.from(b64Data, "base64");
        } else {
            throw new Error("No image URL or Base64 data found in API response");
        }

        return imageBuffer;
    } catch (error) {
        console.error("❌ [generateImageWithRefs] Error:", error.response?.data || error.message);
        throw error;
    }
};
