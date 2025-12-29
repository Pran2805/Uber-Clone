import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICaptain extends Document {
    fullName: {
        firstName: string;
        lastName?: string;
    };
    email: string;
    password: string;
    socketId?: string;
    createdAt: Date;
    updatedAt: Date;
    status: string;
    vehicle: {
        color: string
        capacity: number
        plate: string
        vehicleType: string
    }
    location?: {
        lat?: number
        long?: number
    }
}

const captainSchema = new Schema<ICaptain>(
    {
        fullName: {
            firstName: {
                type: String,
                required: true,
                minlength: 3,
                trim: true,
            },
            lastName: {
                type: String,
                minlength: 3,
                trim: true,
            },
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\S+@\S+\.\S+$/,
                "Please use a valid email address",
            ],
            index: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        socketId: {
            type: String,
            index: true,
        },

        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: "inactive"
        },
        vehicle: {
            color: {
                type: String,
                required: true,
                minlength: [3, "Color must be atleast 3 characters long"]
            },
            plate: {
                type: String,
                required: true,
                minlength: [3, "Plate number must be atleast 3 characters long"]
            },
            capacity: {
                type: Number,
                required: true,
                min: [1, "Capacity must be atleast 1"]
            },
            vehicleType: {
                type: String,
                required: true,
                enum: ["car", "motorcycle", "auto"]
            }
        },
        location: {
            lat: {
                type: Number,
            },
            long: {
                type: Number,
            }
        }
    },
    {
        timestamps: true,
    }
);

const Captain: Model<ICaptain> = mongoose.model<ICaptain>("Captain", captainSchema);
export default Captain;
