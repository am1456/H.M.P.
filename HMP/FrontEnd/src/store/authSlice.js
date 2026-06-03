import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("userData");

const initialState = {
    status: storedUser ? true : false,
    userData: storedUser ? JSON.parse(storedUser) : null,
    isProfileComplete: true 
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload;
            localStorage.setItem("userData", JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
            state.isProfileComplete = true; // Reset on logout
            localStorage.removeItem("userData");
        },
        // IMPORTANT: Add this so you can update the status from your components
        setProfileStatus: (state, action) => {
            state.isProfileComplete = action.payload;
        }
    }
});

export const { login, logout, setProfileStatus } = authSlice.actions;
export default authSlice.reducer;