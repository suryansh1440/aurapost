import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (fileBuffer, folder = "general") => {
  try {
    if (!fileBuffer) return null;

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "aurapost/" + folder,
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(fileBuffer);
    });
  } catch (error) {
    console.error("Cloudinary service error:", error);
    return null;
  }
};

export const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl) return null;

    const splitUrl = imageUrl.split('/');
    const uploadIndex = splitUrl.indexOf('upload');
    
    if (uploadIndex === -1) {
      console.log("Invalid Cloudinary URL for deletion");
      return null;
    }
    
    let publicIdPart = splitUrl.slice(uploadIndex + 1);
    
    if (publicIdPart.length > 0 && publicIdPart[0].startsWith('v') && !isNaN(publicIdPart[0].substring(1))) {
      publicIdPart.shift();
    }
    
    let publicId = publicIdPart.join('/');
    
    const lastDotIndex = publicId.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      publicId = publicId.substring(0, lastDotIndex);
    }
    
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return null;
  }
};

export default cloudinary;
