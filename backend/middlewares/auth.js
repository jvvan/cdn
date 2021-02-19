/**
 * @param {"login"|"whitelist"|"admin"|"logout"} level
 */
module.exports = (level = "login") => {
  if (level === "login") {
    return (req, res, next) => {
      if (res.locals.user) return next();
      res.status(401).json({ error: "Unauthorized" });
    };
  } else if (level === "whitelist") {
    return (req, res, next) => {
      if (res.locals.user?.whitelisted) return next();
      res.status(403).json({ error: "Forbidden" });
    };
  } else if (level === "admin") {
    return (req, res, next) => {
      if (res.locals.user?.admin) return next();
      res.status(403).json({ error: "Forbidden" });
    };
  } else if (level === "logout") {
    return (req, res, next) => {
      if (res.locals.user) res.status(403).json({ error: "Forbidden" });
      next();
    };
  }
};
