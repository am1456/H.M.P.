import { AsyncHandler } from "../utilities/AsyncHandler.js"; 
import { ApiError } from "../utilities/ApiError.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { Hostel } from "../models/hostel.model.js"; 
import { Room } from "../models/room.model.js"; 
 
const createHostelBatch = AsyncHandler(async (req, res) => {
    const { 
        name, 
        code, 
        totalRooms, 
        capacity, 
        startRoomNumber 
    } = req.body;

    // 1. Basic Validation
    if (!name || !code || !totalRooms) {
        throw new ApiError(400, "Name, Code, and Total Rooms are required");
    }

    // 2. Check Uniqueness
    const existingHostel = await Hostel.findOne({ code });
    if (existingHostel) {
        throw new ApiError(409, "A hostel with this code already exists");
    }

    // 3. Create the Hostel First
    const hostel = await Hostel.create({
        name,
        code
    });

    try {
        // 4. Generate the Room Data in a Loop
        const roomPayloads = [];
        let currentRoomNum = parseInt(startRoomNumber) || 101; // Default to 101 if not provided

        for (let i = 0; i < parseInt(totalRooms); i++) {
            roomPayloads.push({
                number: String(currentRoomNum), // Ensure it's a string
                hostel: hostel._id,             // Link to the hostel we just made
                capacity: parseInt(capacity) || 1, // Default to 1
                occupants: []                   // Start empty
            });
            currentRoomNum++; // Increment: 101 -> 102 -> 103
        }

        // 5. Bulk Insert (Much faster than creating one by one)
        // insertMany puts all 50 or 100 rooms in the DB in one shot
        const createdRooms = await Room.insertMany(roomPayloads);

        return res.status(201).json(
            new ApiResponse(
                201, 
                { hostel, roomsCreated: createdRooms.length }, 
                `Hostel '${name}' created with ${createdRooms.length} rooms successfully`
            )
        );

    } catch (error) {
        // ADD THIS LINE TO SEE THE REAL ERROR IN TERMINAL
        console.log("🔥 ERROR GENERATING ROOMS:", error); 

        // If creation fails, delete the hostel so we don't have empty buildings
        if (hostel?._id) {
            await Hostel.findByIdAndDelete(hostel._id);
        }
        
        throw new ApiError(500, "Failed to generate rooms. Hostel creation rolled back.");
    }
});
const getAllHostels = AsyncHandler(async (req, res) => {
    // Fetch only what we need for the dropdown (id, name, code)
    const hostels = await Hostel.find({}).select("name code _id");

    return res.status(200).json(
        new ApiResponse(200, hostels, "Hostels fetched successfully")
    );
});

const getHostelCount = AsyncHandler(async (req, res) => {
    const count = await Hostel.countDocuments({}); 

    return res.status(200).json(
        new ApiResponse(200, { count }, "Hostel count fetched successfully")
    );
});

export { createHostelBatch, getAllHostels, getHostelCount };

