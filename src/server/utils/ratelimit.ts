import expressRateLimit from "express-rate-limit";

export function rateLimit(ms: number, max: number) {
  return expressRateLimit({
    windowMs: ms,
    max,
    handler: (_, res) => {
      res.status(429).json({ error: "Rate Limit Reached" });
    },
  });
}
