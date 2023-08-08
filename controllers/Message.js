const { Chat } = require("../models/Chat");
const { Message } = require("../models/Message");
const { User } = require("../models/User");
exports.fetchMessage = async (req, res) => {
  try {
    const message = await Message.find({ chat: req.params.chatId })
      .populate("sender", "-password")
      .populate("chat");
    res.status(200).json(message);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.sendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    return res.sendStatus(400);
  }
  try {
    const newMessage = {
      sender: req.user.id,
      content: content,
      chat: chatId,
    };
    let message = new Message(newMessage);
    message = await message.save();
    message = await message.populate("sender", "name profilePic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name profilePic email",
    });
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
    res.status(201).json(message);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
