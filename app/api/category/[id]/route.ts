import { AuthenticatedRequest, withAuth } from "@/middleware/auth.middleware";
import { deleteCategory, getCategory, updateCategory } from "@/services/category.service";
import { AppError } from "@/utils/appError.utils";
import { ApiResponse } from "@/utils/response.utils";

/**
 * fetch single category
 * @param req 
 * @param param1 
 * @returns 
 * GET /category/:id
 */
export const GET = withAuth(async (
  req: AuthenticatedRequest,
  { params }
) => {
  try {
    const { id } = await params;
    const result = await getCategory(id);

    return ApiResponse.success("Category fetched successfully", result);
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


/**
 * 
 * @param req 
 * @param param1 
 * @returns 
 * @route PUT /category/:id
 */
export const PUT = withAuth(async (
  req: Request,
  { params }
) => {
  try {
    const body = await req.json();
    const { id } = await params;
    const result = await updateCategory(id, body);

    return ApiResponse.success("Category updated successfully", result);
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


/**
 * delete category
 * @param req 
 * @param param1 
 * @returns 
 * @route DELETE /category/:id
 */
export const DELETE = withAuth(async (
  req: Request,
  { params }
) => {
  try {
    const { id } = await params;
    await deleteCategory(id);

    return ApiResponse.success("Category deleted successfully");
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