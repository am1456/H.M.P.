import axios from "axios";

const apiClient = axios.create({
    baseURL: "/", 
    withCredentials: true
});

// Response Interceptor
apiClient.interceptors.response.use(
    (response) => response, // Return response if successful
    async (error) => {
        const originalRequest = error.config;

        // Check if error is 401 and not already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Use a standard axios call (not apiClient) to avoid loops
                // The backend now handles finding the user in User or Staff collection
                await axios.post("/api/v1/user/refresh-token", {}, { withCredentials: true });
                
                // Retry original request
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Determine where to redirect based on the current path
                const currentPath = window.location.pathname;
                
                if (currentPath.includes("/staff")) {
                    window.location.href = "/login/staff";
                }else if (currentPath.includes("/warden")) {
                    window.location.href = "/login/warden";
                }else if (currentPath.includes("/student")) {
                    window.location.href = "/login/student";
                } else {
                    window.location.href = "/login/admin";
                }
                
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;