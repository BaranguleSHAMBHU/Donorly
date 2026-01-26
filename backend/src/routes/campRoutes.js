import express from "express";
import { createCamp, getCamps } from "../controllers/campController.js";

const router = express.Router();

// POST /api/camps
router.post("/", createCamp);

// GET /api/camps
router.get("/", getCamps);
router.post('/:id/register', protect, registerForCamp);
export default router;
