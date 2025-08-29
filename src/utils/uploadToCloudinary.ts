// utils/cloudinaryUpload.ts
import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";

export const uploadToCloudinary = (fileBuffer: Buffer, folder = "festivia/events") => {
  return new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
      if (result) resolve(result);
      else reject(err);
    });
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};
