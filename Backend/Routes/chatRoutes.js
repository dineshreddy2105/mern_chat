const express = require("express");
const protect = require("../Middlewares/authMiddleware");
const router = express.Router();
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../Controllers/chatController");
router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/grouprename").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);
module.exports = router;
