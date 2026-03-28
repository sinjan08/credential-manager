import { INIT_DATABASE } from "@/config/database.config";
import { loginService } from "@/services/auth.service";
import { AppError } from "@/utils/appError.utils";
import { ApiResponse } from "@/utils/response.utils";


export async function POST(req: Request) {
    try {
        // ALWAYS connect DB here
        await INIT_DATABASE();

        const body = await req.json();
        // calling login service layer function
        const result = await loginService(body);

        return ApiResponse.success("Login successful", result);
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