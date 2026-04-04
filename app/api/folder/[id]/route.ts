import { INIT_DATABASE } from "@/config/database.config";
import { withAuth } from "@/middleware/auth.middleware";
import { deleteFolder, getFolder, updateFolder } from "@/services/folder.service";
import { AppError } from "@/utils/appError.utils";
import { ApiResponse } from "@/utils/response.utils";

/**
 * fetch single folder
 * @param req 
 * @param param1 
 * @returns 
 * GET /folder/:id
 */
export const GET = withAuth<{ id: string }>(async (
  req,
  { params }
) => {
  try {
    await INIT_DATABASE();
    const { id } = await params;
    const result = await getFolder(id);

    return ApiResponse.success("Folder fetched successfully", result);
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
 * @route PUT /folder/:id
 */
export const PUT = withAuth<{ id: string }>(async (
  req,
  { params }
) => {
  try {
    await INIT_DATABASE();
    const body = await req.json();
    const { id } = await params;

    const result = await updateFolder(id, body);

    return ApiResponse.success("Folder updated successfully", result);
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
 * delete folder
 * @param req 
 * @param param1 
 * @returns 
 * @route DELETE /folder/:id
 */
export const DELETE = withAuth<{ id: string }>(async (
  req,
  { params }
) => {
  try {
    await INIT_DATABASE();
    const { id } = await params;

    await deleteFolder(id);

    return ApiResponse.success("Folder deleted successfully");
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