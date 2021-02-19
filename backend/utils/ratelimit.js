const ratelimit = require("express-rate-limit");

module.exports = (ms, max) => {
  return ratelimit({
    windowMs: ms,
    max,
    handler: (_, res) => {
      res.status(429).json({ error: "Rate Limit Reached" });
    },
  });
};
