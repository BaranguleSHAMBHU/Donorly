import express from "express";
import { getInventory, updateInventory } from "../controllers/inventoryController.js";
import { protect } from "../middleware/authMiddleware.js"; // ⚠️ Ensure this supports Orgs too (see note below)

const router = express.Router();

router.get("/", protect, getInventory);
router.put("/", protect, updateInventory);

export default router;