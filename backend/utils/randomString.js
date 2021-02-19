const crypto = require("crypto");
module.exports = (len) =>
  crypto.randomBytes(Math.floor(len / 2)).toString("hex");
