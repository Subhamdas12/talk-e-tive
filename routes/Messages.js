const express = require("express");
const { fetchMessage, sendMessage } = require("../controllers/Message");
const router = express.Router();
router
  .get("/fetchMessage/:chatId", fetchMessage)
  .post("/sendMessage", sendMessage);
exports.router = router;
