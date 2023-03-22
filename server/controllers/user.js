const asyncHandler = require("../middlewares/asyncHandler");
require("../db/conn");
const User = require("../model/userSchema");
const { sendMail } = require("../utils/mail");
const { getMailTable } = require("../utils/common");

exports.createUser = asyncHandler(async (req, res, next) => {
  try {
    const user = new User(req.body);
    const regUser = await user.save();
    res.status(201).json({
      success: true,
      data: regUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

exports.getUsers = asyncHandler(async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  try {
    if (req.query.id) {
      let id = req.query.id;
      let updateData = req.body;
      delete updateData._id;
      delete updateData.createdAt;
      delete updateData.updatedAt;
      delete updateData.__v;
      const user = await User.findByIdAndUpdate(req.query.id, updateData, {
        new: true,
        runValidators: true,
      });
      res.status(200).json({
        success: true,
        data: user,
      });
    } else {
      throw new Error("id not found in query");
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  try {
    if (req.query.id) {
      let id;
      if (req.query.bulk === "true") {
        id = JSON.parse(req.query.id);
      } else {
        id = [req.query.id];
      }
      console.log(id);

      const user = await User.deleteMany({ _id: { $in: id } });
      res.status(200).json({
        success: true,
        data: user,
      });
    } else {
      throw new Error("id not found in query");
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

exports.sendMail = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  id = req.body.id;
  if (id) {
    const users = await User.find({
      _id: {
        $in: id,
      },
    });
    const mailOptions = {
      from: "User Management",
      to: process.env.RECEPIENT_EMAIL,
      subject: "User Details",
      html: getMailTable(users),
    };
    sendMail(mailOptions);
    res.status(200).json({
      success: true,
      data: req.body,
    });
  } else {
    res.status(500).json({
      success: false,
      error: "id not found in body",
    });
  }
});
