import { createSlice } from "@reduxjs/toolkit";

// Helper to get initial state from storage
const storedUser = localStorage.getItem("userData");

const initialState = {
    status: storedUser ? true : false,
    userData: storedUser ? JSON.parse(storedUser) : null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload;
            // Save to browser so it doesn't disappear on refresh
            localStorage.setItem("userData", JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
            localStorage.removeItem("userData");
        }
    }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;