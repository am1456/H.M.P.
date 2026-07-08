import { Complaint } from "../models/complaint.model.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { AsyncHandler } from "../utilities/AsyncHandler.js";


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

const getDailyComplaintStats = AsyncHandler(async (req, res) => {
    const query = {};

    if (req.user.role === 'warden') {
        query.hostel = req.user.hostel;
    }

    const now = new Date();
    // Start of the current month in local/server time
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats = await Complaint.aggregate([
        {
            $match: {
                ...query,
                createdAt: { $gte: startOfMonth }
            }
        },
        {
            $group: {
                _id: { $dayOfMonth: "$createdAt" },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);

    // Step 1: Find the total number of days in the current month
    // JavaScript date arithmetic trick:
    // JavaScript months are 0-indexed (Jan = 0, Dec = 11). Days are 1-indexed (1 to 31).
    // If you pass "0" as the day parameter, JavaScript rolls the date back to the last day of the PREVIOUS month.
    //
    // For example, if today is July:
    //   1. now.getMonth() is 6 (July).
    //   2. nextMonthIndex becomes 7 (August).
    //   3. rolledBackDay is 0 (Day 0 of August).
    //   4. JavaScript calculates: "What is 1 day before August 1st?" -> July 31st!
    //   5. .getDate() on July 31st extracts the number 31.
    //
    // This dynamically returns the exact total number of days in the current month (even handling leap years!).
    const currentYear = now.getFullYear();
    const nextMonthIndex = now.getMonth() + 1; 
    const rolledBackDay = 0; 
    
    const lastDayOfCurrentMonthDate = new Date(currentYear, nextMonthIndex, rolledBackDay);
    const totalDaysInMonth = lastDayOfCurrentMonthDate.getDate();

    // Step 2: Create a lookup map for fast count checks 
    // We map each active day to its count, transforming: [{ _id: 3, count: 5 }] -> { 3: 5 }
    const statsMap = {};
    stats.forEach(item => {
        const dayOfMonth = item._id;
        const complaintCount = item.count;
        statsMap[dayOfMonth] = complaintCount;
    });

    // Step 3: Zero-fill the missing days 
    // Loop through every single day of the month (1 to 28/29/30/31)
    const dailyStats = [];
    for (let day = 1; day <= totalDaysInMonth; day++) {
        const countForDay = statsMap[day];
        
        let finalCount = 0;
        // If the database had complaints for this day, use that number. Otherwise, default to 0.
        if (countForDay !== undefined) {
            finalCount = countForDay;
        } else {
            finalCount = 0;
        }

        dailyStats.push({
            day: day,
            count: finalCount
        });
    }

    return res.status(200).json(
        new ApiResponse(200, dailyStats, "Daily complaint stats fetched successfully")
    );
});

const getCategoryComplaintStats = AsyncHandler(async (req, res) => {
    const query = {};

    if (req.user.role === 'warden') {
        query.hostel = req.user.hostel;
    }

    const now = new Date();
    // Start from the first day of the month 11 months ago (total 12 months including this month)
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const stats = await Complaint.aggregate([
        {
            $match: {
                ...query,
                createdAt: { $gte: twelveMonthsAgo }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                    category: "$assignedRole"
                },
                count: { $sum: 1 }
            }
        },
        { 
            $sort: {
                "_id.year": 1,
                "_id.month": 1,
                "_id.category": 1  
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, stats, "Category-wise complaint stats fetched successfully")
    );
});


export { 
    getUniversalComplainStats,
    getDailyComplaintStats,
    getCategoryComplaintStats
 }