import UserModel from "../models/user.js"

//////////////////////////////////////////////// getLoggedUser ///////////////////////////////////////////////
export const getLoggedUser = async (req, res) => {
    try {

        const user = await UserModel.findOne({ _id: req.body.userId }).select('-password')

        return res.status(200).json({ message: "User fetched Successfully!", success: true, data: user })

    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}

//////////////////////////////////////////////// getAllUsers except logged user ///////////////////////////////////////////////
export const getAllUsers = async (req, res) => {
    try {
        // query operator : $ne is logical operator
        const allUsers = await UserModel.find({ _id: {$ne:req.body.userId} }).select('-password')

        return res.status(200).json({ message: "All Users fetched Successfully!", success: true, data: allUsers })

    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}
 