// import { Document } from "mongoose";

// export interface CategoryInterface extends Document {
//     name: string;
//     description?: string;
//     isDeleted: boolean;
//     createdAt: Date;
//     updatedAt: Date;
//     deletedAt?: Date | null;
// }

// export interface PaginatedCategories {
//     page: number;
//     limit: number;
//     total: number;
//     hasMore: boolean;
//     categories: CategoryInterface[];
// }

import { Types } from "mongoose";

export interface CategoryInterface {
    _id: Types.ObjectId;
    name: string;
    description?: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}

export interface PaginatedCategories {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
    categories: CategoryInterface[];
}