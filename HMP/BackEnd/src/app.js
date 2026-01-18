import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN, 
    credentials: true
}))

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

app.use(cookieParser());

import userRouter from "./routes/user.routes.js";
import adminRouter from "./routes/admin.routes.js"
import wardenRouter from "./routes/warden.routes.js";
// import studentRouter from "./routes/student.routes.js";
import hostelRouter from "./routes/hostel.routes.js";
import roomRouter from "./routes/room.routers.js";
// import staffRouter from "./routes/staff.routes.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/warden", wardenRouter);
// app.use("/api/v1/student", studentRouter);
app.use("/api/v1/hostel", hostelRouter);
app.use("/api/v1/room", roomRouter);
// app.use("/api/v1/staff",staffRouter)

// Error handling middleware
app.use((err, req, res, next) => {
    // Check if the error is an instance of our custom ApiError
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Send the JSON response to the frontend
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors: err.errors || []
    });
});

export { app };