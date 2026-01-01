import mongoose, { Schema } from "mongoose";

const roomSchema = new Schema({
    number: {
    type: String,
    required: true
},

    hostel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hostel",
    required: true
},

    capacity: {
    type: Number,
    default: 1
}}, 
{ timestamps: true });

roomSchema.index({ hostel: 1, number: 1 }, { unique: true })

export const Room = mongoose.model("Room",roomSchema);