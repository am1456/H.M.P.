import axios from "axios";

// This is the domain of our backend server. In development, it falls back to localhost.
const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8000"; 

// Think of axios.create() as building a customized, pre-configured clone of Axios.
// We name it apiClient. By defining baseURL here, we don't have to type out the
// backend domain every time we make a request (e.g. we just write '/api/v1/user' instead of the full URL).
//
// withCredentials is set to true because our backend uses secure cookies (HTTP-only cookies) 
// to track sessions and tokens. If we forget this, the browser will block cookies from being
// sent back and forth, breaking our login session.
const apiClient = axios.create({
    baseURL: SERVER_URL, 
    withCredentials: true
});

// Interceptors are like security checkpoints. A response interceptor catches the server's response
// BEFORE it reaches our React component's try/catch block. This allows us to handle errors globally.
apiClient.interceptors.response.use(
    // If the request succeeds, just pass the response through to the component.
    (response) => response,
    
    // If the request fails, we inspect the error first.
    async (error) => {
        const originalRequest = error.config;

        // A 401 status code means "Unauthorized". Usually, this means our short-lived Access Token expired.
        // We also check !originalRequest._retry to make sure we don't get stuck in an infinite retry loop 
        // if the refresh fails.
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark this request so we know we've attempted a retry.

            try {
                // Since our Access Token is expired, we send a request to refresh-token.
                // The browser automatically sends our long-lived Refresh Token cookie.
                // We use raw axios here instead of apiClient to avoid triggering this interceptor again.
                await axios.post(
                    `${SERVER_URL}/api/v1/user/refresh-token`, 
                    {}, 
                    { withCredentials: true }
                );
                
                // If the refresh succeeds, we retry the original failed request.
                // To the warden or student, it looks like the page loaded normally.
                return apiClient(originalRequest);
            } catch (refreshError) {
                // If the refresh token request fails, it means the user's session has completely expired.
                // We check the browser URL path to see if they are a student, staff, warden, or admin,
                // and redirect them to their specific login page.
                const currentPath = window.location.pathname;
                if (currentPath.includes("/staff")) window.location.href = "/login/staff";
                else if (currentPath.includes("/warden")) window.location.href = "/login/warden";
                else if (currentPath.includes("/student")) window.location.href = "/login/student";
                else window.location.href = "/login/admin";
                
                return Promise.reject(refreshError);
            }
        }
        
        // If the error was not a 401 (e.g. 500 server error, 400 bad request), we just reject it 
        // so the React component can handle it in its own catch block.
        return Promise.reject(error);
    }
);

export default apiClient;