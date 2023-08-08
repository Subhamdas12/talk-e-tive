const express = require("express");
const { fetchAllUsers, fetchCurrentUser } = require("../controllers/User");
const router = express.Router();
router
  .get("/fetchAllUsers", fetchAllUsers)
  .get("/fetchCurrentUsers", fetchCurrentUser);
exports.router = router;
