import express from "express";
import {signup,login,refreshAccessToken} from "../controllers/authController.js"

const router=new express.Router()

// url/api/v1/auth/signup

router.post("/signup",signup)
router.post("/login",login)
router.post("/refreshAccessToken",refreshAccessToken)


export default router