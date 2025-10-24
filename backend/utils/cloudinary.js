import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

// Convert buffer to readable stream for Cloudinary streaming upload
const bufferToStream = (buffer) => {
  const readable = new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    },
  });
  return readable;
};

// Upload File to Cloudinary
export const uploadToCloudinary = async (file, folder) => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `LostLink/${folder}`, // simplified project name
          resource_type: "auto",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      bufferToStream(file.buffer).pipe(uploadStream);
    });
  } catch (error) {
    throw new Error(`Upload to Cloudinary failed: ${error.message}`);
  }
};

//  Delete File from Cloudinary *
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId || typeof publicId !== "string" || publicId.trim() === "") {
    console.warn(
      "Cloudinary delete skipped due to missing or invalid public_id"
    );
    return null;
  }
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Delete from Cloudinary failed: ${error.message}`);
  }
};
