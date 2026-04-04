
import { getAllFolders, getFolderById, softDeleteFolder, upsertFolder } from "@/repositories/folder.repositary";
import { getUserById } from "@/repositories/user.repositary";
import { CreateFolderDTO } from "@/types/folder.types";
import { AppError } from "@/utils/appError.utils";
import { sanitize } from "@/utils/common.utils";

export const addFolder = async (data: CreateFolderDTO) => {
  try {
    const { name, description, category, owner, folderId } = data;

    if (!name) {
      throw new AppError("Name is required", 400);
    }

    if (!owner) {
      throw new AppError("Owner is required", 400);
    }

    const user = await getUserById(owner);
    if (!user) {
      throw new AppError("Owner not found", 404);
    }

    const folder = await upsertFolder({ name, description, category, owner, folderId });
    return sanitize(folder.toObject());
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


export const updateFolder = async (id: string, data: CreateFolderDTO) => {
  try {
    if (!id) throw new AppError("Folder id is required", 400);

    const folderData = await getFolderById(id);
    if (!folderData) throw new AppError("Folder not found", 404);

    const folder = await upsertFolder({ ...data, id });
    return sanitize(folder.toObject());
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


export const deleteFolder = async (id: string) => {
  try {
    if (!id) throw new AppError("Folder id is required", 400);

    const folder = await softDeleteFolder(id);
    return folder;
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


export const getFolders = async (page: number, limit: number, search: string = "") => {
  try {
    const folders = await getAllFolders(page, limit, search);

    const { folders: sanitizedFolders } = folders;
    folders.folders = sanitizedFolders.map((folder) =>
      sanitize(folder)
    );

    return folders;
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

export const getFolder = async (id: string) => {
  try {
    if (!id) throw new AppError("Folder id is required", 400);
    const folder = await getFolderById(id);
    return sanitize(folder.toObject());
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