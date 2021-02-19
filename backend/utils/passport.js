const passport = require("passport");
const refresh = require("passport-oauth2-refresh");
const Strategy = require("passport-discord").Strategy;
const { discord } = require("../../config");

module.exports = (app) => {
  passport.serializeUser(function (u, d) {
    d(null, u);
  });
  passport.deserializeUser(function (u, d) {
    d(null, u);
  });

  const DiscordStrategy = new Strategy(
    {
      clientID: discord.client_id,
      clientSecret: discord.client_secret,
      callbackURL: discord.callback,
      scope: discord.scope,
      prompt: discord.prompt,
    },
    async (accesstoken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  );
  passport.use(DiscordStrategy);
  refresh.use(DiscordStrategy);
  app.use(passport.initialize());
  app.use(passport.session());
};
