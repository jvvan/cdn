const { Schema, model } = require("mongoose");
const randomString = require("../utils/randomString");

const TokenSchema = Schema(
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

module.exports = model("Token", TokenSchema);
