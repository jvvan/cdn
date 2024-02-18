declare module "express-session" {
  interface SessionData {
    discord: {
      id: string;
      username: string;
    };
    redirect: string;
  }
}

import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import mongoose from "mongoose";
import { getConfig } from "./utils/getConfig.js";
import { rateLimit } from "./utils/ratelimit.js";

import baseRouter from "./routes/base.js";
import authRouter from "./routes/auth.js";
import filesRouter from "./routes/files.js";
import usersRouter from "./routes/users.js";
import indexRouter from "./routes/index.js";
import { addUser } from "./middlewares/addUser.js";
import { NextFunction } from "express-serve-static-core";
import ViteExpress from "vite-express";

const config = getConfig();
const app = express();
app.set("trust proxy", 1);

app.use(express.static(import.meta.dirname + "/../frontend/dist/"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(config.session.secret));
app.use(session(config.session));

app.use(addUser);
app.use("/api", rateLimit(90000, 120));
app.use("/api", baseRouter);
app.use("/api/auth", authRouter);
app.use("/api/files", filesRouter);
app.use("/api/users", usersRouter);
app.use("/", indexRouter);
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Route Not Found" });
});
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  if (!res.headersSent) {
    res.status(500).json({ error });
  }
});

const main = async () => {
  await mongoose
    .connect(config.mongo, {
      autoIndex: true,
    })
    .then(() => {
      console.log("Connected to database!");
    })
    .catch((e) => {
      console.log("Couldn't connect to database!");
      console.error(e);
      process.exit(1);
    });
  ViteExpress.listen(app, config.port, () =>
    console.log(`Listening on ${config.port}!`),
  );
};

main();
