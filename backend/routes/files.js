const express = require("express");
const config = require("../../config");
const expressfileupload = require("express-fileupload");
const auth = require("../middlewares/auth");
const mime = require("mime");
const File = require("../models/File");
const ratelimit = require("../utils/ratelimit");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.post(
  "/upload",
  ratelimit(10000, 3),
  auth("whitelist"),
  expressfileupload({
    tempFileDir: config.files.temp,
    useTempFiles: true,
    preserveExtension: true,
    abortOnLimit: true,
    uploadTimeout: 60000,
    createParentPath: true,
  }),
  async (req, res) => {
    const file = req.files?.file;
    if (!file) return res.status(400).json({ error: "No file uploaded!" });
    const type = mime.getExtension(file.mimetype);
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
  }
);

router.get("/", ratelimit(30000, 15), auth("whitelist"), async (_req, res) => {
  const files = await File.find({ user: res.locals.user._id }).lean();
  res.json(files);
});

router.delete(
  "/:key",
  ratelimit(30000, 15),
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
      fs.unlinkSync(filepath);
    } catch {
      return res.status(500).json({ error: "File was not found in storage" });
    }
    res.json(doc);
  }
);

module.exports = router;
