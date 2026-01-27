import Camp from "../models/Camp.js";

// @desc    Create a new Camp
// @route   POST /api/camps
export const createCamp = async (req, res) => {
  try {
    console.log("🔹 4. Inside Controller. User:", req.user); // DEBUG LOG

    // Check if req.user exists
    if (!req.user || !req.user._id) {
       console.log("❌ User ID missing in request");
       return res.status(401).json({ message: "User authentication failed" });
    }

    const campData = {
      ...req.body,
      organizationId: req.user._id, // This is what we are watching!
      organizerName: req.body.organizerName || req.user.orgName 
    };

    console.log("🔹 5. Saving Camp Data:", campData); // DEBUG LOG

    const newCamp = await Camp.create(campData);

    console.log("✅ 6. Camp Created Successfully:", newCamp);
    res.status(201).json(newCamp);
  } catch (error) {
    console.error("❌ Error creating camp:", error);
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
/**
 * @desc    Get Single Camp Details (with Donor List)
 * @route   GET /api/camps/:id
 */
export const getCampDetails = async (req, res) => {
  try {
    const camp = await Camp.findById(req.params.id)
      .populate('registeredDonors', 'fullName bloodGroup phone email dob') // 👈 Get these fields from Donor
      .populate('organizationId', 'orgName');

    if (!camp) {
      return res.status(404).json({ message: "Camp not found" });
    }

    res.json(camp);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};