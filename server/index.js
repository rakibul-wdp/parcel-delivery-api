require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();

require("./db/conn");
const indexRouter = require("./router/index");
const userRouter = require("./router/user");

const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/", indexRouter);
app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server Running at Port ${PORT}`);
});
