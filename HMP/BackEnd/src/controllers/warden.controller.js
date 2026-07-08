import { AsyncHandler } from "../utilities/AsyncHandler.js";
import { ApiError } from "../utilities/ApiError.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { Staff } from "../models/staff.model.js";
import { Complaint } from "../models/complaint.model.js";
import { Notice } from "../models/notice.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utilities/cloudinary.js";


const createStaff = AsyncHandler(async (req, res) => {
    const { phone, fullName, roles, pin } = req.body;

    if ([fullName, pin].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    if (!roles || !Array.isArray(roles) || roles.length === 0) {
        throw new ApiError(400, "At least one role must be assigned");
    }

    const existedStaff = await Staff.findOne({
        phone,
        hostel: req.user.hostel
    });

    if (existedStaff) {
        throw new ApiError(409, "Staff with this phone number already exists in your hostel");
    }

    const staff = await Staff.create({
        phone,
        fullName,
        role: roles, // This is now an array: e.g. ['electrician', 'plumber']
        pin,
        hostel: req.user.hostel
    });

    const createdStaff = await Staff.findById(staff._id).select("-pin -refreshToken");

    if (!createdStaff) {
        throw new ApiError(500, "Something went wrong while registering the staff");
    }

    return res.status(201).json(
        new ApiResponse(201, createdStaff, "Staff created successfully")
    );
});

const getWardenComplainList = AsyncHandler(async (req, res) => {
    const { status, role, search } = req.query;

    if (!req.user.hostel) {
        return res.status(200).json(
            new ApiResponse(
                200,
                [],
                "Warden is not assigned to any hostel yet."
            )
        );
    }

    const complaints = await Complaint.aggregate([
        // Match complaints belonging to the warden's hostel
        {
            $match: {
                hostel: req.user.hostel
            }
        },

        // Optional filters
        ...(status && status !== "ALL" ? [{ $match: { statusbyStudent: status } }] : []),

        ...(role && role !== "ALL" ? [{ $match: { assignedRole: role } }] : []),

        // Get student details
        {
            $lookup: {
                from: "users",
                localField: "student",
                foreignField: "_id",
                as: "studentDoc"
            }
        },

        // Get room details
        {
            $lookup: {
                from: "rooms",
                localField: "room",
                foreignField: "_id",
                as: "roomDoc"
            }
        },

        // Flatten lookup results
        {
            $addFields: {
                studentName: {
                    $arrayElemAt: ["$studentDoc.fullName", 0]
                },
                enrollmentNo: {
                    $arrayElemAt: ["$studentDoc.username", 0]
                },
                roomNumber: {
                    $ifNull: [
                        { $arrayElemAt: ["$roomDoc.number", 0] },
                        "N/A"
                    ]
                }
            }
        },

        // Search filter
        ...(search ? 
            [{ $match: { 
                $or: [ 
                    { studentName: { $regex: search, $options: "i" } }, 
                    { enrollmentNo: { $regex: search, $options: "i" } }, 
                    { title: { $regex: search, $options: "i" } } ] } }
                ] : []),

        // Newest complaints first
        {
            $sort: {
                createdAt: -1
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            complaints,
            "Data fetched successfully"
        )
    );
});

const getStudentListForWarden = AsyncHandler(async (req, res) => {
    const { search, hasChronicDisease } = req.query;

    const filterConditions = [];

    if (search) {
        filterConditions.push({
            $or: [
                { fullName: { $regex: search, $options: "i" } },
                { username: { $regex: search, $options: "i" } },
                { "roomData.number": { $regex: search, $options: "i" } }
            ]
        });
    }

    if (hasChronicDisease !== undefined) {
        filterConditions.push({
            "profile.hasChronicDisease": hasChronicDisease === "true"
        });
    }

    const students = await User.aggregate([
        {
            $match: {
                hostel: new mongoose.Types.ObjectId(req.user.hostel),
                role: "student"
            }
        },
        {
            $lookup: {
                from: "rooms",
                localField: "room",
                foreignField: "_id",
                as: "roomData"
            }
        },
        {
            $lookup: {
                from: "studentprofiles",
                localField: "_id",
                foreignField: "user",
                as: "profile"
            }
        },
        {
            $addFields: {
                roomData: { $arrayElemAt: ["$roomData", 0] },
                profile: { $arrayElemAt: ["$profile", 0] }
            }
        },
        ...(filterConditions.length > 0 ? [{ $match: { $and: filterConditions } }] : []),
        {
            $project: {
                _id: 1,
                fullName: 1,
                username: 1,
                email: 1,
                phoneNumber: 1,
                roomNumber: "$roomData.number",
                hasChronicDisease: "$profile.hasChronicDisease",
                createdAt: 1
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, { students }, "Student list fetched successfully")
    );
});

const getStudentDetail = AsyncHandler(async (req, res) => {
    const { studentId } = req.params;

    const studentDetail = await User.aggregate([
        // 1. Match the specific student
        {
            $match: {
                _id: new mongoose.Types.ObjectId(studentId)
            }
        },
        // 2. Join with Profile
        {
            $lookup: {
                from: "studentprofiles",
                localField: "_id",
                foreignField: "user",
                as: "fullProfile"
            }
        },
        {
            $addFields: {
                profile: { $arrayElemAt: ["$fullProfile", 0] }
            }
        },
        // 3. Security: Hide sensitive data
        {
            $project: {
                password: 0,
                refreshToken: 0,
                fullProfile: 0,
                __v: 0
            }
        }
    ]);

    if (!studentDetail.length) {
        throw new ApiError(404, "Student not found");
    }

    return res.status(200).json(
        new ApiResponse(200, studentDetail[0], "Student details fetched")
    );
});

const createNotice = AsyncHandler(async (req, res) => {
    const {title, description} = req.body;

    if (!title?.trim()) {
        throw new ApiError(400, "Title is required");
    }

    const user = await User.findById(req.user._id);

    if(!user){
        throw new ApiError(404, "Warden record not found")
    }

    const localFilePath = req.file?.path;

    if((!localFilePath) && (!description?.trim()))
        throw new ApiError(400, "Either a description or an attachment is required.")

    let attachment = null;

    if(localFilePath)
    {
        attachment = await uploadOnCloudinary(localFilePath);
    }

    if(localFilePath && (!attachment))
        throw new ApiError(500, "A problem occured while uploading attachment");


    const notice = await Notice.create({
        title,
        description,
        attachmentUrl: attachment?.secure_url || "",
        issuedBy: user._id,
        hostel: user.hostel
    });
    
    return res.status(201).json(
            new ApiResponse(201, notice, "Notice issued successfully")
        );
    
})

const deleteNotice = AsyncHandler( async (req, res) => {
    const { noticeId } = req.params;

    const notice = await Notice.findOne({ _id: noticeId });

    if(!notice)
        throw new ApiError(404, "Notice not found");

    if(notice.hostel.toString() !== req.user.hostel.toString())
        throw new ApiError(403, "Unauthorised to delete this notice");

    await Notice.findByIdAndDelete(noticeId);

    return res.status(200).json(
        new ApiResponse(200, {}, "Notice deleted successfully")
    );
})


export {
    createStaff,
    getWardenComplainList,
    getStudentListForWarden,
    getStudentDetail,
    createNotice,
    deleteNotice
};
