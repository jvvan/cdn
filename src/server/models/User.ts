import { Schema, model } from "mongoose";

export interface IUser {
  id: string;
  username: string;
  whitelisted: boolean;
  admin: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    id: { type: String, required: true, index: true },
    username: { type: String, required: true },
    whitelisted: { type: Boolean, required: true, default: false },
    admin: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", UserSchema);
