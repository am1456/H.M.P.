import { Complaint } from "../models/complaint.model.js";
import { ApiResponse } from "../utilities/ApiResponse";
import { AsyncHandler } from "../utilities/AsyncHandler";


const getUniversalComplainStats = AsyncHandler(async (req, res) => {
    const query = {};

    // If the user is a Warden, restrict the search to their hostel
    if (req.user.role === 'warden') {
        query.hostel = req.user.hostel;
    }

    const [pending, resolved] = await Promise.all([
        Complaint.countDocuments({ ...query, statusbyStudent: 'PENDING' }),
        Complaint.countDocuments({ ...query, statusbyStudent: 'RESOLVED' })
    ]);

    return res.status(200).json(
        new ApiResponse(200, { pending, resolved }, "Stats fetched")
    );
});

export { 
    getUniversalComplainStats
 }