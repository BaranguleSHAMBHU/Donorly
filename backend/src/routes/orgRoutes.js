import express from "express";
import { registerOrg, loginOrg } from "../controllers/orgController.js";

const router = express.Router();

// POST /api/org/register
router.post("/register", registerOrg);

// POST /api/org/auth/login
router.post("/auth/login", loginOrg);

export default router; // ✅ ES MODULE EXPORT
