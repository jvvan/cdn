import express from "express";
import mongoose from "mongoose";
import { auth } from "../middlewares/auth";
import { File } from "../models/File";
import { Token } from "../models/Token";
import { User } from "../models/User";
import { rateLimit } from "../utils/ratelimit";

const router = express.Router();

router.get("/", auth("admin"), async (_req, res) => {
  const users = await User.find().lean();
  const files = await File.find().lean();
  res.json(
    users.map((user) => ({
      ...user,
      usedStorage: files
        .filter((file) => String(file.user) === String(user._id))
        .reduce((a, b) => a + b.size, 0),
    })),
  );
});

router.get("/@me", auth("login"), (_req, res) => {
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

router.get("/@me/tokens", auth("login"), async (_req, res) => {
  const tokens = await Token.find({ user: res.locals.user._id }).lean();
  res.json(tokens);
});

router.post(
  "/@me/tokens",
  rateLimit(10000, 1),
  auth("login"),
  async (_req, res) => {
    const token = await new Token({
      user: res.locals.user._id,
    }).save();

    res.json(token);
  },
);

router.delete("/@me/tokens/:_id", auth("login"), async (req, res) => {
  const { _id } = req.params;
  const token = await Token.findOne({ _id });
  if (!token) return res.status(404).json({ error: "Not Found" });
  await token.deleteOne();
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

    await user.deleteOne();
    res.json(user);
  } catch {
    res.status(404).json({ error: "Not Found" });
  }
});

export default router;
