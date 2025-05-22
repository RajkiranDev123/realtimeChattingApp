
import axiosInstance from "./index"

export const getLoggedUser = async () => {
    try {
        const response = await axiosInstance.get(`/api/v1/user/get-logged-user`)
        return response.data
    } catch (error) {
        return error
    }
}

export const getAllUsers = async () => {
    try {
        const response = await axiosInstance.get(`/api/v1/user/get-all-users`)
        return response.data
    } catch (error) {
        return error
    }
}

export const uploadProfilePic = async (image) => {
    try {
        const response = await axiosInstance.post(`/api/v1/user/upload-profile-pic`,{image})
        return response.data
    } catch (error) {
        return error
    }
}