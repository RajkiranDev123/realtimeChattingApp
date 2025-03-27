import axiosInstance from "./index"

export const getOtp = async (to) => {
    try {
        const response = await axiosInstance.post(`/api/v1/otp/get-otp`,{to})
        return response.data
    } catch (error) {
        return error
    }
}

export const verifyOtp = async (to,otp) => {
    try {
        const response = await axiosInstance.post(`/api/v1/otp/verify-otp`,{to,otp})
        return response.data
    } catch (error) {
        return error
    }
}

export const changePass = async (to,password) => {
    try {
        const response = await axiosInstance.post(`/api/v1/otp/change-password`,{to,password})
        return response.data
    } catch (error) {
        return error
    }
}