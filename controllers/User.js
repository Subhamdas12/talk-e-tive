const { User } = require("../models/User");

exports.fetchAllUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search } },
          { email: { $regex: req.query.search } },
        ],
      }
    : {};
  const users = await User.find(keyword, {
    name: 1,
    profilePic: 1,
  }).find({ _id: { $ne: req.user.id } });
  res.status(200).json(users);
};

exports.fetchCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
