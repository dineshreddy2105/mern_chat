const asyncHandler = require("express-async-handler");
const User = require("../Models/UserModel");
const generateToken = require("../Config/generateToken");
const express = require("express");
const app = express();
app.use(express.json());
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  console.log(name, email, password);
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Fields");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User Already Exists");
  }
  const user = await User.create({ name, email, password, pic });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create the user");
  }
});
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid Credentials or Password");
  }
});
const allUsers = asyncHandler(async (req, res) => {
  console.log("hello");
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    console.log(keyword);
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

    // Log the results for debugging
    console.log("Search Results:", users);

    res.json(users); // Send response as JSON
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server Error" }); // Send error response
  }
});
module.exports = { registerUser, authUser, allUsers };
