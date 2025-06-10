

import ChatModel from "../models/chat.js"
import MessageModel from "../models/message.js"

//////////////////////////////////////////////// create new chat ///////////////////////////////////////////////
export const createNewChat = async (req, res) => {
    try {
        const chat = new ChatModel(req.body)
        const savedChat = await chat.save()
        await savedChat.populate("members") //{ members:[ {...} , {...} ] }
        return res.status(201).json({ message: "Chat Created Successfully!", success: true, data: savedChat })

    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}

//////////////////////////////////////////////// get all chats that contains _id of logged user in members : [] ///////////////////////////////////////////////
export const getAllChats = async (req, res) => {
    try {
        // console.log(req.body.userId)
        const allChats = await ChatModel.find({ members: { $in: req.body.userId } }).populate("members").populate("lastMessage")
            .sort({ updatedAt: -1 })
        // replacing  ObjectId in document with actual documents from other collections 
        return res.status(200).json({ message: "All Chats fetched Successfully!", success: true, data: allChats })

    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}

//////////////////////////////////////////////// clearUnreadMessageCountAndReadTrue(message) ///////////////////////////////////////////////
export const clearUnreadMessageCountAndMessageReadTrue = async (req, res) => {
    try {
        const chatId = req.body.chatId
        const chat = await ChatModel.findById(chatId)
        if (!chat) {
            return res.status(400).json({ message: "No Chat found with given chatId!", success: false })
        }
        const updatedChat = await ChatModel.findByIdAndUpdate(
            chatId,
            { unreadMessageCount: 0 },
            { new: true }
        ).populate("members").populate("lastMessage")
        
        //multiple messages have one chatId : chatId sender text read image
        await MessageModel.updateMany(
            { chatId: chatId, read: false },
            { read: true }
        )
        return res.status(200).json({ message: "Unread Msg Count to 0 and read to true done!", success: true, data: updatedChat })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}