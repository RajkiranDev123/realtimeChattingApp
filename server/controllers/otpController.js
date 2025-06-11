import UserModel from "../models/user.js"

import nodemailer from "nodemailer"
import bcrypt from "bcryptjs"

/////////////////////////////////// getOtp/////////////////////////////////////////////
export const getOtp = async (req, res) => {
    const { to } = req.body
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: process.env.otp_sender,
            pass: process.env.otp_pass,
        }
    });
    let otp = Math.floor(1000 + Math.random() * 9000)
    const mailOptions = {
        from: process.env.otp_sender,
        to: to,
        subject: 'Otp for changing password (Chat App)',
        text: otp.toString()
    };
    try {
        const user = await UserModel.findOne({ email: to })

        if (!user) {
            return res.status(400).json({ message: "Email is not registered!", success: false })
        }
        await transporter.sendMail(mailOptions, async function (error, info) {
            if (error) {
                console.log(error)
                return res.status(400).json({ message: error.message, success: false })
            } else {
                console.log('Email sent: ' + info.response);
                const updatedOtp = await UserModel.findByIdAndUpdate(
                    user?._id,
                    { otp: otp },
                    { new: true }
                )
                return res.status(200).json({ message: "Otp sent!", otp: otp, success: true, updatedOtp })
            }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}


///////////////////////////////////verify otp///////////////////////////////////
export const verifyOtp = async (req, res) => {
    const { otp, to } = req.body
    try {
        const user = await UserModel.findOne({ email: to })
        if (!user) {
            return res.status(400).json({ message: "Email is not registered!", success: false })
        }
        if (otp !== user?.otp) {
            return res.status(400).json({ message: "Wrong Otp!", success: false })
        }
        return res.status(200).json({ message: "Otp verified!", success: true })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}

//////////////////////////////////change password /////////////////////////////

export const changePassword = async (req, res) => {
    const { to, password } = req.body
    try {
        const user = await UserModel.findOne({ email: to })
        if (!user) {
            return res.status(400).json({ message: "Email is not registered!", success: false })
        }
        const hashedpassword = await bcrypt.hash(password, 10)
        const changedPassword = await UserModel.findByIdAndUpdate(
            user?._id,
            { password: hashedpassword },
            { otp: "" },

            { new: true }
        )
        const emptyOtp = await UserModel.findByIdAndUpdate(
            user?._id,
            { otp: "" },

            { new: true }
        )
        return res.status(200).json({ message: "Password Changed!", success: true, emptyOtp })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })

    }
}