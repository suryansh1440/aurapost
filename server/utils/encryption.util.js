import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

// Ensure ENCRYPTION_KEY is a 32-byte (256-bit) hex string in your .env
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; 
const IV_LENGTH = 16; // For AES, this is always 16

export const encrypt = (text) => {
    if (!text) return text;
    if (!ENCRYPTION_KEY) throw new Error("ENCRYPTION_KEY is missing in environment variables.");
    const key = Buffer.from(ENCRYPTION_KEY, 'hex');
    if (key.length !== 32) {
        throw new Error("ENCRYPTION_KEY must be exactly 32 bytes (64 hex characters) long.");
    }

    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

export const decrypt = (text) => {
    if (!text) return text;
    try {
        if (!ENCRYPTION_KEY) throw new Error("ENCRYPTION_KEY is missing in environment variables.");
        const key = Buffer.from(ENCRYPTION_KEY, 'hex');
        if (key.length !== 32) throw new Error("ENCRYPTION_KEY must be exactly 32 bytes.");

        let textParts = text.split(':');
        let iv = Buffer.from(textParts.shift(), 'hex');
        let encryptedText = Buffer.from(textParts.join(':'), 'hex');
        let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
        let decrypted = decipher.update(encryptedText);
        
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        
        return decrypted.toString();
    } catch (err) {
        console.error("Decryption failed:", err);
        return null;
    }
};
