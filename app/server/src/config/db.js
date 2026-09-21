const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log({
        message: "Database Connected Successfully",
        status: "SUCCESS",
      });
    });
  } catch (error) {
    console.log({
      errorType: "DB Connection Error",
      errorMessage: error.message,
      status: "FAILURE",
    });
  }
};

module.exports = connectDB;
