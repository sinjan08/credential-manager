import { FolderInterface } from "@/Interface/folder.interface";
import mongoose, { Model, Schema } from "mongoose";

const FolderSchema: Schema<FolderInterface> = new Schema(
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
    category: {
      type: String,
    },
    owner: {
      type: String,
      required: true,
    },
    folderId: {
      type: String,
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

const Folder: Model<FolderInterface> =
  mongoose.models.Folder || mongoose.model<FolderInterface>("Folder", FolderSchema);

export default Folder;