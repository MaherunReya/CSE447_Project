import { Router } from "express";
import { register, login, verify2FA, logout } from "../controllers/authController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-2fa", verify2FA);
router.post("/logout", logout);

export default router;
