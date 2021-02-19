const { Schema, model } = require("mongoose");
const randomString = require("../utils/randomString");

const FileSchema = Schema(
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

module.exports = model("File", FileSchema);
