const { Chat } = require("../models/Chat");
const { User } = require("../models/User");

exports.accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.sendStatus(400);
  }
  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      {
        users: { $elemMatch: { $eq: req.user.id } },
        users: { $elemMatch: { $eq: userId } },
      },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  // isChat = await User.populate(isChat, {
  //   path: "latestMessage.sender",
  //   select: "name profilePic email",
  // });
  let chatData = {};
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user.id, userId],
    };
    try {
      const createChat = new Chat(chatData);
      const doc = await createChat.save();
      const result = await doc.populate("users", "-password");
      res.status(201).json(result);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  }
};

exports.fetchChats = async (req, res) => {
  try {
    let chat = await Chat.find({ users: { $eq: req.user.id } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updateAt: -1 })
      .exec();
    chat = await User.populate(chat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });
    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.createGroup = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }
  let users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res
      .status(400)
      .json({ message: "More then 2 users are required to form a group chat" });
  }
  users.push(req.user.id);
  try {
    const groupChat = new Chat({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user.id,
    });
    const doc = await groupChat.save();
    const result = await Chat.findOne({ _id: groupChat.id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.renameGroup = async (req, res) => {
  const { id, chatName } = req.body;
  try {
    const chat = await Chat.findByIdAndUpdate(id, { chatName }, { new: true })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(202).json(chat);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.removeFromGroup = async (req, res) => {
  const { id, userId } = req.body;
  const chat = await Chat.findById(id);
  if (!chat.users.includes(userId)) {
    return res
      .status(400)
      .json({ message: "User already exists in the group" });
  }
  try {
    const removed = await Chat.findByIdAndUpdate(
      id,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(removed);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.addToGroup = async (req, res) => {
  const { id, userId } = req.body;
  const chat = await Chat.findById(id);
  if (chat.users.includes(userId)) {
    return res
      .status(400)
      .json({ message: "User already exists in the group" });
  }
  try {
    const added = await Chat.findByIdAndUpdate(
      id,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(added);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
