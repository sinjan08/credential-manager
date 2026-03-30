// import { CategoryInterface } from "@/Interface/category.interface";
// import mongoose, { Model, Schema } from "mongoose";

// const CategorySchema: Schema<CategoryInterface> = new Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//       minlength: 3,
//       maxlength: 100,
//     },
//     description: {
//       type: String,
//       trim: true,
//       maxlength: 500,
//     },
//     isDeleted: {
//       type: Boolean,
//       default: false,
//     },
//     deletedAt: {
//       type: Date,
//       default: null,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Category: Model<CategoryInterface> =
//   mongoose.models.Category || mongoose.model<CategoryInterface>("Category", CategorySchema);

// export default Category;

import { CategoryInterface } from "@/Interface/category.interface";
import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema<CategoryInterface>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Category =
  models.Category || model<CategoryInterface>("Category", CategorySchema);

export default Category;