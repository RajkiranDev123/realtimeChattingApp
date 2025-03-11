import express from "express";
import { getLoggedUser, getAllUsers } from "../controllers/userController.js";
import { auth } from "../middlewares/authMiddlewares.js";


const router = new express.Router()

router.get("/get-logged-user", auth, getLoggedUser)
router.get("/get-all-users", auth, getAllUsers)

export default router