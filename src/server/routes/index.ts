import express, { NextFunction, Request, Response } from "express";
import { statSync } from "fs";
import path from "path";
import { getConfig } from "../utils/getConfig";
import { File } from "../models/File";
const config = getConfig();
const router = express.Router();

router.get("/files/embed/:key", (req, res) => {
  const { key } = req.params;

  const filepath = path.join(config.files.storage, key);
  if (!filepath.startsWith(config.files.storage))
    return res.status(400).json({ error: "Invalid path!" });

  try {
    statSync(filepath);
  } catch {
    const html = `
<meta property="og:title" content="${config.meta.name}"/>
<meta property="theme-color" content="${config.meta.color}">
<meta name="description" content="File not found">
<meta name="twitter:description" content="File not found">
`;
    return res.send(html);
  }
  const html = `
<meta property="og:title" content="${config.meta.name}"/>
<meta property="og:image" content="${config.meta.baseurl}/files/${key}?raw">
<meta property="theme-color" content="${config.meta.color}">
<meta property="twitter:card" name="twitter:card" content="summary_large_image">
<img src="${config.meta.baseurl}/files/${key}?raw"/>
`;
  res.send(html);
});

router.get("/files/:key/download", async (req, res) => {
  const { key } = req.params;
  const _id = key.split(".")[0];

  const file = await File.findOne({ _id }).lean();
  if (!file) return res.status(404).json({ error: "Not Found" });

  const filepath = path.join(config.files.storage, `${_id}.${file.type}`);
  const root = path.join(import.meta.dirname, "..", "..", "..");

  if (!filepath.startsWith(config.files.storage))
    return res.status(400).json({ error: "Invalid path!" });

  res.download(
    filepath,
    file.name,
    {
      root,
    },
    (err) => {
      if (err) {
        res.status(404).json({ error: "File not found" });
      }
    },
  );
});

router.get(
  "/files/:key",
  (req: Request, res: Response, next: NextFunction) => {
    const { key } = req.params;
    if (
      !("raw" in req.query) &&
      req.header("user-agent")?.includes("Discordbot")
    ) {
      return res.redirect(`/files/embed/${key}`);
    }
    next();
  },
  async (req: Request, res: Response, next: NextFunction) => {
    const { key } = req.params;
    const _id = key.split(".")[0];
    const file = await File.findOne({ _id }).lean();
    if (!file) return res.status(404).json({ error: "Not Found" });
    const filepath = path.join(config.files.storage, `${_id}.${file.type}`);
    const root = path.join(import.meta.dirname, "..", "..", "..");
    if (!filepath.startsWith(config.files.storage))
      return res.status(400).json({ error: "Invalid path!" });

    res.sendFile(
      filepath,
      {
        root,
      },
      (err) => {
        if (err) {
          next(err);
        }
      },
    );
  },
  (_error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.log(_error);
    res.status(404).json({ error: "File not found" });
  },
);
export default router;
