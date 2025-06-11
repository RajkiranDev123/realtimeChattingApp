import {v2 as cloudinary} from "cloudinary"


export const cloudUpload = () => {
    // console.log("5",process.env.cloudinary_name)
    return cloudinary.config({
        cloud_name: process.env.cloudinary_name,
        api_key: process.env.cloudinary_api_key,
        api_secret: process.env.cloudinary_api_secret
    })
}
