import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

const allowedOrigins = [
    process.env.CORS_ORIGIN,   // Pulls the Render URL from Environment Variables
    "http://localhost:5173"    // Hardcoded for your local development
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

app.use(cookieParser());

import userRouter from "./routes/user.routes.js";
import adminRouter from "./routes/admin.routes.js"
import wardenRouter from "./routes/warden.routes.js";
import studentRouter from "./routes/student.routes.js";
import hostelRouter from "./routes/hostel.routes.js";
import roomRouter from "./routes/room.routers.js";
import complaintRouter from "./routes/complaint.route.js";
// import staffRouter from "./routes/staff.routes.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/warden", wardenRouter);
app.use("/api/v1/student", studentRouter);
app.use("/api/v1/hostel", hostelRouter);
app.use("/api/v1/room", roomRouter);
app.use("/api/v1/complaints",complaintRouter)
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