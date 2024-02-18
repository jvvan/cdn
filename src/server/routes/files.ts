import express from "express";
import expressfileupload from "express-fileupload";
import { rateLimit } from "../utils/ratelimit";
import { auth } from "../middlewares/auth";
import { getConfig } from "../utils/getConfig";
import mime from "mime";
import { File } from "../models/File";
import path from "path";
import { unlinkSync } from "fs";

const config = getConfig();
const router = express.Router();

router.post(
  "/upload",
  rateLimit(10000, 25),
  auth("whitelist"),
  expressfileupload({
    tempFileDir: config.files.temp,
    useTempFiles: true,
    preserveExtension: true,
    abortOnLimit: true,
    uploadTimeout: 0,
    createParentPath: true,
  }),
  async (req, res) => {
    const file = req.files?.file;
    if (!file || Array.isArray(file))
      return res.status(400).json({ error: "No file uploaded!" });

    const type =
      mime.getExtension(file.mimetype) || file.name.split(".").pop() || "none";

    const doc = new File({
      name: file.name,
      type,
      size: file.size,
      user: res.locals.user._id,
    });

    try {
      await file.mv(path.join(config.files.storage, `${doc._id}.${doc.type}`));
    } catch {
      return res.status(500).json({ error: "Error while uploading!" });
    }

    await doc.save();
    res.json(doc);
  },
);

router.get("/", rateLimit(30000, 15), auth("whitelist"), async (_req, res) => {
  const files = await File.find({ user: res.locals.user._id }).lean();
  res.json(files);
});

router.delete(
  "/:key",
  rateLimit(30000, 15),
  auth("whitelist"),
  async (req, res) => {
    const { key } = req.params;
    const doc = await File.findOne({ _id: key });
    if (!doc) return res.status(404).json({ error: "Not Found" });

    if (!doc.user.equals(res.locals.user._id) && !res.locals.user.admin)
      return res.status(403).json({ error: "Forbidden" });

    const filepath = path.join(config.files.storage, `${key}.${doc.type}`);
    if (!filepath.startsWith(config.files.storage))
      return res.status(400).json({ error: "Invalid path!" });

    await File.deleteOne({ _id: key });

    try {
      unlinkSync(filepath);
    } catch {
      return res.status(500).json({ error: "File was not found in storage" });
    }

    res.json(doc);
  },
);

export default router;
