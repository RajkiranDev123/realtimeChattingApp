import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    members: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }]
    },
    // only members is needed to start chat
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "message",
    },
    unreadMessageCount: {
        type: Number,
        default: 0
    },

}, { timestamps: true })

const ChatModel = mongoose.model("chat", chatSchema)
export default ChatModel

