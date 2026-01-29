import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor',
    required: true
  },
  campId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Camp',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  bloodGroup: {
    type: String,
    required: true
  },
  units: {
    type: Number,
    default: 1
  },
  medicalReport: {
    type: String, // URL/Path to the file
    default: null
  },
  reportUploadedAt: {
    type: Date
  },
  certificateIssued: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('Donation', donationSchema);