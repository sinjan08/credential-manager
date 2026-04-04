import { FolderInterface, PaginatedFolders } from "@/Interface/folder.interface";
import Folder from "@/models/folder.model";
import { CreateFolderDTO } from "@/types/folder.types";
import { AppError } from "@/utils/appError.utils";


/**
 * Upsert a folder (create or update)
 */
export const upsertFolder = async (
  data: CreateFolderDTO
): Promise<FolderInterface> => {
  try {
    const { id, name, description, category, owner, folderId } = data;

    // 🔁 UPDATE
    if (id) {
      const folder = await Folder.findOneAndUpdate(
        { _id: id, isDeleted: false },
        {
          ...(name && { name }),
          ...(description && { description }),
          ...(category && { category }),
          ...(owner && { owner }),
          ...(folderId && { folderId }),
        },
        { new: true }
      );

      if (!folder) {
        throw new AppError("Folder not found", 404);
      }

      return folder;
    }

    // ➕ CREATE
    if (!name) {
      throw new AppError("Name is required", 400);
    }

    return await Folder.create({ name, description, category, owner, folderId });

  } catch (err: unknown) {
    if (err instanceof AppError) throw err;

    throw new AppError(
      err instanceof Error ? err.message : "Internal server error",
      500
    );
  }
};

/**
 * Get all folders with pagination + search
 */
export const getAllFolders = async (
  page: number,
  limit: number,
  search?: string
): Promise<PaginatedFolders> => {
  try {
    // ✅ validation
    if (isNaN(page) || isNaN(limit)) {
      throw new AppError("Page and limit must be numbers", 400);
    }

    if (page < 1) {
      throw new AppError("Page cannot be less than 1", 400);
    }

    if (limit < 1) {
      throw new AppError("Limit cannot be less than 1", 400);
    }

    if (limit > 100) {
      throw new AppError("Limit cannot exceed 100", 400);
    }

    const query: Record<string, boolean | RegExp | undefined> = {
      isDeleted: false,
    };

    if (search?.trim()) {
      query.name = new RegExp(search.trim(), "i");
    }

    const skip = (page - 1) * limit;

    // ✅ parallel execution
    const [totalFolders, folders] = await Promise.all([
      Folder.countDocuments(query),
      Folder.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean<FolderInterface[]>(), // ✅ IMPORTANT
    ]);

    const totalPages = Math.ceil(totalFolders / limit) || 1;

    if (page > totalPages && totalFolders > 0) {
      throw new AppError("Page not found", 404);
    }

    return {
      page,
      limit,
      total: totalFolders,
      hasMore: page < totalPages,
      folders,
    };
  } catch (err: unknown) {
    if (err instanceof AppError) throw err;

    throw new AppError(
      err instanceof Error ? err.message : "Internal server error",
      500
    );
  }
};

/**
 * Soft delete folder
 */
export const softDeleteFolder = async (id: string): Promise<boolean> => {
  try {
    const folder = await Folder.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      { new: true }
    );

    if (!folder) {
      throw new AppError("Folder not found", 404);
    }

    return true;

  } catch (err: unknown) {
    if (err instanceof AppError) throw err;

    throw new AppError(
      err instanceof Error ? err.message : "Internal server error",
      500
    );
  }
};

/**
 * Get folder by ID
 */
export const getFolderById = async (
  id: string
): Promise<FolderInterface> => {
  try {
    const folder = await Folder.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!folder) {
      throw new AppError("Folder not found", 404);
    }

    return folder;

  } catch (err: unknown) {
    if (err instanceof AppError) throw err;

    throw new AppError(
      err instanceof Error ? err.message : "Internal server error",
      500
    );
  }
};