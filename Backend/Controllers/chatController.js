const asyncHandler = require("express-async-handler");
const Chat = require("../Models/chatModel");
const User = require("../Models/UserModel");
const { stringify } = require("flatted");
const accessChat = asyncHandler(async (req, res) => {
  const { userID } = req.body;
  console.log(userID);
  if (!userID) {
    console.log("UserId param did not match");
    return res.sendStatus(400);
  }
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userID } } },
    ],
  })
    .populate("Users", "-password")
    .populate("latestMessage");
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      Users: [req.user._id, userID],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "Users",
        "-password"
      );
      res.status(200).send(fullChat);
    } catch (error) {
      throw new Error(error.message);
    }
  }
});
const fetchChats = asyncHandler(async (req, res) => {
  try {
    const chats = await Chat.find({
      Users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("Users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    const populatedChats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    res.status(200).send(populatedChats);
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: error.message });
  }
});
const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.Users || !req.body.name) {
    return res.status(400).send({ message: "Please fill all the details" });
  }
  var Users = JSON.parse(req.body.Users);
  if (Users.length < 2) {
    return res.status(400).send("More than two users required to form a Group");
  }
  Users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      Users: Users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("Users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate("Users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.send(updatedChat); // Use stringify from flatted to serialize
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { Users: userId },
    },
    {
      new: true,
    }
  )
    .populate("Users", "-password")
    .populate("groupAdmin", "-password");
  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { Users: userId },
    },
    {
      new: true,
    }
  )
    .populate("Users", "-password")
    .populate("groupAdmin", "-password");
  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});
module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
