import express from "express";
import { createNewChat, getAllChats, clearUnreadMessageCountAndMessageReadTrue } from "../controllers/chatController.js";
import { auth } from "../middlewares/authMiddlewares.js";


const router = new express.Router()


router.post("/create-new-chat", auth, createNewChat)
router.get("/get-all-chats", auth, getAllChats)
router.post("/clear-unread-msgcount-and-readtrue", auth, clearUnreadMessageCountAndMessageReadTrue)



export default router