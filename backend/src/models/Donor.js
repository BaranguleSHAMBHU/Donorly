import mongoose from "mongoose";

const donorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
      default: null, // Google users may not provide this
    },

    dob: {
      type: Date,
      default: null,
    },

    bloodGroup: {
      type: String,
      default: null,
    },

    gender: {
  type: String,
  enum: ["Male", "Female", "Other"],
  default: null,
},
address: {
  type: String,
  default: null,
},
city: {
  type: String,
  default: null,
},
pincode: {
  type: String,
  default: null,
},


    password: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
    },

    googleId: {
      type: String,
      default: null,
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Donor", donorSchema);
