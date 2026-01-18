import { AsyncHandler } from "../utilities/AsyncHandler.js"
import { ApiError } from "../utilities/ApiError.js"
import { ApiResponse } from "../utilities/ApiResponse.js"
import { Room } from "../models/room.model.js"
import { User } from "../models/user.model.js"



const createAdmin = AsyncHandler(async (req, res) => {
    if (req.user.role !== "superAdmin") {
        throw new ApiError(403, "Only super admin can create admin")
    }

    const { username, fullName, email, password, mobile } = req.body

    if (!username || !fullName || !password) {
        throw new ApiError(400, "All fields are required")
    }

    const existingUser = await User.findOne({ username })
    if (existingUser) {
        throw new ApiError(409, "Admin already exists")
    }

    const admin = await User.create({
        username,
        fullName,
        email,
        password,
        mobile,
        role: "admin"
    })

    const createdUser = await User.findById(admin._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(
            500,
            "Something went wrong while registering the user"
        );
    }
    return res.status(201).json(
        new ApiResponse(
            201,
            createdUser,
            "Admin created successfully"
        )
    )
})

const createWarden = AsyncHandler(async (req, res) => {
    if (!["admin", "superAdmin"].includes(req.user.role)) {
        throw new ApiError(403, "Unauthorized")
    }

    const {
        username,
        fullName,
        email,
        password,
        role,
        hostel,
        mobile
    } = req.body
    if (!username || !fullName || !email || !password || !role || !hostel) {
        throw new ApiError(400, "All fields are required")
    }

    if (role !== "warden") {
        throw new ApiError(400, "Invalid role");
    }

    const existingUser = await User.findOne({ username })
    if (existingUser) {
        throw new ApiError(409, "Warden already exists")
    }

    const user = await User.create({
        username,
        fullName,
        email,
        password,
        role,
        hostel,
        mobile
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(
            500,
            "Something went wrong while registering the user"
        );
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            createdUser,
            "Warden is created successfully"
        )
    )
})

const createStudent = AsyncHandler(async (req, res) => {
    // 1. Authorization Check
    if (!["admin", "superAdmin"].includes(req.user.role)) {
        throw new ApiError(403, "Unauthorized: Only Admins can register students");
    }

    const {
        username,
        fullName,
        email,
        password,
        role,
        hostel,
        mobile,
        room
    } = req.body;

    // 2. Basic Validation
    if (!username || !fullName || !email || !password || !role || !hostel || !room) {
        throw new ApiError(400, "All fields are required, including Hostel and Room assignment");
    }

    if (role !== "student") {
        throw new ApiError(400, "Invalid role selection");
    }

    // 3. Room & Hostel Validation
    const roomDoc = await Room.findById(room);
    if (!roomDoc) {
        throw new ApiError(404, "The selected room does not exist");
    }

    if (roomDoc.hostel.toString() !== hostel) {
        throw new ApiError(400, "Security Alert: Room does not belong to the selected hostel");
    }

    // 4. SMART CAPACITY LOGIC
    // Count how many students are currently living in this specific room
    const currentOccupantsCount = await User.countDocuments({ room: room });

    // Check if there is space left based on room capacity
    if (currentOccupantsCount >= roomDoc.capacity) {
        throw new ApiError(
            409,
            `Room ${roomDoc.number} is full. Capacity: ${roomDoc.capacity}, Occupants: ${currentOccupantsCount}`
        );
    }

    // 5. Check for Duplicate Username
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        throw new ApiError(409, "A student with this Username/ID already exists");
    }

    // 6. Create the Student
    const user = await User.create({
        username,
        fullName,
        email,
        password,
        role,
        hostel,
        mobile,
        room
    });

    // 7. Verify Creation and Remove Sensitive Data
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the student");
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            createdUser,
            `Student ${fullName} enrolled successfully in Room ${roomDoc.number}`
        )
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

