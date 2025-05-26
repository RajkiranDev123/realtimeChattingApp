import axiosInstance  from "./index"

export const signupUser = async (user) => {
    try {
        const response = await axiosInstance.post(`/api/v1/auth/signup`, user)
        console.log(response)
        return response.data
    } catch (error) {
        return error.response.data
    }
}

export const loginUser = async (user) => {
    try {
        const response = await axiosInstance.post(`/api/v1/auth/login`, user)
        console.log("response from login==>", response)
        return response.data // == { message: "User logged-in Successfully!", success: true, token: token }
    } catch (error) {
   
        return error.response.data
    }
}