import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 150
    },
    description: {
        type: String, 
        trim: true
    },
    attachmentUrl: {
        type: String
    },
    issuedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hostel',
        required: true
    },
    readBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }]
},  {timestamps: true});

export const Notice = mongoose.model('Notice', noticeSchema);
