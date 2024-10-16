const mongoose = require("mongoose");

//connect to mongodb database
const connectDb = async () => {
  await mongoose
    .connect("mongodb://localhost:27017/InsightX")
    .then(() => console.log("database connected"))
    .catch((error) => console.log(error));
};

module.exports = connectDb;
