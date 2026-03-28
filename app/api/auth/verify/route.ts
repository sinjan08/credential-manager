import { verifyOtp } from "@/services/user.service";
import { AppError } from "@/utils/appError.utils";
import { ApiResponse } from "@/utils/response.utils";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.email) {
      return ApiResponse.error("Email is required", 400);
    }
    if (!body.otp) {
      return ApiResponse.error("OTP is required", 400);
    }

    // calling user service layer function
    const result = await verifyOtp(body.email, body.otp);

    if (result) {
      return ApiResponse.success("User verified successfully", result);
    } else {
      return ApiResponse.error("Failed to verify user", 422);
    }
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