import axios from "axios"

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL
    // baseURL: 
})

axiosInstance.interceptors.request.use(function (config) {

    let token = localStorage.getItem("token");
    config.headers["Authorization"] = "Bearer " + token;
    return config;
});




axiosInstance.interceptors.response.use(
    response => {
        console.log("response from resp inter==>", response)
        return response
    },
    async error => {
        console.log("error from resp inter==>", error)
        const originalRequest = error.config;
        console.log("error from resp inter==>", originalRequest._retry)

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');

                const response = await axios.post('http://localhost:3001/api/v1/auth/refreshAccessToken', {
                    refreshToken,
                });
                const { token, rToken: newRefreshToken } = response.data;

                localStorage.setItem('token', token);
                localStorage.setItem('refreshToken', newRefreshToken);

                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                return axiosInstance(originalRequest);

            } catch (refreshError) {

                console.error('Token refresh failed:', refreshError);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }


        return Promise.reject(error);

    }
);

export default axiosInstance

