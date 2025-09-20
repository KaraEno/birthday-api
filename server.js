const express = require("express");
const { connectDB } = require("./config/db");
const userController = require("./controllers/user");
require("./jobs/birthdayScheduler");
const cors = require("cors");
require("dotenv").config();

const app = express();

connectDB();

const PORT = process.env.PORT || 1000;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Home page is running" });
});
app.post("/", userController.createUser);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
