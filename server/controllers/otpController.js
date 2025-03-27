//bqed blwt yowl tjkp
import nodemailer from "nodemailer"
export const getOtp = async (req, res) => {

    const { to } = req.body
    console.log(to)

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'rajtech645@gmail.com',
            pass: 'bqedblwtyowltjkp',
        }
    });

    const mailOptions = {
        from: 'rajtech645@gmail.com',
        to: to,
        subject: 'Otp for changing password (Chat App)',
        text: 'That was easy!'
    };

    try {

       await transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
                return res.status(400).json({ message: error.message, success: false })

            } else {
                console.log('Email sent: ' + info.response);
                return res.status(200).json({ message: "Otp sent!", success: true })

            }
        });

    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })

    }
}