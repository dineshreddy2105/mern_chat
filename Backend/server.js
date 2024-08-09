const express = require("express");
const app = express();
const cors = require("cors");
const { chats } = require("./data/data");
const connectDB = require("./Config/db");
const colors = require("colors");
require("dotenv").config();
const userRoutes = require("./Routes/userRoutes");
const { notFound, errorHandler } = require("./Middlewares/ErrorMiddleware");
const chatRoutes = require("./Routes/chatRoutes");
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
connectDB();
app.get("/", (req, res) => {
  console.log("API runnning successfully");
});
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`listening at port ${PORT}`.yellow.bold);
});
