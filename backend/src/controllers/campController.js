import Camp from "../models/Camp.js";
import Donation from '../models/Donation.js';
import Donor from '../models/Donor.js';
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
 * @desc    Get Single Camp Details (with Donor List & Status)
 * @route   GET /api/camps/:id
 */
export const getCampDetails = async (req, res) => {
  try {
    // 1. Fetch the Camp and populate donor details
    const camp = await Camp.findById(req.params.id)
      .populate('registeredDonors', 'fullName bloodGroup phone email')
      .populate('organizationId', 'orgName');

    if (!camp) {
      return res.status(404).json({ message: "Camp not found" });
    }

    // 2. Fetch all Donations for this specific camp
    // This acts as our "Attendance Sheet"
    const donations = await Donation.find({ campId: camp._id });
    
    // Create a Set of IDs for fast lookup (O(1) complexity)
    const donatedDonorIds = new Set(donations.map(d => d.donorId.toString()));

    // 3. Map through registered donors and check their status
    const donorsWithStatus = camp.registeredDonors.map(donor => {
        // Convert Mongoose object to plain JS object so we can add 'status'
        const donorObj = donor.toObject(); 
        
        // Check if this donor exists in the donations list
        donorObj.status = donatedDonorIds.has(donor._id.toString()) ? 'Donated' : 'Registered';
        
        return donorObj;
    });

    // 4. Construct response
    const campData = camp.toObject();
    campData.registeredDonors = donorsWithStatus;

    res.json(campData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
/**
 * @desc    Mark Donor as Donated (Check In)
 * @route   PUT /api/camps/:campId/checkin
 */
export const updateDonorStatus = async (req, res) => {
  const { donorId } = req.body; 

  try {
    const camp = await Camp.findById(req.params.id);
    const donor = await Donor.findById(donorId);

    if (!camp || !donor) {
      return res.status(404).json({ message: "Camp or Donor not found" });
    }

    // 1. Check if already marked as donated to prevent duplicates
    const existingDonation = await Donation.findOne({ 
      donorId: donor._id, 
      campId: camp._id 
    });

    if (existingDonation) {
      return res.status(400).json({ message: "Donor already checked in!" });
    }

    // 2. Create the Donation Record (The "Receipt")
    await Donation.create({
      donorId: donor._id,
      campId: camp._id,
      bloodGroup: donor.bloodGroup,
      date: new Date()
    });

    // 3. (Optional) Update Camp "registeredDonors" status if you change the schema later.
    // For now, the existence of a 'Donation' record proves they donated.

    res.json({ message: "Donor checked in & donation recorded!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};