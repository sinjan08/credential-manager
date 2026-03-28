import { CategoryInterface, PaginatedCategories } from "@/Interface/category.interface";
import Category from "@/models/category.model";
import { CreateCategoryDTO } from "@/types/category.types";
import { AppError } from "@/utils/appError.utils";

/**
 * Upsert a category (create or update)
 */
export const upsertCategory = async (
  data: CreateCategoryDTO
): Promise<CategoryInterface> => {
  try {
    const { id, name, description } = data;

    // 🔁 UPDATE
    if (id) {
      const category = await Category.findOneAndUpdate(
        { _id: id, isDeleted: false },
        {
          ...(name && { name }),
          ...(description && { description }),
        },
        { new: true }
      );

      if (!category) {
        throw new AppError("Category not found", 404);
      }

      return category;
    }

    // ➕ CREATE
    if (!name) {
      throw new AppError("Name is required", 400);
    }

    return await Category.create({ name, description });

  } catch (err: unknown) {
    if (err instanceof AppError) throw err;

    throw new AppError(
      err instanceof Error ? err.message : "Internal server error",
      500
    );
  }
};

/**
 * Get all categories with pagination + search
 */
export const getAllCategories = async (
  page: number,
  limit: number,
  search?: string
): Promise<PaginatedCategories> => {
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

    // ✅ Properly typed query (NO any)
    const query: Parameters<typeof Category.find>[0] = {
      isDeleted: false,
    };

    // ✅ search (ILIKE equivalent)
    if (search?.trim()) {
      query.name = { $regex: search.trim(), $options: "i" };
    }

    // ✅ parallel execution
    const [totalCategories, categories] = await Promise.all([
      Category.countDocuments(query),
      Category.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    const totalPages = Math.ceil(totalCategories / limit) || 1;

    if (page > totalPages && totalCategories > 0) {
      throw new AppError("Page not found", 404);
    }

    return {
      page,
      limit,
      total: totalCategories,
      hasMore: page < totalPages,
      categories,
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
 * Soft delete category
 */
export const softDeleteCategory = async (id: string): Promise<boolean> => {
  try {
    const category = await Category.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      { new: true }
    );

    if (!category) {
      throw new AppError("Category not found", 404);
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
 * Get category by ID
 */
export const getCategoryById = async (
  id: string
): Promise<CategoryInterface> => {
  try {
    const category = await Category.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    return category;

  } catch (err: unknown) {
    if (err instanceof AppError) throw err;

    throw new AppError(
      err instanceof Error ? err.message : "Internal server error",
      500
    );
  }
};