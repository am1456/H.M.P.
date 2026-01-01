import mongoose from "mongoose";

const hostelSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    code: { 
        type: String, 
        required: true, 
        unique: true 
    } 
}, { timestamps: true });

export const Hostel = mongoose.model('Hostel', hostelSchema);
