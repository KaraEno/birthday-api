const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URL = process.env.MONGODB_URL;
const connectDB = () => {
  try {
    mongoose.connect(MONGO_URL);
    mongoose.connection.on("connected", () =>
      console.log("DB connected successfully")
    );
    mongoose.connection.on("error", (err) =>
      console.log("Error connecting DB", err)
    );
  } catch (err) {
    console.log("connection fail", err);
    process.exit(1);
  }
};

module.exports = { connectDB };
