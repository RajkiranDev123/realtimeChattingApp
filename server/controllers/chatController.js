

import ChatModel from "../models/chat.js"

//////////////////////////////////////////////// create new chat ///////////////////////////////////////////////
export const createNewChat = async (req, res) => {
    try {
        const chat = new ChatModel(req.body)
        const savedChat = await chat.save()
        return res.status(201).json({ message: "Chat Created Successfully!", success: true, data: savedChat })

    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}

//////////////////////////////////////////////// get all chats ///////////////////////////////////////////////
export const getAllChats = async (req, res) => {
    try {
        // console.log(req.body.userId)
        const allChats = await ChatModel.find({ members: { $in: req.body.userId } }).populate("members")
        
        // replacing a path/references like ObjectID in document with actual documents from other collections white returning result

        return res.status(200).json({ message: "All Chats fetched Successfully!", success: true, data: allChats })

    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}