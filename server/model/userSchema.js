const mongoose = require("mongoose");
const validate = require("mongoose-validator");

const validator = {
  nameValidator: [
    validate({
      validator: "isLength",
      arguments: [3, 50],
      message: "Name should be between {ARGS[0]} and {ARGS[1]} characters",
    }),
  ],
  emailValidator: [
    validate({
      validator: "isEmail",
      message: "Email is not valid",
    }),
    validate({
      validator: "isLength",
      arguments: [3, 50],
      message: "Email should be between {ARGS[0]} and {ARGS[1]} characters",
    }),
  ],
  phoneValidator: [
    validate({
      validator: "isLength",
      arguments: [10, 10],
      message: "Phone number should be 10 digits",
    }),
    validate({
      validator: "isNumeric",
      message: "Phone number should contain digits only",
    }),
  ],
  hobbiesValidator: [
    validate({
      validator: (value) => value.length > 0,
      message: "Hobbies should be an array of at least one element",
    }),
  ],
};

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      validate: validator.nameValidator,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      validate: validator.phoneValidator,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
      validate: validator.emailValidator,
    },
    hobbies: {
      type: [String],
      required: true,
      validate: validator.hobbiesValidator,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  console.log("2:");
  if (this.isModified("hobbies")) {
    const hobbies = new Set(this.hobbies);
    this.hobbies = Array.from(hobbies);
  }
  next();
});

userSchema.pre("findOneAndUpdate", function (next) {
  const hobbies = new Set(this.getUpdate().hobbies);
  this.setUpdate({ hobbies: Array.from(hobbies) });
  next();
});

userSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    next(new Error("User already exists with either email or phone number"));
  } else {
    next(error);
  }
});

const User = mongoose.model("USER", userSchema);

module.exports = User;
