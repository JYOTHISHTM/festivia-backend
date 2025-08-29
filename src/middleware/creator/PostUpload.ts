import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req: Express.Request, file: Express.Multer.File) => {
    return {
      folder: "festivia/event_gallery",
      allowed_formats: ["jpg", "jpeg", "png"],
    };
  },
});


export const PostUpload = multer({ storage });
