import jwt from "jsonwebtoken"

export const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1] //"Bearer ujghfh"
        // console.log("token from auth middleware ==> ",token)
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
        console.log("decodedToken from auth middleware==>",decodedToken)
        req.body.userId = decodedToken.userId
        next()

    } catch (error) {
        return res.status(401).json({ message: error.message, success: false })
    }
}