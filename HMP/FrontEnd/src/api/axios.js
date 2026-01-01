import axios from "axios";

const apiClient = axios.create({
    baseURL: "/", // or your backend URL
    withCredentials: true
});

// Response Interceptor
apiClient.interceptors.response.use(
    (response) => response, // Return response if successful
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Call your refresh token endpoint
                await axios.post("/api/v1/user/refresh-token", {}, { withCredentials: true });
                
                // If refresh works, retry the original request that failed
                return apiClient(originalRequest);
            } catch (refreshError) {
                // If refresh token also expired, logout the user
                window.location.href = "/login/admin"; 
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;