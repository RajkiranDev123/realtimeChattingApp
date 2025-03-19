import axiosInstance from "./index"

export const getAllChats = async () => {
    try {
        const response = await axiosInstance.get(`/api/v1/chat/get-all-chats`)
        return response.data
    } catch (error) {
        return error
    }
}

export const createNewChat = async (members) => {
    try {
        const response = await axiosInstance.post(`/api/v1/chat/create-new-chat`, { members })
        return response.data
    } catch (error) {
        return error
    }
}



export const clearUnreadMessageCountAndMessageReadTrue = async (chatId) => {
    try {
        const response = await axiosInstance.post(`/api/v1/chat/clear-unread-msgcount-and-readtrue`, { chatId: chatId })
        return response.data
    } catch (error) {
        return error
    }
}