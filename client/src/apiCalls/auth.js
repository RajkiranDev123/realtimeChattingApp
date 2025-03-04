import { axiosInstance } from "./index"
const baseUrl = import.meta.env.VITE_BASE_URL
export const signupUser = async (user) => {
    try {
        const response = await axiosInstance.post(`${baseUrl}/api/v1/auth/signup`, user)
        console.log(response)
        return response.data
    } catch (error) {
        return error
    }
}

export const loginUser = async (user) => {
    try {
        const response = await axiosInstance.post(`${baseUrl}/api/v1/auth/login`, user)
        console.log("response from login==>", response)
        return response.data
    } catch (error) {
        console.log(error)
        return error
    }
}