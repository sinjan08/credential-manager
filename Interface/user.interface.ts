import { Document } from "mongoose";

/**
 * User interface for schema
 */
export interface UserInterface extends Document {
    name: string;
    email: string;
    password: string;
    mobile: string;
    profile_image_url: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    isVerified: boolean;

    comparePassword(candidatePassword: string): Promise<boolean>;
}