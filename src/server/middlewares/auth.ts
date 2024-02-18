import { NextFunction, Request, Response } from "express";

export type AuthLevel = "login" | "whitelist" | "admin" | "logout";
export function auth(
  level: AuthLevel = "login",
): (res: Request, req: Response, next: NextFunction) => void {
  if (level === "login") {
    return (_req, res, next) => {
      if (res.locals.user) return next();
      res.status(401).json({ error: "Unauthorized" });
    };
  } else if (level === "whitelist") {
    return (_req, res, next) => {
      if (res.locals.user?.whitelisted) return next();
      res.status(403).json({ error: "Forbidden" });
    };
  } else if (level === "admin") {
    return (_req, res, next) => {
      if (res.locals.user?.admin) return next();
      res.status(403).json({ error: "Forbidden" });
    };
  } else if (level === "logout") {
    return (_req, res, next) => {
      if (res.locals.user) res.status(403).json({ error: "Forbidden" });
      next();
    };
  }

  throw new Error("Invalid Auth Level");
}
