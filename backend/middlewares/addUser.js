const Token = require("../models/Token");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  if (req.session.discord) {
    const discord = req.session.discord;
    const user = await User.findOne({ id: discord.id });
    res.locals.user = user;
    res.locals.discord = discord;
  } else if (req.header("Authorization")) {
    const header = req.header("Authorization");
    const token = await Token.findOne({ token: header }).populate("user");
    if (token) {
      if (token.user) {
        res.locals.user = token.user;
        token.lastUsed = new Date();
        await token.save();
      } else await Token.deleteOne({ token: header });
    }
  }
  next();
};
