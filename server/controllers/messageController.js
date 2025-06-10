
import ChatModel from "../models/chat.js"
import MessageModel from "../models/message.js"

/////////////////////////////////////////// send message ////////////////////////////
export const newMessage = async (req, res) => {
    try {
        //chatId,sender,text,read:false
        const newMessage = new MessageModel(req.body)
        const savedMessage = await newMessage.save()

        //members,lastMessage,unreadMessageCount
        //update chat too! : lastMessage and unreadMessageCount
        const currentChat = await ChatModel.findOneAndUpdate(
            { _id: req.body.chatId },
            {
                lastMessage: savedMessage._id,
                $inc: { unreadMessageCount: 1 }
            }
        )
        return res.status(201).json({
            message: "Message sent successfully!",
            success: true,
            data: savedMessage
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

/////////////////////////////////////////// get all messages ////////////////////////////
export const getAllMessages = async (req, res) => {
    try {
        //chatId,sender,text,read
        const allMessages = await MessageModel.find({ chatId: req.params.chatId }).sort({ createdAt: 1 })

        return res.status(200).json({
            message: "All Messages fetched successfully!",
            success: true,
            data: allMessages
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

//////////////////////////////////////deleteMsg//////////////

export const deleteSelectedMessage = async (req, res) => {
    try {
        console.log("909",req.params.msgId)
        //chatId,sender,text,read
       await MessageModel.findByIdAndDelete(req.params.msgId);


        return res.status(200).json({
            message: "Messages deleted!",
            success: true,
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}