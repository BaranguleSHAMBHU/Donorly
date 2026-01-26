import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization", // Assumes you have an Organization model
      required: true,
      unique: true, // One inventory doc per organization
    },
    stock: [
      {
        bloodGroup: { type: String, required: true },
        units: { type: Number, default: 0 },
        status: { 
          type: String, 
          enum: ["Stable", "Low", "Critical", "High"], 
          default: "Stable" 
        }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Inventory", inventorySchema);