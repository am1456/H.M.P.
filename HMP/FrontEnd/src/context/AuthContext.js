import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login as loginAction, logout as logoutAction } from "../store/authSlice";
import apiClient from "../api/axios";

export function useAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const login = async (credentials, role) => {
    try {
    
      let payload = {};

      if (role === "student") {
        payload = {
          username: credentials.enrollmentNumber,
          password: credentials.password,
        };
      } else if (role === "admin") {
        payload = {
          username: credentials.employeeId,
          password: credentials.password,
        };
      } else if (role === "warden") {
        payload = {
          username: credentials.employeeId,
          password: credentials.password,
        };
      } else if (role === "staff") {
        payload = {
          phone: credentials.phoneNumber,
          pin: credentials.pin,
        };
      }

      const response = await apiClient.post("/api/v1/user/login", payload);

      const userData = response.data?.data?.user || response.data?.data;

      if (!userData.role) {
        userData.role = role;
      }

      dispatch(loginAction(userData));

      return {
        success: true,
        user: userData,
        message: response.data?.message || "Login successful",
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";

      throw {
        success: false,
        message: errorMessage,
        error: error.response?.data || error,
      };
    }
  };


  const logout = () => {
    dispatch(logoutAction());
    navigate("/");
  };

  return {
    login,
    logout,
  };
}
