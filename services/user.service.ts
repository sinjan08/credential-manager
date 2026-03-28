import { signAccessToken, signRefreshToken } from "@/config/jwt.config";
import { UserInterface } from "@/Interface/user.interface";
import User from "@/models/user.model";
import { addUser } from "@/repositories/user.repositary";
import { CreateUserDTO } from "@/types/user.types";
import { AppError } from "@/utils/appError.utils";
import { sanitize } from "@/utils/common.utils";
import bcryptjs from "bcryptjs";
import { sendMail } from "./mail.service";
import { createOTP, verifyOTP } from "./otp.service";

/**
 * To add new user 
 * @param data
 */
export const createUser = async (data: CreateUserDTO): Promise<UserInterface> => {
    try {
        // validating input
        if (!data.name) throw new Error("Name is required");
        if (!data.email) throw new Error("Email is required");
        // validating user
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            throw new AppError("User already exists", 400);
        }
        // hasihng password
        const hashedPassword = await bcryptjs.hash(data.password, 10);
        const userData = {
            ...data,
            password: hashedPassword
        };
        // creating new user
        const user = await addUser(userData);
        // generating otp and sending email
        const otp = await createOTP(data.email);
        await sendMail({
            to: data.email,
            subject: "Verify your email – Your OTP inside",
            template: "welcome",
            data: {
                name: data.name || "User",
                otp
            }
        });

        // deleting sensitive data before returning
        const sanitizedUser = sanitize(user.toObject());

        return sanitizedUser;
    } catch (err: unknown) {
        if (err instanceof AppError) {
            throw err;
        }

        throw new AppError(
            err instanceof Error ? err.message : "Internal server error",
            500
        );
    }
}


export const verifyOtp = async (email: string, otp: string) => {
    try {
        const isValid = await verifyOTP(email, otp);

        if (!isValid) {
            throw new Error("Invalid or expired OTP");
        }

        // update user as verified
        const user = await User.findOneAndUpdate(
            { email },
            { isVerified: true },
            { new: true }
        );

        if (!user) {
            throw new Error("User not found");
        }

        // generating access token
        const accessToken = signAccessToken({
            id: user._id.toString(),
            name: user.name,
            email: user.email,
        });
        // generating refresh token
        const refreshToken = signRefreshToken({
            id: user._id.toString()
        });

        const sanitizedUser = sanitize(user.toObject());
        return { accessToken, refreshToken, user: sanitizedUser };
    } catch (err: unknown) {
        if (err instanceof AppError) {
            throw err;
        }

        throw new AppError(
            err instanceof Error ? err.message : "Internal server error",
            500
        );
    }
}