import Inventory from "../models/Inventory.js";

/**
 * @desc    Get Org Inventory
 * @route   GET /api/inventory
 */
export const getInventory = async (req, res) => {
  try {
    let inventory = await Inventory.findOne({ organization: req.user.id });

    // If no inventory exists yet, create a default one
    if (!inventory) {
      const defaultStock = [
        { bloodGroup: 'A+', units: 0, status: 'Critical' },
        { bloodGroup: 'A-', units: 0, status: 'Critical' },
        { bloodGroup: 'B+', units: 0, status: 'Critical' },
        { bloodGroup: 'B-', units: 0, status: 'Critical' },
        { bloodGroup: 'AB+', units: 0, status: 'Critical' },
        { bloodGroup: 'AB-', units: 0, status: 'Critical' },
        { bloodGroup: 'O+', units: 0, status: 'Critical' },
        { bloodGroup: 'O-', units: 0, status: 'Critical' },
      ];
      inventory = await Inventory.create({ 
        organization: req.user.id, 
        stock: defaultStock 
      });
    }

    res.json(inventory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * @desc    Update Inventory Unit Count
 * @route   PUT /api/inventory
 */
export const updateInventory = async (req, res) => {
  const { bloodGroup, quantity } = req.body;

  try {
    const inventory = await Inventory.findOne({ organization: req.user.id });

    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    // Find the specific blood group and update
    const stockItem = inventory.stock.find(item => item.bloodGroup === bloodGroup);
    
    if (stockItem) {
      stockItem.units = quantity;
      
      // Auto-calculate status
      if (stockItem.units < 5) stockItem.status = "Critical";
      else if (stockItem.units < 15) stockItem.status = "Low";
      else stockItem.status = "Stable";
    }

    await inventory.save();
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};