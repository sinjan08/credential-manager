import { INIT_DATABASE } from "@/config/database.config";
import { createUser } from "@/services/user.service";
import { AppError } from "@/utils/appError.utils";
import { ApiResponse } from "@/utils/response.utils";
import { NextRequest } from "next/server";


export async function POST(req: NextRequest) {
  try {
    await INIT_DATABASE();

    const formData = await req.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const mobile = formData.get("mobile") as string;

    if (!name) return ApiResponse.error("Name is required", 400);
    if (!email) return ApiResponse.error("Email is required", 400);
    if (!password) return ApiResponse.error("Password is required", 400);

    const result = await createUser({
      name,
      email,
      password,
      mobile,
    });

    return ApiResponse.success("User added successfully", result);

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