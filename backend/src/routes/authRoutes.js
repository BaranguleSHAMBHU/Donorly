import express from "express";
import { registerDonor, loginDonor, getMe, updateProfile, getDonorStats, getMyDonations } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js"; // This import will now work correctly

const router = express.Router();

router.post("/register", registerDonor);
router.post("/login", loginDonor);

// Protected Routes
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.get('/stats', protect, getDonorStats);
router.get('/donations', protect, getMyDonations);
export default router;