import express from 'express';
import { createCamp, getCamps, registerForCamp, getCampDetails, updateDonorStatus } from '../controllers/campController.js';
import { generateCertificate } from '../controllers/certificateController.js';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path'; // 👈 THIS IMPORT WAS MISSING! 
import Donation from '../models/Donation.js';

const router = express.Router();

// --- 1. Multer Configuration (File Upload) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure 'backend/uploads' folder exists
  },
  filename: (req, file, cb) => {
    // Now 'path' is defined, so this line will work
    cb(null, `REPORT-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// --- 2. Routes ---

// Public Routes
router.get('/', getCamps);

// Protected Routes (Organization)
router.post('/', protect, createCamp);
router.get('/:id', getCampDetails);
router.post('/:id/register', protect, registerForCamp);
router.put('/:id/checkin', protect, updateDonorStatus);

// Certificate
router.get('/:campId/certificate/:donorId', generateCertificate);

// Medical Report Upload Route
router.post('/upload-report', protect, upload.single('report'), async (req, res) => {
  try {
    const { donationId } = req.body;
    
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Store relative path so frontend can access it
    const reportPath = `uploads/${req.file.filename}`;

    await Donation.findByIdAndUpdate(donationId, {
      medicalReport: reportPath,
      reportUploadedAt: new Date()
    });

    res.json({ message: "Report uploaded successfully!", path: reportPath });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;