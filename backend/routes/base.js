const express = require("express");
const config = require("../../config");
const router = express.Router();

router.get("/meta", (req, res) => {
  res.json(config.meta);
});

module.exports = router;
