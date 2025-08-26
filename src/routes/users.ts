import express from "express";
import { User } from "../models/User";
import { authenticate, authorize } from "../middleware/auth";

const router = express.Router();

// Get user profile
router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get all users (Admin only)
router.get("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Block/unblock user (Admin only)
router.patch(
  "/:id/block",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.isBlocked = !user.isBlocked;
      await user.save();

      res.json({
        message: `User ${
          user.isBlocked ? "blocked" : "unblocked"
        } successfully`,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

export default router;
