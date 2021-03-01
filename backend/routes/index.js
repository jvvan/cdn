const express = require("express");
const config = require("../../config");
const path = require("path");
const { statSync } = require("fs");
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
<meta property="og:description" content="File not found">`;
    return res.status(404).send(html);
  }
  const html = `
<meta property="og:title" content="${config.meta.name}"/>
<meta property="og:image" content="${config.meta.baseurl}/files/${key}?noembed">
<meta property="theme-color" content="${config.meta.color}">
<meta property="twitter:card" name="twitter:card" content="summary_large_image">
<img src="${config.meta.baseurl}/files/${key}?noembed=1"/>`;
  res.send(html);
});
router.get(
  "/files/:key",
  (req, res, next) => {
    const { key } = req.params;
    if (
      !req.query.noembed &&
      req.header("user-agent")?.includes("Discordbot")
    ) {
      return res.redirect(`/files/embed/${key}`);
    }
    next();
  },
  (req, res, next) => {
    const { key } = req.params;
    res.sendFile(path.join(config.files.storage, key), (err) => {
      if (err) next(err);
    });
  },
  (error, req, res, next) => {
    res.status(404).json({ error: "File not found" });
  }
);
module.exports = router;
