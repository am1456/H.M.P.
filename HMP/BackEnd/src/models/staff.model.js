import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const staffSchema = new mongoose.Schema(
    {
        phone:{
            type: Number,
            required:true
        },

        fullName: {
            type: String,
            required: true,
        },

        
        role: {
            type: [String],
            enum: ['electrician', 'plumber', 'cleaner', 'network', 'carpenter'],
            required: true,
        },

        hostel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hostel",
        },

        pin: {
            type: String,
            required: [true, "pin is required"],
        },

        refreshToken: {
            type: String,
        },
    },
    { timestamps: true }
);

staffSchema.pre("save", async function () {
    if (!this.isModified("pin")) return;

    this.pin = await bcrypt.hash(this.pin, 10);
});

staffSchema.methods.ispinCorrect = async function (pin) {
    return await bcrypt.compare(pin, this.pin)
}

staffSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            phone: this.phone,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    )
}
staffSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    )

}
export const Staff = mongoose.model("Staff", staffSchema);