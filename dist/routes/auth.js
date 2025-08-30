"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const validation_1 = require("../middleware/validation");
const zod_1 = require("zod");
const env_1 = require("../config/env");
const router = express_1.default.Router();
const registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2),
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(6),
        phone: zod_1.z.string().min(10),
        address: zod_1.z.string().min(5),
        role: zod_1.z.enum(["admin", "sender", "receiver"]).optional(),
    }),
});
const loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(6),
    }),
});
// Register
router.post("/register", (0, validation_1.validate)(registerSchema), async (req, res) => {
    try {
        const { name, email, password, phone, address, role } = req.body;
        // Check if user exists
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Create user
        const user = new User_1.User({
            name,
            email,
            password,
            phone,
            address,
            role: role || "sender",
        });
        await user.save();
        const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, env_1.env.JWT_SECRET, {
            expiresIn: env_1.env.JWT_EXPIRES_IN || "7d",
        });
        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
// Login
router.post("/login", (0, validation_1.validate)(loginSchema), async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user
        const user = await User_1.User.findOne({ email });
        if (!user || user.isBlocked) {
            return res
                .status(400)
                .json({ message: "Invalid credentials or account blocked" });
        }
        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // Generate token
        const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, env_1.env.JWT_SECRET, {
            expiresIn: env_1.env.JWT_EXPIRES_IN || "7d",
        });
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map