import jwt from "jsonwebtoken";

export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
    mobile?: string;
    profile_image_url?: string;
}

export interface JWTAccessTokenPayload {
    id: string;
    name: string;
    email: string;
}

export interface JWTRefreshTokenPayload {
    id: string;
}

export type JWTAccessToken = JWTAccessTokenPayload & jwt.JwtPayload;
export type JWTRefreshToken = JWTRefreshTokenPayload & jwt.JwtPayload;