import { Schema, Types, model } from "mongoose";
import { randomString } from "../utils/randomString";

export interface IFile {
  _id: string;
  name: string;
  type: string;
  size: number;
  user: Types.ObjectId;
}

const FileSchema = new Schema<IFile>(
  {
    _id: {
      type: String,
      required: true,
      default: () => randomString(8),
    },
    name: { type: String, required: true },
    type: { type: String, required: true },
    size: { type: Number, required: true },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
  },
  { timestamps: true, _id: false }
);

export const File = model<IFile>("File", FileSchema);
