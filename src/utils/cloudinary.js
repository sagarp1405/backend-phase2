import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
// Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: proccess.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    
import { v2 as cloudinary } from 'cloudinary';

(async function() {

    // Configuration
    cloudinary.config({ 
        cloud_name: 'wnq7xiju', 
        api_key: '221146813236988', 
        api_secret: '<your_api_secret>' // Click 'View API Keys' above to copy your API secret
    });
    const uploadOnCloudinary =async (localFilePath)=>{
        try {
            if(!localFilePath)
            {
                return null
            }
            //upload file on cloudinary
            const response=await cloudinary.uploader.upload(localFilePath,
                {
                resource_type:"auto"
                }) 
                //the file has been uploaded
                console.log("File is uploaded on cloudinary",response.url);
                return response;   
        } catch (error) {
            fs.unlinkSync(localFilePath)//remove the locally saved temporary file as thr upload operation got failed 
            return null;
        }
    }
});
export {uploadOnCloudinary}