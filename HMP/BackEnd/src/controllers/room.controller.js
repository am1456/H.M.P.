import { AsyncHandler } from "../utilities/AsyncHandler.js";
import { ApiError } from "../utilities/ApiError.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { Room } from "../models/room.model.js";
import { Hostel } from "../models/hostel.model.js";
import { User } from "../models/user.model.js";

const addRoomsBatch = AsyncHandler(async (req, res) => {
    const { 
        hostelId,          // Which hostel are we adding to?
        startRoomNumber,   // E.g., "201"
        totalRooms = 1,    // Default to 1 if not provided (works for single room)
        capacity = 1       // Default capacity
    } = req.body;

    // 1. Validation
    if (!hostelId || !startRoomNumber) {
        throw new ApiError(400, "Hostel ID and Start Room Number are required");
    }

    // 2. Verify Hostel Exists
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
        throw new ApiError(404, "Hostel not found");
    }

    // 3. SMART CHECK: Fetch all existing room numbers for this hostel ONLY
    // We do this to prevent creating "Room 101" if "Room 101" already exists.
    const existingRooms = await Room.find({ hostel: hostelId }).select("number");
    
    // Convert array of objects to a Set of numbers for fast checking
    // Set allows us to check .has() instantly
    const existingRoomNumbers = new Set(existingRooms.map(r => r.number));

    // 4. Prepare the Batch
    const roomsToCreate = [];
    let currentNum = parseInt(startRoomNumber);

    for (let i = 0; i < parseInt(totalRooms); i++) {
        const roomString = String(currentNum);

        // CHECK: Does this specific room already exist?
        if (existingRoomNumbers.has(roomString)) {
            throw new ApiError(409, `Room ${roomString} already exists in this hostel. Operation cancelled to prevent duplicates.`);
        }

        roomsToCreate.push({
            number: roomString,
            hostel: hostelId,
            capacity: parseInt(capacity),
            occupants: []
        });

        currentNum++;
    }

    // 5. Bulk Insert
    // This runs only if NO duplicates were found in the loop above.
    const newRooms = await Room.insertMany(roomsToCreate);

    return res.status(201).json(
        new ApiResponse(
            201, 
            { addedCount: newRooms.length, rooms: newRooms }, 
            `${newRooms.length} room(s) added successfully to ${hostel.name}`
        )
    );
});

const getRoomsByHostel = AsyncHandler(async (req, res) => {
    const { hostelId } = req.params;

    // We fetch rooms for this hostel
    const rooms = await Room.find({ hostel: hostelId });

    // Filter rooms where there is still space
    // If capacity is 2 and occupants are 1, it will show up.
    // If capacity is 2 and occupants are 2, it will be hidden.
    const availableRooms = await Promise.all(rooms.map(async (room) => {
        const occupantCount = await User.countDocuments({ room: room._id });
        if (occupantCount < room.capacity) {
            return {
                ...room._doc,
                currentOccupants: occupantCount // Pass this to frontend
            };
        }
        return null;
    }));

    // Remove the null values (rooms that are full)
    const finalRooms = availableRooms.filter(r => r !== null);

    return res.status(200).json(
        new ApiResponse(200, finalRooms, "Available rooms fetched")
    );
});

const getLastRoom = AsyncHandler(async (req, res) => {
    const { hostelId } = req.params;

    // Find the room with the highest number for this hostel
    // .sort({ number: -1 }) means "Descending Order" (105, 104, 103...)
    // .limit(1) means "Just give me the top one"
    const lastRoom = await Room.findOne({ hostel: hostelId })
        .sort({ number: -1 })
        .limit(1);

    const lastNumber = lastRoom ? parseInt(lastRoom.number) : 0;

    return res.status(200).json(
        new ApiResponse(
            200, 
            { lastRoom: lastNumber }, 
            "Last room fetched successfully"
        )
    );
});

export { addRoomsBatch, getRoomsByHostel, getLastRoom };