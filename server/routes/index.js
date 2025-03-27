
// routes --> index.js
import { Router } from "express";
import authRouter from "./authRoutes.js"
import userRouter from "./userRoutes.js"
import chatRouter from "./chatRoutes.js"
import messageRouter from "./messageRoutes.js"
import otpRouter from "./otpRoutes.js"


const router = Router()
// const router=new express.Router()

// backend_url/api/v1/ : auth,user,chat,message

router.use("/auth", authRouter)
router.use("/user", userRouter)
router.use("/chat", chatRouter)
router.use("/message", messageRouter)
router.use("/otp", otpRouter)


export default router