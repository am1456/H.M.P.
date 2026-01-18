import { ApiError } from "../utilities/ApiError.js";
import { AsyncHandler } from "../utilities/AsyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
import { Staff } from "../models/staff.model.js";

export const verifyJWT = AsyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    
        if(!token){
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedAccessToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedAccessToken?._id).select("-password -refreshToken")
    
        if(!user){
            throw new ApiError(401, "Invalid Access Token")
        }
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
    }
    
})

export const verifyJWTStaff = AsyncHandler(async(req, res, next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    
        if(!token){
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedAccessToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await Staff.findById(decodedAccessToken?._id).select("-pin -refreshToken")
    
        if(!user){
            throw new ApiError(401, "Invalid Access Token")
        }
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
    }
    
})