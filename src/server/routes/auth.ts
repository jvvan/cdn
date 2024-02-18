import express, { Request, Response } from "express";
import { User } from "../models/User";
import {
  createDiscordAuthorizeUri,
  getDiscordTokens,
  getDiscordUserInfo,
} from "../utils/discord";
import { sanitizeUsername } from "../utils/sanitizeUsername";

const router = express.Router();

router.get("/session", (_req, res) => {
  if (!res.locals.user) return res.status(401).json({ error: "Unauthorized" });

  res.json({ ...res.locals.user._doc, discord: res.locals.discord });
});

router.get("/login", (req, res) => {
  if (req.query.redirect) {
    req.session.redirect = req.query.redirect as string;
  }

  res.redirect(createDiscordAuthorizeUri());
});

router.get("/discord/callback", async (req: Request, res: Response) => {
  if (!req.query.code) return res.redirect("/");

  try {
    const tokens = await getDiscordTokens(req.query.code as string);
    if (!tokens.access_token) return res.redirect("/");

    const profile = await getDiscordUserInfo(tokens.access_token);
    if (!profile.id) return res.redirect("/");

    req.session.discord = profile;

    if (!(await User.exists({ id: profile.id })))
      await new User({
        id: profile.id,
        username: sanitizeUsername(profile.username) || Date.now(),
      }).save();

    const redirect = req.session.redirect || "/";
    req.session.redirect = undefined;

    res.redirect(redirect);
  } catch {
    res.redirect("/");
  }
});

router.get("/logout", (req, res) => {
  req.session.discord = undefined;
  res.redirect("/");
});

export default router;
