import { getAllCategories, getCategoryById, softDeleteCategory, upsertCategory } from "@/repositories/category.repositary";
import { CreateCategoryDTO } from "@/types/category.types";
import { AppError } from "@/utils/appError.utils";
import { sanitize } from "@/utils/common.utils";

export const addCategory = async (data: CreateCategoryDTO) => {
  try {
    const { name } = data;

    if (!name) {
      throw new AppError("Name is required", 400);
    }

    const category = await upsertCategory(data);
    return sanitize(category.toObject());
  } catch (err: unknown) {
    if (err instanceof AppError) {
      throw err;
    }

    throw new AppError(
      err instanceof Error ? err.message : "Internal server error",
      500
    );
  }
};


export const updateCategory = async (id: string, data: CreateCategoryDTO) => {
  try {
    if (!id) throw new AppError("Category id is required", 400);

    const categoryData = await getCategoryById(id);
    if (!categoryData) throw new AppError("Category not found", 404);

    const category = await upsertCategory({ ...data, id });
    return sanitize(category.toObject());
  } catch (err: unknown) {
    if (err instanceof AppError) {
      throw err;
    }

    throw new AppError(
      err instanceof Error ? err.message : "Internal server error",
      500
    );
  }
}


export const deleteCategory = async (id: string) => {
  try {
    if (!id) throw new AppError("Category id is required", 400);

    const category = await softDeleteCategory(id);
    return category;
  } catch (err: unknown) {
    if (err instanceof AppError) {
      throw err;
    }

    throw new AppError(
      err instanceof Error ? err.message : "Internal server error",
      500
    );
  }
}


export const getCategories = async (page: number, limit: number, search: string = "") => {
  try {
    const categories = await getAllCategories(page, limit, search);

    const { categories: sanitizedCategories } = categories;
    categories.categories = sanitizedCategories.map((category) =>
      sanitize(category)
    );

    return categories;
  } catch (err: unknown) {
    if (err instanceof AppError) {
      throw err;
    }

    throw new AppError(
      err instanceof Error ? err.message : "Internal server error",
      500
    );
  }
}

export const getCategory = async (id: string) => {
  try {
    if (!id) throw new AppError("Category id is required", 400);
    const category = await getCategoryById(id);
    return sanitize(category.toObject());
  } catch (err: unknown) {
    if (err instanceof AppError) {
      throw err;
    }

    throw new AppError(
      err instanceof Error ? err.message : "Internal server error",
      500
    );
  }
}