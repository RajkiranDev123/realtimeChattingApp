import axios from "axios"

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL
})

axiosInstance.interceptors.request.use(function (config) {
    // Do something before request is sent
    let token = localStorage.getItem("token");
    config.headers["Authorization"] = "Bearer " + token;
    return config;
});

export default axiosInstance


//types of axios interceptors

//Request interceptors: Modify requests before they are sent
//Response interceptors: Handle responses or errors globally