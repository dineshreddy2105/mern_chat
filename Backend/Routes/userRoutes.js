const express = require("express");
const router = express.Router();
const protect = require("../Middlewares/authMiddleware");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../Controllers/userController");
router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authUser);
module.exports = router;
