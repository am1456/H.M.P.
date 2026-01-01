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
        required: true }, 
    hostel: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Hostel', 
        required: true 
    },
    category: {
        type: String,
        enum: ['electrical', 'plumbing', 'cleaning', 'internet', 'furniture'],
        required: true
    },
    assignedRole: {
        type: String,
        enum: ['electrician', 'plumber', 'cleaner', 'network', 'carpenter'],
        required: true
    },
    status: {
        type: String,
        enum: ['OPEN', 'RESOLVED'],
        default: 'OPEN'
    },
    resolvedAt: { type: Date },
    semester: { type: String } 
}, { timestamps: true });

export const Complaint = mongoose.model('Complaint', complaintSchema);