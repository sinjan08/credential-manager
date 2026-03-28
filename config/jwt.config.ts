import {
    JWTAccessTokenPayload,
    JWTRefreshTokenPayload,
} from "@/types/user.types";
import jwt, { JwtPayload } from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

const ACCESS_EXPIRES_IN = "24h";
const REFRESH_EXPIRES_IN = "7d";

if (!ACCESS_SECRET || !REFRESH_SECRET) {
    throw new Error("JWT secrets are not defined");
}

export type JWTAccessToken = JWTAccessTokenPayload & JwtPayload;
export type JWTRefreshToken = JWTRefreshTokenPayload & JwtPayload;

/**
 * 🔐 Access Token
 */
export const signAccessToken = (payload: JWTAccessTokenPayload): string => {
    return jwt.sign(payload, ACCESS_SECRET, {
        expiresIn: ACCESS_EXPIRES_IN,
        algorithm: "HS256",
    });
};

/**
 * 🔄 Refresh Token
 */
export const signRefreshToken = (payload: JWTRefreshTokenPayload): string => {
    return jwt.sign(payload, REFRESH_SECRET, {
        expiresIn: REFRESH_EXPIRES_IN,
        algorithm: "HS256",
    });
};

/**
 * 🔍 Verify Access Token
 */
export const verifyAccessToken = (token: string): JWTAccessToken => {
    try {
        const decoded = jwt.verify(token, ACCESS_SECRET);

        if (typeof decoded !== "object" || !("id" in decoded)) {
            throw new Error("Invalid access token payload");
        }

        return decoded as JWTAccessToken;
    } catch {
        throw new Error("Invalid or expired access token");
    }
};

/**
 * 🔍 Verify Refresh Token
 */
export const verifyRefreshToken = (token: string): JWTRefreshToken => {
    try {
        const decoded = jwt.verify(token, REFRESH_SECRET);

        if (typeof decoded !== "object" || !("id" in decoded)) {
            throw new Error("Invalid refresh token payload");
        }

        return decoded as JWTRefreshToken;
    } catch {
        throw new Error("Invalid or expired refresh token");
    }
};