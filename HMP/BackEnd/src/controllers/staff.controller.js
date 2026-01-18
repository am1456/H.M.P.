import { Staff } from "../models/staff.model.js";
import { AsyncHandler } from "../utilities/AsyncHandler";
import { ApiError } from "../utilities/ApiError";
import { ApiResponse } from "../utilities/ApiResponse";
import { Complaint } from "../models/complaint.model.js";
import jwt from "jsonwebtoken"

const generateAccessTokenAndRefreshToken = async (userID) => {
    try {
        const user = await Staff.findById(userID)

        if (!user) {
            throw new ApiError(404, "User not found while generating tokens")
        }

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(
            500,
            "Failed to generate access and refresh tokens",
            [],
            error.stack
        )
    }
}


const loginStaff = AsyncHandler(async (req, res) => {
    const { phone, pin } = req.body;

    if (!phone || !pin) {
        throw new ApiError(400, "Phone number and PIN are required");
    }

    const staff = await Staff.findOne({ phone });

    if (!staff) {
        throw new ApiError(404, "Staff member not found with this phone number");
    }

    const isPinValid = await staff.ispinCorrect(pin);

    if (!isPinValid) {
        throw new ApiError(401, "Invalid Staff PIN");
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(staff._id);

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    };

    // 7. Remove sensitive info before sending response
    const loggedInStaff = await Staff.findById(staff._id).select("-pin -refreshToken");

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, 
                { staff: loggedInStaff, accessToken, refreshToken }, 
                "Staff logged in successfully"
            )
        );
});


const logoutStaff = AsyncHandler(async (req, res) => {
    await Staff.findByIdAndUpdate(
        req.user._id, {
        $set: {
            refreshToken: null
        }
    },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    }
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                null,
                `${req.user.role} logged out successfully`
            )
        )
})

const getStaffComplainList = AsyncHandler(async (req, res) => {
    const staffRoles = req.user.role; // e.g., ['electrician', 'plumber']
    const staffHostel = req.user.hostel;

    // The clean variable assignment syntax
    const tasks = await Complaint.aggregate([
        // 1. Match Roles and Hostel (Skill-based allocation)
        {
            $match: {
                hostel: new mongoose.Types.ObjectId(staffHostel),
                assignedRole: { $in: staffRoles },
                statusbyStaff: 'UNSETTLED',
                statusbyStudent: 'PENDING'
            }
        },

        // 2. Joins (Room and Student)
        {
            $lookup: {
                from: "rooms",
                localField: "room",
                foreignField: "_id",
                as: "roomDoc"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "student",
                foreignField: "_id",
                as: "studentDoc"
            }
        },

        // 3. Flattening Data (Extracting values from lookup arrays)
        {
            $addFields: {
                roomNumber: { $arrayElemAt: ["$roomDoc.number", 0] },
                studentName: { $arrayElemAt: ["$studentDoc.fullName", 0] }
            }
        },

        // 4. Final Cleanup & Sorting
        {
            $project: {
                roomDoc: 0,
                studentDoc: 0,
                __v: 0
            }
        },
        { 
            $sort: { createdAt: 1 } // Oldest first so staff treats urgent cases first
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, tasks, "Assigned tasks fetched successfully")
    );
});

const settleComplaint = AsyncHandler(async (req, res) => {
    const { complaintId } = req.params;

    const complaint = await Complaint.findOneAndUpdate(
        { 
            _id: complaintId,
            hostel: req.user.hostel, // Security check
            assignedRole: { $in: req.user.role } // Must be qualified for this job
        },
        { 
            $set: { statusbyStaff: 'SETTLED' } 
        },
        { new: true }
    );

    if (!complaint) {
        throw new ApiError(404, "Complaint not found or you are not authorized to settle it");
    }

    return res.status(200).json(
        new ApiResponse(200, complaint, "Job marked as settled")
    );
});

export {
    loginStaff,
    logoutStaff,
    getStaffComplainList,
    settleComplaint
}