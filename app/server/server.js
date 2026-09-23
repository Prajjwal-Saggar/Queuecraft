const dotenv = require("dotenv");
dotenv.config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT;

connectDB();
const startServer = () => {
  try {
    app.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
      if (err) {
        throw new Error(err);
      }
      console.log(`Server Running on Port: ${PORT} and Address: ${address}`);
    });
  } catch (error) {
    console.log({
      errorType: "Server Initialization Error",
      errorMessage: error.message,
      status: "FAILURE",
    });
    process.exit(1);
  }
};

startServer();
