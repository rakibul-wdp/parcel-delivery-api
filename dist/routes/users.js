"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = require("../models/User");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get user profile
router.get("/profile", auth_1.authenticate, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const user = await User_1.User.findById(req.user._id).select("-password");
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
// Get all users (Admin only)
router.get("/", auth_1.authenticate, (0, auth_1.authorize)("admin"), async (req, res) => {
    try {
        const users = await User_1.User.find().select("-password");
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
// Block/unblock user (Admin only)
router.patch("/:id/block", auth_1.authenticate, (0, auth_1.authorize)("admin"), async (req, res) => {
    try {
        const user = await User_1.User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.isBlocked = !user.isBlocked;
        await user.save();
        res.json({
            message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map