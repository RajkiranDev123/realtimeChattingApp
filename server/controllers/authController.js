
import UserModel from "../models/user.js" //7

import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
//////////////////////////////////////////////// signup ///////////////////////////////////////////////
export const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "All fields are required!", success: false })
        }
        const user = await UserModel.findOne({ email: req.body.email })

        if (user) {
            return res.status(400).json({ message: "User already exists!", success: false })
        }
        const hashedpassword = await bcrypt.hash(req.body.password, 10)
        req.body.password = hashedpassword
        const newUser = new UserModel(req.body) //create an object 
        await newUser.save()
        return res.status(201).json({ message: "User Created Successfully!", success: true })

    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}

//////////////////////////////////////////////// signup ///////////////////////////////////////////////
export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required!", success: false })
        }
        const user = await UserModel.findOne({ email: req.body.email })

        if (!user) {
            return res.status(400).json({ message: "User does not exists!", success: false })
        }
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password!", success: false })
        }
        // const payload = { userId: user._id }
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1m" })
        const rToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "9d" })

        return res.status(200).json({ message: "User logged-in Successfully!", success: true, token: token, rToken: rToken })

    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}

export const refreshAccessToken = async (req, res) => {
    const incomingRefreshToken = req.body.refreshToken

    if (!incomingRefreshToken) {
        return res.status(400).json({ message: "No rt!", success: false })

    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        console.log("decodedToken from refresh route==>",decodedToken)


        const user = await UserModel.findById(decodedToken?.userId)

        if (!user) {
            return res.status(400).json({ message: "Invalid rt!", success: false })
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1m" })
        const rToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "9d" })

        return res.status(200).json({ message: "New access and refresh token sent!", success: true, token: token, rToken: rToken })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })

    }

}