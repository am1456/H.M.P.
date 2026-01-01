import { ApiError } from "../utilities/ApiError.js";

export const requireAdmin = (req, res, next) => {
    if (
        req.user.role !== "admin" &&
        req.user.role !== "superAdmin"
    ) {
        throw new ApiError(403, "Admin access required");
    }
    next();
};

export const requireSuperAdmin = (req, res, next) => {
    if (req.user.role !== "superAdmin") {
        throw new ApiError(403, "Super admin access required");
    }
    next();
};

export const requireWarden = (req, res, next) => {
    if( req.user.role !== "warden"){
        throw new ApiError(403, "Warden access required");
    }
}
export const requireStudent = (req, res, next) => {
    if (req.user.role !== "student") {
        throw new ApiError(403, "Student access required");
    }
    next();
};
