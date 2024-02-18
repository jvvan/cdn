import crypto from "node:crypto";

export function randomString(len: number) {
  return crypto.randomBytes(Math.floor(len / 2)).toString("hex");
}
