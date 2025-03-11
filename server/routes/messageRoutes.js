import express from "express";
import { auth } from "../middlewares/authMiddlewares.js";
import { newMessage ,getAllMessages} from "../controllers/messageController.js";


const router=new express.Router()


router.post("/new-message",auth,newMessage)
router.get("/get-all-messages/:chatId",auth,getAllMessages)

export default router