"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const validateRequest_1 = require("../../middlewares/validateRequest");
const auth_1 = require("../../middlewares/auth");
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const user_interface_1 = require("./user.interface");
const router = (0, express_1.Router)();
router.post("/register", (0, validateRequest_1.validateRequest)(user_validation_1.createUserValidation), user_controller_1.UserController.createUser);
router.post("/login", (0, validateRequest_1.validateRequest)(user_validation_1.loginValidation), user_controller_1.UserController.loginUser);
router.get("/profile", auth_1.authenticate, user_controller_1.UserController.getProfile);
router.get("/", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.ADMIN), user_controller_1.UserController.getAllUsers);
router.get("/:id", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.ADMIN), user_controller_1.UserController.getSingleUser);
router.patch("/:id", auth_1.authenticate, (0, validateRequest_1.validateRequest)(user_validation_1.updateUserValidation), user_controller_1.UserController.updateUser);
exports.UserRoutes = router;
//# sourceMappingURL=user.route.js.map