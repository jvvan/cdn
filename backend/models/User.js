const { Schema, model } = require("mongoose");

const UserSchema = Schema(
  {
    id: { type: String, required: true, index: true },
    username: { type: String, required: true },
    whitelisted: { type: Boolean, required: true, default: false },
    admin: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

module.exports = model("User", UserSchema);
