import Camp from "../models/Camp.js";

// @desc    Create a new Camp
// @route   POST /api/camps
export const createCamp = async (req, res) => {
  try {
    const newCamp = await Camp.create({
      ...req.body,
      // organizationId will be added later via auth middleware
    });

    res.status(201).json(newCamp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all camps
// @route   GET /api/camps
export const getCamps = async (req, res) => {
  try {
    const camps = await Camp.find().sort({ date: 1 });
    res.status(200).json(camps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/**
 * @desc    Register a Donor for a Camp
 * @route   POST /api/camps/:id/register
 */
export const registerForCamp = async (req, res) => {
  try {
    const campId = req.params.id;
    const donorId = req.user.id; // Comes from protect middleware

    const camp = await Camp.findById(campId);
    if (!camp) {
      return res.status(404).json({ message: "Camp not found" });
    }

    // Check if already registered
    if (camp.registeredDonors.includes(donorId)) {
      return res.status(400).json({ message: "You are already registered for this camp" });
    }

    // Add donor to list
    camp.registeredDonors.push(donorId);
    await camp.save();

    res.json({ message: "Registration successful", campId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
