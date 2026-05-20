import sharp from "sharp";
import axios from "axios";

/**
 * Compresses an image from a buffer or URL to optimize for AI vision tokens
 * @param {Buffer|String} data - Buffer or Image URL
 * @param {Boolean} isUrl - Whether data is a URL
 * @returns {Buffer} - Compressed JPEG buffer
 */
export const compressImage = async (data, isUrl = false) => {
    try {
        let buffer;
        if (isUrl) {
            const res = await axios.get(data, { responseType: "arraybuffer" });
            buffer = Buffer.from(res.data);
        } else {
            buffer = data;
        }
        
        return await sharp(buffer)
            .resize(1024, 1024, { fit: "inside", withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toBuffer();
    } catch (err) {
        console.error("❌ [ImageProcess] Compression error:", err.message);
        // If it's a buffer, return as is. If URL, we can't really return much.
        if (!isUrl) return data;
        throw new Error(`Failed to process image from ${isUrl ? 'URL' : 'Buffer'}`);
    }
};
