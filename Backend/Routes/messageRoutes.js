// messageRoutes.js

const express = require("express");
const router = express.Router();
const protect = require("../Middlewares/authMiddleware");
const {
  sendMessage,
  allMessages,
} = require("../Controllers/messageController");
router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);

module.exports = router;
