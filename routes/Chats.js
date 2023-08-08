const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroup,
  renameGroup,
  removeFromGroup,
  addToGroup,
} = require("../controllers/Chat");
const router = express.Router();
router
  .get("/fetchChats", fetchChats)
  .post("/accessChat", accessChat)
  .post("/createGroup", createGroup)
  .patch("/removeFromGroup", removeFromGroup)
  .patch("/renameGroup", renameGroup)
  .patch("/addToGroup", addToGroup);
exports.router = router;
