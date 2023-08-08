const express = require("express");
const {
  createUser,
  loginUser,
  checkUser,
  logoutUser,
} = require("../controllers/Auth");
const upload = require("../index");
const passport = require("passport");

const router = express.Router();
router
  .post("/login", passport.authenticate("local"), loginUser)
  .get("/check", passport.authenticate("jwt"), checkUser)
  .get("/logout", logoutUser);
exports.router = router;
