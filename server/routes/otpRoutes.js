import express from "express";
import { getOtp } from "../controllers/otpController.js";



const router = new express.Router()

router.post("/get-otp", getOtp)


export default router