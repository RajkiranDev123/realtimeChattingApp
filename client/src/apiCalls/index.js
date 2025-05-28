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




// axiosInstance.interceptors.response.use(
//   response => response, 
//   async error => {
//     const originalRequest = error.config;
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true; 
//       try {
//         const refreshToken = localStorage.getItem('refreshToken');
    
//         const response = await axios.post('https://your.auth.server/refresh', {
//           refreshToken,
//         });
//         const { accessToken, refreshToken: newRefreshToken } = response.data;

//         localStorage.setItem('accessToken', accessToken);
//         localStorage.setItem('refreshToken', newRefreshToken);
 
//         axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
//         return axiosInstance(originalRequest); 
//       } catch (refreshError) {
     
//         console.error('Token refresh failed:', refreshError);
//         localStorage.removeItem('accessToken');
//         localStorage.removeItem('refreshToken');
//         window.location.href = '/login';
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error); 
//   }
// );

export default axiosInstance

