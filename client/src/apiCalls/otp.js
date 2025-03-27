import axiosInstance from "./index"

export const getOtp = async (to) => {
    try {
        const response = await axiosInstance.post(`/api/v1/otp/get-otp`,{to})
        return response.data
    } catch (error) {
        return error
    }
}
