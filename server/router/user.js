const express = require("express");
const router = express.Router();
const {
    createUser,
    getUsers,
    updateUser,
    deleteUser,
    sendMail,
} = require("../controllers/user");

router.route("/").get(getUsers);
router.route("/").post(createUser);
router.route("/send-mail").post(sendMail);
router.route("/").put(updateUser);
router.route("/").delete(deleteUser);

module.exports = router;
