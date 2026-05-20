import axios from "axios";

/**
 * AI Model: textToImageGPT-image-2
 * Description: Generates images using OpenAI's DALL-E / GPT Image models.
 */
export const generateImage = async (prompt, settings = {}) => {
    try {
        const { size = "1024x1024", quality = "low" } = settings;
        
        console.log("🎨 [textToImageGPT-image-2] Generating image with prompt:", prompt.substring(0, 50) + "...");

        const response = await axios.post('https://api.openai.com/v1/images/generations', {
            model: "gpt-image-2", // Using gpt-image-2 as requested
            prompt: prompt,
            n: 1,
            size: size,
            quality: quality
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.data?.data[0]) {
            const imageData = response.data.data[0];
            let imageBuffer;

            if (imageData.url) {
                const imageResponse = await axios.get(imageData.url, { responseType: 'arraybuffer' });
                imageBuffer = Buffer.from(imageResponse.data);
            } else if (imageData.b64_json) {
                imageBuffer = Buffer.from(imageData.b64_json, 'base64');
            }

            return imageBuffer;
        } else {
            throw new Error("No image data returned from OpenAI");
        }
    } catch (error) {
        console.error("❌ [textToImageGPT-image-2] Error:", error.response?.data || error.message);
        throw error;
    }
};
