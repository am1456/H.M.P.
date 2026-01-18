import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true
     },
    description: { 
        type: String, 
        required: true 
    },
    student: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, 
    hostel: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Hostel', 
        required: true 
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required : true
    },
    mobile: {
        type: String,
        required: true 
    },
    assignedRole: {
        type: String,
        enum: ['electrician', 'plumber', 'cleaner', 'network', 'carpenter'],
        required: true
    },
    statusbyStudent: {
        type: String,
        enum: ['PENDING', 'RESOLVED'],
        default: 'PENDING'
    },
    statusbyStaff: {
        type: String,
        enum: ['SETTLED','UNSETTLED'],
        default: 'UNSETTLED'
    },
    resolvedAt: { 
        type: Date 
    },
}, { timestamps: true });

export const Complaint = mongoose.model('Complaint', complaintSchema);