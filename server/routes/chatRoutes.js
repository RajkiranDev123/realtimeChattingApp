import express from "express";
import { createNewChat,getAllChats } from "../controllers/chatController.js";
import { auth } from "../middlewares/authMiddlewares.js";


const router=new express.Router()


router.post("/create-new-chat",auth,createNewChat)
router.get("/get-all-chats",auth,getAllChats)


export default router