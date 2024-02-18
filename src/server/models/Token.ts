import { Schema, Types, model } from "mongoose";
import { randomString } from "../utils/randomString";

export interface IToken {
  token: string;
  user: Types.ObjectId;
  lastUsed: Date;
}

const TokenSchema = new Schema<IToken>(
  {
    token: {
      type: String,
      required: true,
      index: true,
      default: () => randomString(64),
    },
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    lastUsed: { type: Date, required: true, default: () => new Date() },
  },
  { timestamps: true }
);

export const Token = model<IToken>("Token", TokenSchema);
