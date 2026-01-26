import mongoose from "mongoose";

const CampSchema = new mongoose.Schema({
  campName: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  targetDonors: { type: Number },
  description: { type: String },
  organizerName: { type: String },

  // TEMPORARILY optional (until auth middleware is added)
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: false,
  },

  createdAt: { type: Date, default: Date.now },
  registeredDonors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor'
  }],
  createdAt: { type: Date, default: Date.now }
});


const Camp = mongoose.model("Camp", CampSchema);

export default Camp;
