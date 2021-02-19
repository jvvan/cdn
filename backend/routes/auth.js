const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get("/session", (req, res) => {
  if (res.locals.user)
    res.json({ ...res.locals.user._doc, discord: res.locals.discord });
  else res.status(401).json({ error: "Unauthorized" });
});
router.get(
  "/login",
  (req, res, next) => {
    if (req.query.goto) {
      req.session.goto = req.query.goto;
    }
    next();
  },
  passport.authenticate("discord", { prompt: "none" })
);

router.get(
  "/discord/callback",
  passport.authenticate("discord", { failureRedirect: "/auth/login" }),
  (_err, _req, res, _next) => {
    res.send("Error! Try again.");
  },
  async (req, res) => {
    const discord = req.user;
    req.session.discord = discord;
    const goto = req.session.goto ?? "/";
    req.session.goto = null;
    res.redirect(goto);
  }
);

router.get("/logout", (req, res) => {
  req.session.discord = null;
  req.logout();
  res.redirect("/");
});

module.exports = router;
