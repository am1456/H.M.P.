import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSliice"



export const store = configureStore({
    reducer: {
        auth: authSlice
    }
})