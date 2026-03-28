import { UserInterface } from "@/Interface/user.interface";
import mongoose, { Model, Schema } from "mongoose";

const UserSchema: Schema<UserInterface> = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 100,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 8,
        },
        mobile: {
            type: String,
            trim: true,
            match: [/^\+?[1-9]\d{1,14}$/, "Please use a valid mobile number"],
        },
        profile_image_url: {
            type: String,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const User: Model<UserInterface> =
    mongoose.models.User || mongoose.model<UserInterface>("User", UserSchema);

export default User;