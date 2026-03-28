import { withAuth } from "@/middleware/auth.middleware";
import { addCategory, getCategories } from "@/services/category.service";
import { AppError } from "@/utils/appError.utils";
import { ApiResponse } from "@/utils/response.utils";

/**
 * Create a new category
 * @param req 
 * @returns 
 * @route POST /category
 */
export const POST = withAuth(async (req: Request) => {
  try {
    const body = await req.json();
    // calling service layer function
    const result = await addCategory(body);

    return ApiResponse.success("Category added successfully", result);
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
 * Get all categories with pagination 
 * @param req 
 * @returns 
 * @route GET /category
 */
export const GET = withAuth(async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "" as string;

    const result = await getCategories(page, limit, search);

    return ApiResponse.success("Categories fetched successfully", result);
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