import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({

    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chat"
    },

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    text: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })

const MessageModel = mongoose.model("message", messageSchema)
export default MessageModel