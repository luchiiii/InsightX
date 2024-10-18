const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const feedbackRouter = require("./routes/feedbackRoutes");
const app = express();

//global middleware configuration for json data
app.use(express.json());

// Use CORS to allow requests from your frontend
app.use(
  cors({
    origin: ["http://localhost:3000", "https://insightx.vercel.app"], // Allow only your front-end to access
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods if necessary
    credentials: true, // If you're sending cookies or authorization headers
  })
);

//global middleware configuration for cookie parser
app.use(cookieParser());

//global middleware for routes config
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/feedback", feedbackRouter);

//server health check
app.get("/", (req, res) => {
  res.json({ message: "Server is Live" });
});

module.exports = app;
