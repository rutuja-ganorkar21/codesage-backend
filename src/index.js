const express = require("express");
const app = express();
require("dotenv").config();
const main = require("./config/db");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/userAuth");
const redisClient = require("./config/redis");
const problemRouter = require("./routes/ProblemCreater");
const submitRouter = require("./routes/submit");
const aiRouter = require("./routes/aiChatting");
const cors = require("cors");
const vedioRouter = require("./routes/vedioCreator");

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);
app.use("/ai", aiRouter);
app.use("/video", vedioRouter);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

const InitializeConnection = async () => {
  try {
    await main();

    try {
      await redisClient.connect();
      console.log("Redis connected ");

      redisClient.on("error", (err) => {
        console.error("Redis Client Error:", err.message);
      });
    } catch (err) {
      console.error("Redis connection failed:", err.message);
    }

    console.log("DB connected");

    app.listen(process.env.PORT, () => {
      console.log("Server listening at port number: " + process.env.PORT);
    });
  } catch (err) {
    console.error("Error: " + err);
  }
};

InitializeConnection();
