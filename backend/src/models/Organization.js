import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const OrganizationSchema = new mongoose.Schema(
  {
    orgName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    orgType: { type: String, required: true }, // Hospital, NGO, etc.
    licenseNumber: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "organization" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: "partners", // stays exactly as you intended
  }
);

// Encrypt password before saving
OrganizationSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
OrganizationSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Organization = mongoose.model("Organization", OrganizationSchema);

export default Organization;
