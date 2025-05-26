import UserModel from "../models/user.js"
// import { cloudUpload } from "../config/cloudinary.js"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
    cloud_name: process.env.cloudinary_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_api_secret
})
//////////////////////////////////////////////// getLoggedUser ///////////////////////////////////////////////
export const getLoggedUser = async (req, res) => {
    try {
        //req.body.userId = decodedToken.userId
        const user = await UserModel.findOne({ _id: req.body.userId }).select('-password')
        return res.status(200).json({ message: "Logged User fetched Successfully!", success: true, data: user })

    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}

//////////////////////////////////////////////// getAllUsers except logged user ///////////////////////////////////////////////
export const getAllUsers = async (req, res) => {
    try {
        // query operator : $ne is logical operator
        const allUsers = await UserModel.find({ _id: { $ne: req.body.userId } }).select('-password')

        return res.status(200).json({ message: "All Users except logged user fetched Successfully!", success: true, data: allUsers })

    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}

//////////////////////////////////////////////// getAllUsers except logged user ///////////////////////////////////////////////
export const uploadProfilePic = async (req, res) => {
    try {
        const image = req.body.image

        const uploadedImage = await cloudinary.uploader.upload(image, { folder: "rca" })

        const user = await UserModel.findByIdAndUpdate(
            { _id: req.body.userId },
            { profilePic: uploadedImage.secure_url },
            { new: true }

        )

        return res.status(200).json({ message: "Profile pic uploaded Successfully!", success: true, data: user })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message, success: false })
    }
}