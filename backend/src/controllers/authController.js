import Donor from "../models/Donor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Donation from '../models/Donation.js';

/**
 * Generate JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

/**
 * @desc    Register new donor (AUTO LOGIN)
 * @route   POST /api/auth/register
 */
export const registerDonor = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      dob,
      bloodGroup,
      password,
    } = req.body;

    // Check if donor already exists
    const existingDonor = await Donor.findOne({ email });
    if (existingDonor) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create donor
    const donor = await Donor.create({
      fullName,
      email,
      phone,
      dob,
      bloodGroup,
      password: hashedPassword,
    });

    // 🔥 AUTO LOGIN TOKEN
    const token = generateToken(donor._id);

    res.status(201).json({
      message: "Registration successful",
      token,
      donor: {
        id: donor._id,
        fullName: donor.fullName,
        email: donor.email,
        bloodGroup: donor.bloodGroup,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Login donor
 * @route   POST /api/auth/login
 */
export const loginDonor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find donor by email
    const donor = await Donor.findOne({ email });
    if (!donor) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, donor.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 🔐 Generate token
    const token = generateToken(donor._id);

    res.status(200).json({
      message: "Login successful",
      token,
      donor: {
        id: donor._id,
        fullName: donor.fullName,
        email: donor.email,
        bloodGroup: donor.bloodGroup,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
/**
 * @desc    Get logged-in donor profile
 * @route   GET /api/auth/me
 */
export const getMe = async (req, res) => {
  try {
    const donor = await Donor.findById(req.user.id).select("-password");
    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }
    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Update donor profile
 * @route   PUT /api/auth/profile
 */
export const updateProfile = async (req, res) => {
  try {
    const { fullName, phone, dob, gender, address, city, pincode } = req.body;

    const donor = await Donor.findById(req.user.id);
    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    // Editable fields only
    donor.fullName = fullName ?? donor.fullName;
    donor.phone = phone ?? donor.phone;
    donor.dob = dob ?? donor.dob;
    donor.gender = gender ?? donor.gender;
    donor.address = address ?? donor.address;
    donor.city = city ?? donor.city;
    donor.pincode = pincode ?? donor.pincode;

    const updatedDonor = await donor.save();
    res.json(updatedDonor);
  } catch (error) {
    res.status(500).json({ message: "Profile update failed" });
  }
};
// @desc    Get Donor Statistics
// @route   GET /api/auth/stats
export const getDonorStats = async (req, res) => {
  try {
    // 1. Find completed donations for this donor
    const donations = await Donation.find({ donorId: req.user.id })
      .sort({ date: -1 }) // Newest first
      .populate('campId', 'campName location date'); // Get camp details

    const totalDonations = donations.length;
    const livesSaved = totalDonations * 3; 

    // 2. Calculate Eligibility based on LAST ACTUAL DONATION
    const lastDonationDate = donations.length > 0 ? donations[0].date : null;
    
    let nextEligibleDate = null;
    if (lastDonationDate) {
      const last = new Date(lastDonationDate);
      last.setDate(last.getDate() + 90); // Add 90 days rule
      nextEligibleDate = last;
    } else {
      nextEligibleDate = new Date(); // Eligible now
    }

    // 3. Get Recent Activity (Mix of completed donations and upcoming camps)
    // For simplicity, let's just show completed donations here
    const recentActivity = donations.slice(0, 3).map(d => ({
        _id: d._id,
        campName: d.campId ? d.campId.campName : "Unknown Camp",
        date: d.date,
        status: "Completed"
    }));

    res.json({
      totalDonations,
      livesSaved,
      lastDonationDate,
      nextEligibleDate,
      recentActivity
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error fetching stats" });
  }
};