const createSuperAdmin = AsyncHandler(async (req, res) => {

    if (process.env.ALLOW_SUPER_ADMIN_CREATION !== "true") {
        throw new ApiError(403, "Super Admin creation is disabled");
    }

    const { username, email, password, fullName, mobile } = req.body;


    if (!username || !email || !password || !fullName || !mobile) {
        throw new ApiError(400, "All fields are required");
    }


    const existingSuperAdmin = await User.findOne({
        role: "superAdmin",

    });

    if (existingSuperAdmin) {
        throw new ApiError(403, "Super Admin already exists. This operation can only be performed once.");
    }


    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existingUser) {
        throw new ApiError(409, "Username or Email already exists");
    }


    const superAdmin = await User.create({
        username,
        email,
        password,
        fullName,
        mobile,
        role: "superAdmin",

    });

    const createdUser = await User.findById(superAdmin._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(
            500,
            "Something went wrong while registering the user"
        );
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                createdUser,
                "Super Admin created successfully"
            )
        );
});

const getAllUsersForAdmin = AsyncHandler(async (req, res) => {
    const { role, hostel, search, page = 1, limit = 10 } = req.query;

    const query = {
        role: { $nin: ["admin", "superAdmin"] }
    };

    // 1️⃣ role filter
    if (role) {
        query.role = role;
    }

    // 2️⃣ hostel filter
    if (hostel) {
        query.hostel = hostel;
    }

    // 3️⃣ search (username OR fullName)
    if (search) {
        query.$or = [
            { fullName: { $regex: search, $options: "i" } },//$regex help us to search partially i.e. for Arpan it will match with even Arpan123, and $options: "i" means case-insensitive
            { username: { $regex: search, $options: "i" } }
        ];
    }

    const users = await User.find(query)
        .select("-password -refreshToken")
        .populate("hostel", "name code")
        .populate("room", "number")
        .skip((page - 1) * limit)
        .limit(Number(limit))
/*   Pagination Example Table
Page	Skip	Limit	Users Returned
1	     0	     10	         1–10
2	    10	     10	        11–20
3	    20	     10      	21–30
*/
        .sort({ createdAt: -1 }); // sort by the newly created 1st 

    const totalUsers = await User.countDocuments(query); // its count how many user matches with the query

    return res.status(200).json(
        new ApiResponse(200, {
            users,
            pagination: {
                total: totalUsers,
                page: Number(page), // for type safety we are converting the "page" into Number for surity
                limit: Number(limit),
                totalPages: Math.ceil(totalUsers / limit),
            },
        })
    );
});


const getUserById = AsyncHandler(async (req, res) => {
    const { userId } = req.params

    const user = await User.findById(userId)
        .populate("hostel", "name code")
        .populate("room", "number")
        .select("-password -refreshToken")

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    // Warden restriction
    if (
        req.user.role === "warden" &&
        user.hostel?._id.toString() !== req.user.hostel.toString()
    ) {
        throw new ApiError(403, "Unauthorized")
    }

    return res.status(200).json(
        new ApiResponse(200, user, "User details fetched")
    )
})

const updateUserByAdmin = AsyncHandler(async (req, res) => {
    if (!["admin", "superAdmin"].includes(req.user.role)) {
        throw new ApiError(403, "Unauthorized")
    }

    const { userId } = req.params

    const allowedUpdates = [
        "fullName",
        "email",
        "username",
        "mobile",
        "hostel",
        "room"
    ]

    const updates = {}

    for (const key of allowedUpdates) {
        if (req.body[key] !== undefined) {
            updates[key] = req.body[key]
        }
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true, runValidators: true }
    )
        .populate("hostel", "name code")
        .populate("room", "number")
        .select("-password -refreshToken")

    if (!updatedUser) {
        throw new ApiError(404, "User not found")
    }

    return res.status(200).json(
        new ApiResponse(200, updatedUser, "User updated successfully")
    )
})

const deleteUser = AsyncHandler(async (req, res) => {
    if (!["admin", "superAdmin"].includes(req.user.role)) {
        throw new ApiError(403, "Unauthorized: Only admins can remove users");
    }

    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, null, "User deleted successfully")
    );
});


export {
    createAdmin,
    createWarden,
    createStudent,
    changeCurrentPassword,
    createSuperAdmin,
    getAllUsersForAdmin,
    updateUserByAdmin,
    deleteUser,
    getUserById
}