import { AsyncHandler } from "../utilities/AsyncHandler.js";
import { ApiError } from "../utilities/ApiError.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { Staff } from "../models/staff.model.js";
import { Complaint } from "../models/complaint.model.js";

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
    const wardenHostelId = req.user.hostel;

    // The clean pipeline assignment you wanted
    const complaints = await Complaint.aggregate([
        // 1. Initial Match (Security)
        {
            $match: {
                hostel: new mongoose.Types.ObjectId(wardenHostelId)
            }
        },

        // 2. Conditional Filters (We use $match stages that only run if the variable exists)
        ...(status ? [{ $match: { statusbyStudent: status.toUpperCase() } }] : []),
        ...(role ? [{ $match: { assignedRole: role.toLowerCase() } }] : []),

        // 3. Lookups (Joining tables)
        {
            $lookup: {
                from: "users",
                localField: "student",
                foreignField: "_id",
                as: "studentDoc"
            }
        },
        {
            $lookup: {
                from: "rooms",
                localField: "room",
                foreignField: "_id",
                as: "roomDoc"
            }
        },

        // 4. Formatting (The $addFields trick)
        {
            $addFields: {
                studentName: { $arrayElemAt: ["$studentDoc.fullName", 0] },
                enrollmentNo: { $arrayElemAt: ["$studentDoc.username", 0] },
                roomNumber: { $arrayElemAt: ["$roomDoc.number", 0] }
            }
        },

        // 5. Search Logic
        ...(search ? [{
            $match: {
                $or: [
                    { studentName: { $regex: search, $options: "i" } },
                    { enrollmentNo: { $regex: search, $options: "i" } },
                    { title: { $regex: search, $options: "i" } }
                ]
            }
        }] : []),

        // 6. Cleanup and Sort
        {
            $project: {
                studentDoc: 0,
                roomDoc: 0,
                __v: 0
            }
        },
        { $sort: { createdAt: -1 } }
    ]);

    return res.status(200).json(
        new ApiResponse(200, complaints, "Data fetched successfully")
    );
});

const getStudentListForWarden = AsyncHandler(async (req, res) => {
    const { search, page = 1, limit = 10, hasChronicDisease } = req.query;
    const wardenHostelId = req.user.hostel;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build dynamic match conditions
    const dynamicMatchConditions = [];

    // Add search condition
    if (search) {
        dynamicMatchConditions.push({
            $or: [
                { fullName: { $regex: search, $options: "i" } },
                { username: { $regex: search, $options: "i" } },
                { "roomData.roomNumber": { $regex: search, $options: "i" } }
            ]
        });
    }

    // Add chronic disease filter
    if (hasChronicDisease !== undefined) {
        // Convert query string to boolean
        const hasDiseaseBoolean = hasChronicDisease === 'true' || hasChronicDisease === true;
        dynamicMatchConditions.push({
            "profile.hasChronicDisease": hasDiseaseBoolean
        });
    }

    const students = await User.aggregate([
        // 1. Filter: Only students in this Warden's hostel
        {
            $match: {
                hostel: new mongoose.Types.ObjectId(wardenHostelId),
                role: "student"
            }
        },
        // 2. Join with Room
        {
            $lookup: {
                from: "rooms",
                localField: "room",
                foreignField: "_id",
                as: "roomData"
            }
        },
        // 3. Join with StudentProfile
        {
            $lookup: {
                from: "studentprofiles",
                localField: "_id",
                foreignField: "user",
                as: "profile"
            }
        },
        // 4. Convert arrays to objects
        {
            $addFields: {
                roomData: { $arrayElemAt: ["$roomData", 0] },
                profile: { $arrayElemAt: ["$profile", 0] }
            }
        },
        // 5. Apply dynamic filters (only if conditions exist)
        ...(dynamicMatchConditions.length > 0 ? [{
            $match: {
                $and: dynamicMatchConditions
            }
        }] : []),
        // 6. Count total and paginate
        {
            $facet: {
                metadata: [{ $count: "total" }],
                data: [
                    { $skip: skip },
                    { $limit: limitNum },
                    {
                        $project: {
                            _id: 1,
                            fullName: 1,
                            username: 1,
                            email: 1,
                            phoneNumber: 1,
                            roomNumber: "$roomData.roomNumber",
                            hasChronicDisease: "$profile.hasChronicDisease",
                            createdAt: 1
                        }
                    }
                ]
            }
        }
    ]);

    const total = students[0]?.metadata[0]?.total || 0;
    const studentList = students[0]?.data || [];

    return res.status(200).json(
        new ApiResponse(200, {
            students: studentList,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(total / limitNum),
                totalStudents: total,
                studentsPerPage: limitNum,
                hasNextPage: pageNum < Math.ceil(total / limitNum),
                hasPrevPage: pageNum > 1
            }
        }, "Student list fetched successfully")
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
const changeCurrentPassword = AsyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
        throw new ApiError(400, "All fields are required");
    }

    if (newPassword !== confirmPassword) {
        throw new ApiError(400, "Passwords do not match");
    }

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid old password");
    }

    user.password = newPassword;
    user.refreshToken = undefined;
    await user.save();

    return res.status(200).json(
        new ApiResponse(200, null, "Password changed successfully")
    );
});
export { 
    createStaff,
    getWardenComplainList,
    getStudentListForWarden,
    getStudentDetail,
    changeCurrentPassword
};
