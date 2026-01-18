import { AsyncHandler } from "../utilities/AsyncHandler.js"
import { ApiError } from "../utilities/ApiError.js"
import { ApiResponse } from "../utilities/ApiResponse.js"
import { User } from "../models/user.model.js"
import { Staff } from "../models/staff.model.js";
import jwt from "jsonwebtoken"


const generateAccessTokenAndRefreshToken = async (userID) => {
    try {
        const user = await User.findById(userID)

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

const new_generateAccessTokenAndRefreshToken = async (userId, Model) => {
    try {
        const user = await Model.findById(userId); // Use the passed Model (User or Staff)
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};

const loginUser = AsyncHandler(async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        throw new ApiError(400, "Both Username and Password are required.")
    }

    const user = await User.findOne({ username })

    if (!user) {
        throw new ApiError(404, "User dosen't exist.")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid Password! Try Again.")
    }
    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                },
                `${loggedInUser.role} log in Successfully`
            )
        )
})




const refreshAccessToken = AsyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized Request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        // --- UNIFIED LOGIC START ---
        
        // 1. Determine which model to use. 
        // You can send 'userType' from frontend or check the decodedToken if you included role there.
        const userType = req.body.userType || decodedToken?.roleType; 
        
        // If your token doesn't have roleType, we try to find in Staff first if it fails, try User.
        // But a cleaner way is to just try finding in both if not specified:
        let user = await User.findById(decodedToken?._id);
        let Model = User;

        if (!user) {
            user = await Staff.findById(decodedToken?._id);
            Model = Staff;
        }
        
        // --- UNIFIED LOGIC END ---

        if (!user) {
            throw new ApiError(404, "Invalid Refresh Token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh Token is expired or used");
        }

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        };

        // This helper needs to be able to handle both models
        // Pass the Model as an argument if your helper isn't already generic
        const { accessToken, refreshToken: newRefreshToken } = await new_generateAccessTokenAndRefreshToken(user._id, Model);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { userType: Model.modelName }, // Tell frontend if they are now a Staff or User
                    "Access Token Refreshed"
                )
            );

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Refresh Token");
    }
});

const logoutUser = AsyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
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

const forgotPassword = AsyncHandler(async (req, res) => {
    const { username, email, newPassword } = req.body;

    if (!username || !email || !newPassword) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({ username, email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    user.password = newPassword;
    user.refreshToken = undefined;
    await user.save();

    return res.json(
        new ApiResponse(200, null, "Password reset successful")
    );
});



export {
    loginUser,
    refreshAccessToken,
    logoutUser,
    forgotPassword
}