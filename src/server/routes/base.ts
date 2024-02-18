import express from "express";
import { getConfig } from "../utils/getConfig";

const router = express.Router();

router.get("/meta", (_req, res) => {
  res.json(getConfig().meta);
});

export default router;
