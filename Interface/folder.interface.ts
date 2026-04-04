import { Document } from "mongoose";

export interface FolderInterface extends Document {
    name: string;
    description?: string;
    category?: string;
    owner: string;
    folderId?: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}

export interface PaginatedFolders {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
    folders: FolderInterface[];
}