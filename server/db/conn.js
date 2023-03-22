require("dotenv").config();
const mongoose = require("mongoose");
// Mongo atlas connection
mongoose
  .connect(process.env.DB_CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Atlas connection success");
  })
  .catch((err) => {
    console.log("Atlas connection error: ", err);
  });
