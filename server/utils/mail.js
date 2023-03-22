const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendMail = (data) => {
  transporter.sendMail(data, (error, info) => {
    if (error) {
      console.log(error.message);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
