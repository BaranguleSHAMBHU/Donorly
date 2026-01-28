import express from 'express';
import { sendCampAlert, getMyNotifications, markAsRead } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Org sends alert (Needs Org Token)
router.post('/send-camp-alert', protect, sendCampAlert);

// Donor checks notifications (Needs Donor Token)
router.get('/', protect, getMyNotifications);
router.put('/:id/read', protect, markAsRead);

export default router;