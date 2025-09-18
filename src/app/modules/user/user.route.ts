import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { authenticate, authorize } from "../../middlewares/auth";
import { UserController } from "./user.controller";
import {
  createUserValidation,
  loginValidation,
  updateUserValidation,
} from "./user.validation";
import { UserRole } from "./user.interface";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserValidation),
  UserController.createUser
);
router.post(
  "/login",
  validateRequest(loginValidation),
  UserController.loginUser
);

router.get("/profile", authenticate, UserController.getProfile);
router.get(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  UserController.getAllUsers
);
router.get(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  UserController.getSingleUser
);
router.patch(
  "/:id",
  authenticate,
  validateRequest(updateUserValidation),
  UserController.updateUser
);

export const UserRoutes = router;
