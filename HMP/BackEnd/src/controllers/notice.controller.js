import { Notice } from "../models/notice.model.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { AsyncHandler } from "../utilities/AsyncHandler.js";
import { ApiError } from "../utilities/ApiError.js";

const getAllNotices = AsyncHandler(async (req, res) => {
    const notices = await Notice.find({
        hostel: req.user.hostel
    })
    .populate("issuedBy", "fullName")
    .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            notices,
            "Notices fetched successfully"
        )
    );
});

const markNoticeAsRead = AsyncHandler(async (req, res) => {
    const userId = req.user._id;
    const hostel = req.user.hostel;

    const result = await Notice.updateMany(
        {
            hostel: hostel,
            readBy: { $nin: [userId] }
        },
        {
            $addToSet: { readBy: userId }
        }
    );

    return res.status(200).json({
        success: true,
        message: "Notices marked as read",
        updatedCount: result.modifiedCount
    });
});

export { getAllNotices, markNoticeAsRead };