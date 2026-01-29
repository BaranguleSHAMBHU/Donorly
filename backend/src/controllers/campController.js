import Camp from '../models/Camp.js';
import Donation from '../models/Donation.js';
import Donor from '../models/Donor.js';


// @desc    Create a new Camp
// @route   POST /api/camps
export const createCamp = async (req, res) => {
  try {
    // Check if req.user exists
    if (!req.user || !req.user._id) {
       return res.status(401).json({ message: "User authentication failed" });
    }

    const campData = {
      ...req.body,
      organizationId: req.user._id, 
      organizerName: req.body.organizerName || req.user.orgName 
    };

    const newCamp = await Camp.create(campData);
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

// @desc    Register a Donor for a Camp
// @route   POST /api/camps/:id/register
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

// @desc    Get Single Camp Details (with Donor List & Status)
// @route   GET /api/camps/:id
export const getCampDetails = async (req, res) => {
  try {
    // 1. Fetch the Camp
    const camp = await Camp.findById(req.params.id)
      .populate('registeredDonors', 'fullName bloodGroup phone email')
      .populate('organizationId', 'orgName');

    if (!camp) {
      return res.status(404).json({ message: "Camp not found" });
    }

    // 2. Fetch all Donations (The Ledger)
    const donations = await Donation.find({ campId: camp._id });

    // 3. Create a Map for fast lookup: DonorID -> DonationID
    const donationMap = new Map();
    donations.forEach(d => {
        donationMap.set(d.donorId.toString(), d._id);
    });

    // 4. Map through registered donors and add status + donationId
    const donorsWithStatus = camp.registeredDonors.map(donor => {
        const donorObj = donor.toObject();
        
        const donorIdStr = donor._id.toString();

        if (donationMap.has(donorIdStr)) {
            donorObj.status = 'Donated';
            donorObj.donationId = donationMap.get(donorIdStr); // ✅ SEND THIS ID
        } else {
            donorObj.status = 'Registered';
        }
        
        return donorObj;
    });

    // 5. Send response
    const campData = camp.toObject();
    campData.registeredDonors = donorsWithStatus;

    res.json(campData);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Mark Donor as Donated (Check In)
// @route   PUT /api/camps/:campId/checkin
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

    res.json({ message: "Donor checked in & donation recorded!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};