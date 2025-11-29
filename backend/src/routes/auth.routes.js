import express from "express";
import {
  register,
  login,
  getMe,
  logout,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  validate,
  registerSchema,
  loginSchema,
} from "../middleware/validator.js";

const router = express.Router();

// Public routes
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

// Protected routes
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);
router.get("/debug-token", protect, (req, res) => {
  res.json({
    success: true,
    user: req.user,
    message: "Token is valid",
  });
});
export default router;
