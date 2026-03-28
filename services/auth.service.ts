import { signAccessToken, signRefreshToken, verifyRefreshToken } from "@/config/jwt.config";
import { getUserById, loginUser } from "@/repositories/user.repositary";
import { AppError } from "@/utils/appError.utils";
import { sanitize } from "@/utils/common.utils";
import bcryptjs from "bcryptjs";

/**
 * Login service for users
 * @param data
 */
export const loginService = async (data: {
    email: string;
    password: string;
}) => {
    try {
        // validating input data
        if (!data.email || !data.password) {
            throw new Error("Email and password are required");
        }
        // calling repo layer function to login
        const user = await loginUser(data.email);
        // checking password is matched or not
        const isMatch = await bcryptjs.compare(data.password, user.password);
        if (!isMatch) {
            throw new Error("Invalid credentials");
        }

        // remove sensitive data
        const userObj = user.toObject();
        delete userObj.password;

        // generating access token
        const accessToken = signAccessToken({
            id: userObj._id.toString(),
            name: userObj.name,
            email: userObj.email,
        });
        // generating refresh token
        const refreshToken = signRefreshToken({
            id: userObj._id.toString()
        });

        // finally returning logged in user data
        return { accessToken, refreshToken, user: sanitize(userObj), };
    } catch (err: unknown) {
        if (err instanceof AppError) {
            throw err;
        }

        throw new AppError(
            err instanceof Error ? err.message : "Internal server error",
            500
        );
    }
};

/**
 * Generating new access token by refresh token
 * @param token
 */
export const getAccessToken = async (token: string) => {
    try {
        // verifying refresh token
        const tokenData = verifyRefreshToken(token);
        if (!tokenData) {
            return null;
        }
        //     fetching user data
        const user = await getUserById(tokenData.id);
        if (!user) return null;

        //     generating new access token
        const accessToken = signAccessToken({
            id: user._id.toString(),
            name: user.name,
            email: user.email,
        });

        return accessToken;
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