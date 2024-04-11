import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

dotenv.config({ path: "./config/.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const cloudinaryRespone = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder : "hospital",
      use_filename : true
    });

    fs.unlinkSync(localFilePath);
    return cloudinaryRespone;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};
