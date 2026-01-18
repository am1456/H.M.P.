import mongoose from "mongoose";
import { User } from "./user.model.js";

const studentProfileSchema = new mongoose.Schema(
    {
        // --- 1. LINK TO USER ACCOUNT ---
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
            validate: {
                validator: async function (userId) {
                    const user = await User.findById(userId);
                    return user && user.role === 'student';
                },
                message: 'Profile can only be created for users with role "student".'
            }
        },

        // --- 2. PERSONAL DETAILS ---
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
            required: true
        },
        dateOfBirth: {
            type: Date,
            required: true
        },
        bloodGroup: {
            type: String,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
            required: true
        },
        nationality: {
            type: String,
            default: "Indian"
        },
        category: {
            type: String,
            enum: ["General", "OBC", "SC", "ST", "Other"],
            default: "General"
        },

        // --- ACADEMIC DETAILS (Auto-Filled by System) ---
        admissionYear: { 
            type: Number, 
            required: true }, 
        course: { 
            type: String, 
            required: true },        
        branch: { 
            type: String, 
            required: true },        

        // --- 4. FAMILY / GUARDIAN DETAILS ---
        fatherName: {
            type: String,
            required: true,
            trim: true
        },
        fatherPhone: {
            type: String,
            required: true,
            trim: true
        },
        motherName: {
            type: String,
            required: true,
            trim: true
        },
        motherPhone: {
            type: String,
            trim: true
        },

        // Local Guardian 
        localGuardianName: {
            type: String,
            trim: true
        },
        localGuardianPhone: {
            type: String,
            trim: true
        },
        localGuardianRelation: {
            type: String, // e.g., Uncle, Aunt
            trim: true
        },

        // --- 5. PERMANENT ADDRESS ---
        addressLine1: {
            type: String,
            required: true
        },
        addressLine2: {
            type: String
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true,
            match: [/^[0-9]{6}$/, "Please enter a valid 6-digit Pincode"]
        },

        // --- 6. MEDICAL & EMERGENCY ---
        hasChronicDisease: {
            type: Boolean,
            default: false
        },
        chronicDiseaseDetails: {
            type: String,
            // Only required if checkbox is ticked (handled in frontend/controller validation)
            default: ""
        },
        emergencyContactName: { // Someone other than parents
            type: String,
            required: true
        },
        emergencyContactNumber: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

export const StudentProfile = mongoose.model("StudentProfile", studentProfileSchema);