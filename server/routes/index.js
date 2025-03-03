import { Router } from "express";
import authRouter from "./authRoutes.js"
import userRouter from "./userRoutes.js"
import chatRouter from "./chatRoutes.js"
import messageRouter from "./messageRoutes.js"





const router=Router()


router.use("/auth",authRouter)
router.use("/user",userRouter)
router.use("/chat",chatRouter)
router.use("/message",messageRouter)







export default router