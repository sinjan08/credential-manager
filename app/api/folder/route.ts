import { INIT_DATABASE } from "@/config/database.config";
import { AuthenticatedRequest, withAuth } from "@/middleware/auth.middleware";
import { addFolder, getFolders } from "@/services/folder.service";
import { AppError } from "@/utils/appError.utils";
import { ApiResponse } from "@/utils/response.utils";
import { NextRequest } from "next/server";

/**
 * Create a new folder
 * @param req 
 * @returns 
 * @route POST /folder
 */
export const POST = withAuth(async (req: NextRequest) => {
  try {
    await INIT_DATABASE();
    const body = await req.json();
    const user = (req as AuthenticatedRequest).user;
    const userId = user?.id;

    if (!userId) {
      throw new AppError("Unauthorized: User information is missing.", 401);
    }
    // calling service layer function
    const result = await addFolder({ ...body, owner: userId });

    return ApiResponse.success("Folder added successfully", result);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return ApiResponse.error(error.message, error.statusCode);
    }

    return ApiResponse.error(
      error instanceof Error ? error.message : "Unknown error",
      500
    );
  }
})

/**
 * Get all folders with pagination 
 * @param req 
 * @returns 
 * @route GET /folder
 */
export const GET = withAuth(async (req: NextRequest) => {
  try {
    await INIT_DATABASE();
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "" as string;

    const result = await getFolders(page, limit, search);

    return ApiResponse.success("Folders fetched successfully", result);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return ApiResponse.error(error.message, error.statusCode);
    }

    return ApiResponse.error(
      error instanceof Error ? error.message : "Unknown error",
      500
    );
  }
});