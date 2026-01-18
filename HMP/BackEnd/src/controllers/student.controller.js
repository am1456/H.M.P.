import { AsyncHandler } from "../utilities/AsyncHandler.js";
import { ApiError } from "../utilities/ApiError.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { Complaint } from "../models/complaint.model.js";
import { User } from "../models/user.model.js";


const decodeEnrollmentId = (username) => {
    const yearStr = username.substring(0, 4); // "2024"

    const levelCode = username.substring(4, 6); // "UG"

    const branchCode = username.substring(6, 8); // "CS"

    const courseMap = {
        "UG": "B.Tech",
        "PG": "M.Tech",
    };

    const branchMap = {
        "CS": "Computer Science & Enginnering",
        "EC": "Electronics & Communication Enginnering",
        "ME": "Mechanical Enginnering",
        "CE": "Civil Enginnering",
        "EE": "Electrical Enginnering",
        "MM": "Metallurgical & Material Enginnering",
        "PIE": " Production & Industrial Engineering"
    };

    return {
        admissionYear: parseInt(yearStr),
        course: courseMap[levelCode] || levelCode,
        branch: branchMap[branchCode] || branchCode
    };
};


const updateProfileDetail = AsyncHandler(async (req, res) => {
    const {
        gender, dateOfBirth, bloodGroup, fatherName, fatherPhone,
        motherName, motherPhone, addressLine1, city, state, pincode,
        hasChronicDisease, chronicDiseaseDetails, emergencyContactName,
        emergencyContactNumber
    } = req.body;

    if ([gender, dateOfBirth, bloodGroup, fatherName, fatherPhone, motherName,
        addressLine1, city, state, pincode].some(field => !field)) {
        throw new ApiError(400, "Please fill all required personal and family fields");
    }

    if (hasChronicDisease === true && !chronicDiseaseDetails) {
        throw new ApiError(400, "Please provide details regarding your chronic condition");
    }

    const academicData = decodeEnrollmentId(req.user.username);

    const profileUpdate = {
        user: req.user._id,
        ...req.body,
        ...academicData
    };

    // 5. Upsert into Database
    const profile = await StudentProfile.findOneAndUpdate(
        { user: req.user._id },
        { $set: profileUpdate },
        {
            new: true,          // Return the updated document
            upsert: true,       // Create if it doesn't exist
            runValidators: true // Ensure schema validation rules are followed
        }
    );

    if (!profile) {
        throw new ApiError(500, "Failed to save student profile information");
    }

    return res.status(200).json(
        new ApiResponse(200, profile, "Profile saved successfully")
    );
});

const getProfileStatus = AsyncHandler(async (req, res) => {
    const profile = await StudentProfile.findOne({ user: req.user._id }).select("_id");

    return res.status(200).json(
        new ApiResponse(
            200,
            { isComplete: !!profile },
            profile ? "Profile exists" : "Profile not found"
        )
    );
});

const createComplaint = AsyncHandler(async (req, res) => {
    const { title, description, assignedRole } = req.body;

    if ([title, description, assignedRole].some(field => !field?.trim())) {
        throw new ApiError(400, "Title, Description, and Category are required");
    }

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "Student record not found");
    }

    if (!user.hostel || !user.room) {
        throw new ApiError(400, "You must be assigned to a Room to file a complaint.");
    }

    const complaint = await Complaint.create({
        title,
        description,
        assignedRole,
        student: user._id,
        mobile: user.mobile,
        hostel: user.hostel,
        room: user.room,
        statusbyStudent: 'PENDING',
        statusbyStaff: 'UNSETTLED'
    });

    const populatedComplaint = await Complaint.findById(complaint._id)
        .populate("hostel", "name")
        .populate("room", "number")
        .populate("student", "fullName")
        .select("-__v");

    return res.status(201).json(
        new ApiResponse(201, populatedComplaint, "Complaint registered successfully")
    );
});

const resolveComplaint = AsyncHandler(async (req, res) => {
    const { complaintId } = req.params;

    const complaint = await Complaint.findOneAndUpdate(
        {
            _id: complaintId,
            student: req.user._id // Security: Only the owner can resolve it
        },
        {
            $set: {
                statusbyStudent: 'RESOLVED',
                resolvedAt: new Date()
            }
        },
        { new: true }
    );

    if (!complaint) {
        throw new ApiError(404, "Complaint not found or you are not authorized");
    }

    return res.status(200).json(
        new ApiResponse(200, complaint, "Complaint marked as resolved")
    );
});

const deleteComplaint = AsyncHandler(async (req, res) => {
    const { complaintId } = req.params;

    const complaint = await Complaint.findOne({ _id: complaintId });

    if (!complaint) {
        throw new ApiError(404, "Complaint not found");
    }

    if (complaint.student.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized to delete this complaint");
    }

    if (complaint.statusbyStaff === 'SETTLED') {
        throw new ApiError(400, "Cannot delete a complaint that staff has already addressed");
    }

    await Complaint.findByIdAndDelete(complaintId);

    return res.status(200).json(
        new ApiResponse(200, {}, "Complaint removed successfully")
    );
});

const getStudentComplaints = AsyncHandler(async (req, res) => {
    // 1. Get query parameters for filtering (optional but professional)
    const { status, role } = req.query;

    // 2. Build the query object
    const query = { student: req.user._id };

    // If student wants to see only 'PENDING' or 'RESOLVED'
    if (status) {
        query.statusbyStudent = status.toUpperCase();
    }

    // If student wants to see only 'electrician' or 'plumber' issues
    if (role) {
        query.assignedRole = role.toLowerCase();
    }

    // 3. Execute query with population and sorting
    const complaints = await Complaint.find(query)
        .populate("hostel", "name")
        .populate("room", "number")
        .sort({ createdAt: -1 }); // -1 means "Descending" (Newest first)

    // 4. Return response
    return res.status(200).json(
        new ApiResponse(
            200, 
            { 
                count: complaints.length, 
                complaints 
            }, 
            "Complaints retrieved successfully"
        )
    );
});

export {
    updateProfileDetail,
    getProfileStatus,
    createComplaint,
    resolveComplaint,
    deleteComplaint,
    getStudentComplaints
};