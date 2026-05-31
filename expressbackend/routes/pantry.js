const express = require("express");
const router = express.Router();
const PantryItem = require("../models/PantryItem");
const ImpactLog = require("../models/ImpactLog");

// Helper function to estimate weight in Kilograms (kg) for eco metrics
const getWeightInKg = (quantity, unit) => {
  const normalizedUnit = unit.toLowerCase().trim();
  if (normalizedUnit === "kg" || normalizedUnit === "kilogram" || normalizedUnit === "kilograms") {
    return quantity;
  }
  if (normalizedUnit === "g" || normalizedUnit === "gram" || normalizedUnit === "grams") {
    return quantity / 1000;
  }
  if (normalizedUnit === "pcs" || normalizedUnit === "piece" || normalizedUnit === "pieces" || normalizedUnit === "count") {
    return quantity * 0.1; // Estimate 100g per piece
  }
  if (normalizedUnit === "l" || normalizedUnit === "liter" || normalizedUnit === "liters" || normalizedUnit === "litre" || normalizedUnit === "litres") {
    return quantity * 1.0; // Assume density of water (1L = 1kg)
  }
  if (normalizedUnit === "ml" || normalizedUnit === "milliliter" || normalizedUnit === "milliliters") {
    return quantity / 1000;
  }
  return quantity * 0.1; // Default fallback estimate
};

// =========================================
// GET /api/pantry → Fetch all active ingredients
// =========================================
router.get("/", async (req, res) => {
  try {
    const items = await PantryItem.find({ status: "active" }).sort({ expiryDate: 1 });
    res.status(200).json(items);
  } catch (error) {
    console.error("❌ Error fetching pantry:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// =========================================
// POST /api/pantry → Add a new ingredient
// =========================================
router.post("/", async (req, res) => {
  try {
    const { name, quantity, unit, purchaseDate, expiryDate, category } = req.body;

    if (!name || quantity === undefined || !unit || !expiryDate || !category) {
      return res.status(400).json({ message: "Missing required pantry fields" });
    }

    const newItem = new PantryItem({
      name,
      quantity,
      unit,
      purchaseDate: purchaseDate || Date.now(),
      expiryDate,
      category,
      status: "active",
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error("❌ Error adding pantry item:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// =========================================
// PUT /api/pantry/:id → Update pantry item
// =========================================
router.put("/:id", async (req, res) => {
  try {
    const updatedItem = await PantryItem.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error("❌ Error updating pantry item:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// =========================================
// DELETE /api/pantry/:id → Remove pantry item
// =========================================
router.delete("/:id", async (req, res) => {
  try {
    const deletedItem = await PantryItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Ingredient not found" });
    }
    res.status(200).json({ message: "Ingredient deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting pantry item:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// =========================================
// POST /api/pantry/:id/action → Cook or waste an ingredient (logs analytics)
// =========================================
router.post("/:id/action", async (req, res) => {
  try {
    const { action } = req.body; // "consume" or "waste"
    if (!action || !["consume", "waste"].includes(action)) {
      return res.status(400).json({ message: "Invalid action. Must be 'consume' or 'waste'." });
    }

    const item = await PantryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    // Determine status and carbon log
    let finalStatus = action === "consume" ? "consumed" : "wasted";
    item.status = finalStatus;
    await item.save();

    // Sustainability Calculations
    const weightKg = getWeightInKg(item.quantity, item.unit);
    let estimatedAction = "consume_fresh";
    let moneySaved = 0;
    let co2Reduced = 0;

    const remainingDays = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));

    if (action === "consume") {
      // If expiring within 3 days, it's considered saved/rescued!
      if (remainingDays <= 3) {
        estimatedAction = "consume_saved";
        moneySaved = weightKg * 150; // ₹150 per kg estimated savings
        co2Reduced = weightKg * 2.5; // 2.5 kg CO2 per kg food saved
      } else {
        estimatedAction = "consume_fresh";
      }
    } else {
      estimatedAction = "waste";
    }

    // Create entry in ImpactLog
    const logEntry = new ImpactLog({
      action: estimatedAction,
      itemName: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      estimatedWeightKg: weightKg,
      moneySavedINR: moneySaved,
      co2ReducedKg: co2Reduced,
      recipeGenerated: false,
    });

    await logEntry.save();

    res.status(200).json({
      message: `Ingredient marked as ${finalStatus} successfully!`,
      item,
      impact: logEntry,
    });
  } catch (error) {
    console.error("❌ Error processing pantry item action:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
