import { INIT_DATABASE } from "@/config/database.config";
import { getAccessToken } from "@/services/auth.service";
import { AppError } from "@/utils/appError.utils";
import { ApiResponse } from "@/utils/response.utils";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await INIT_DATABASE();
        const { refreshToken } = await req.json();
        console.log(refreshToken);
        // generating new access token
        const token = await getAccessToken(refreshToken);
        if (!token) return ApiResponse.error("Failed to generate new token", 422);
        // success response
        return ApiResponse.success("New access token generated successfully.", { accessToken: token });
    } catch (error: unknown) {
        if (error instanceof AppError) {
            return ApiResponse.error(error.message, error.statusCode);
        }

        return ApiResponse.error(
            error instanceof Error ? error.message : "Unknown error",
            500
        );
    }
}