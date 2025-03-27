import express from "express";
import { getOtp ,verifyOtp,changePassword} from "../controllers/otpController.js";



const router = new express.Router()

router.post("/get-otp", getOtp)
router.post("/verify-otp", verifyOtp)
router.post("/change-password", changePassword)




export default router