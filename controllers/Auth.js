require("dotenv").config();
const { User } = require("../models/User");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { sanitizeUser } = require("../services/Common");
exports.createUser = async (req, res) => {
  const userPresent = await User.findOne({ email: req.body.email });
  if (userPresent) {
    res.status(403).json({ message: "User already exists" });
  } else {
    try {
      const salt = crypto.randomBytes(16);
      crypto.pbkdf2(
        req.body.password,
        salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          const user = new User({
            ...req.body,
            profilePic: req.file && req.file.filename,
            password: hashedPassword,
            salt,
          });

          const doc = await user.save();
          req.login(user, function (err) {
            if (err) {
              res.status(400).json(err);
              console.log(err);
            } else {
              const token = jwt.sign(
                sanitizeUser(doc),
                process.env.JWT_SECRET_KEY
              );
              res
                .cookie("jwt", token, {
                  expires: new Date(Date.now() + 3600000),
                  httpOnly: true,
                })
                .status(201)
                .json({ id: doc.id });
            }
          });
        }
      );
    } catch (err) {
      res.status(400).json(err);
      console.log(err);
    }
  }
};

exports.loginUser = async (req, res) => {
  res
    .cookie("jwt", req.user.token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    })
    .status(201)
    .json({ id: req.user.id });
};

exports.checkUser = async (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.sendStatus(401);
  }
};
exports.logoutUser = async (req, res) => {
  res
    .cookie("jwt", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .sendStatus(201);
};
