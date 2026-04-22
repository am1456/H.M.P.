import axios from "axios";

// 1. Define the Backend URL dynamically
// In Localhost: It will use "" (and fallback to proxy if you keep it)
// In Production: It will use the URL we set in Render Dashboard
const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8000"; 

const apiClient = axios.create({
    baseURL: SERVER_URL, 
    withCredentials: true
});

// Response Interceptor
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // 👇 2. CRITICAL FIX: The refresh call must also use the full URL
                await axios.post(
                    `${SERVER_URL}/api/v1/user/refresh-token`, 
                    {}, 
                    { withCredentials: true }
                );
                
                return apiClient(originalRequest);
            } catch (refreshError) {
                // ... (Your redirect logic stays the same) ...
                const currentPath = window.location.pathname;
                if (currentPath.includes("/staff")) window.location.href = "/login/staff";
                else if (currentPath.includes("/warden")) window.location.href = "/login/warden";
                else if (currentPath.includes("/student")) window.location.href = "/login/student";
                else window.location.href = "/login/admin";
                
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;