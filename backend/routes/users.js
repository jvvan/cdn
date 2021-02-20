const express = require("express");
const mongoose = require("mongoose");
const auth = require("../middlewares/auth");
const File = require("../models/File");
const Token = require("../models/Token");
const User = require("../models/User");
const ratelimit = require("../utils/ratelimit");

const router = express.Router();

router.get("/", auth("admin"), async (req, res) => {
  const users = await User.find().lean();
  const files = await File.find().lean();
  res.json(
    users.map((user) => ({
      ...user,
      usedStorage: files
        .filter((file) => String(file.user) === String(user._id))
        .reduce((a, b) => a + b.size, 0),
    }))
  );
});
router.get("/@me", auth("login"), (req, res) => {
  res.json(res.locals.user);
});

router.patch("/@me", auth("login"), async (req, res) => {
  try {
    const user = res.locals.user;
    const body = req.body;
    if (
      typeof body.username === "string" &&
      user.username.toLowerCase() !== body.username.toLowerCase()
    ) {
      if (
        await User.exists({
          username: { $regex: new RegExp(`^${body.username}$`, "i") },
        })
      )
        return res.status(409).json({ error: "Username is taken" });
      user.username = body.username;
    }
    await user.save();
    res.json(user);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      res.status(400).json({
        error: Object.values(e.errors)
          .map((r) => r.message)
          .join("\n"),
      });
    } else {
      res.status(500).json({ error: e });
    }
  }
});

router.get("/@me/tokens", auth("login"), async (req, res) => {
  const tokens = await Token.find({ user: res.locals.user._id }).lean();
  res.json(tokens);
});

router.post(
  "/@me/tokens",
  ratelimit(10000, 1),
  auth("login"),
  async (req, res) => {
    const token = await new Token({
      user: res.locals.user._id,
    }).save();
    res.json(token);
  }
);

router.delete("/@me/tokens/:_id", auth("login"), async (req, res) => {
  const { _id } = req.params;
  const token = await Token.findOne({ _id });
  if (!token) return res.status(404).json({ error: "Not Found" });
  await token.remove();
  res.json(token);
});

router.get("/:_id", auth("admin"), async (req, res) => {
  try {
    const { _id } = req.params;
    const user = await User.findOne({ _id });
    if (!user) return res.status(404).json({ error: "Not Found" });
    res.json(user);
  } catch {
    res.status(404).json({ error: "Not Found" });
  }
});

router.patch("/:_id", auth("admin"), async (req, res) => {
  try {
    const { _id } = req.params;
    const user = await User.findOne({ _id });
    if (!user) return res.status(404).json({ error: "User not found" });
    const body = req.body;
    if (
      typeof body.username === "string" &&
      user.username.toLowerCase() !== body.username.toLowerCase()
    ) {
      if (
        await User.exists({
          username: { $regex: new RegExp(`^${body.username}$`, "i") },
        })
      )
        return res.status(409).json({ error: "Username is taken" });
      user.username = body.username;
    }
    if (typeof body.admin === "boolean") {
      user.admin = body.admin;
    }
    if (typeof body.whitelisted === "boolean") {
      user.whitelisted = body.whitelisted;
    }
    await user.save();
    res.json(user);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      res.status(400).json({
        error: Object.values(e.errors)
          .map((r) => r.message)
          .join("\n"),
      });
    } else {
      res.status(500).json({ error: e });
    }
  }
});

router.delete("/:_id", auth("admin"), async (req, res) => {
  try {
    const { _id } = req.params;
    const user = await User.findOne({ _id });
    if (!user) return res.status(404).json({ error: "Not Found" });
    await user.remove();
    res.json(user);
  } catch {
    res.status(404).json({ error: "Not Found" });
  }
});

module.exports = router;
