import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import path from "path";
// import dotenv from "dotenv";

// dotenv.config({
//     path: "./.env"
// });

// Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });

    //console.log(cloudinary.config());

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        const ext = path.extname(localFilePath).toLowerCase();

        const resourceType =
            ext === ".pdf"
                ? "raw"
                : "image";
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: resourceType,
            type: "upload"
        })
        //console.log("Cloudinary response:", response);
        // file has been uploaded successfully
        
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        console.log("Cloudinary upload error:", error);
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}



export {uploadOnCloudinary}