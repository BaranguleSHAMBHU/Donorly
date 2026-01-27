import express from "express";
import { createCamp, getCamps, registerForCamp, getCampDetails } from "../controllers/campController.js";
import { generateCertificate } from '../controllers/certificateController.js';
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/camps
router.get("/", getCamps);
// POST /api/camps
router.post('/', protect, createCamp);

router.get('/:id', getCampDetails);


router.post('/:id/register', protect, registerForCamp);
router.get('/:campId/certificate/:donorId', generateCertificate);
export default router;
