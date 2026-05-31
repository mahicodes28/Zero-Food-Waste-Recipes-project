const mongoose = require("mongoose");

const impactLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: ["consume_saved", "consume_fresh", "waste"],
      required: true,
    },
    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    estimatedWeightKg: {
      type: Number,
      required: true,
    },
    moneySavedINR: {
      type: Number,
      default: 0,
    },
    co2ReducedKg: {
      type: Number,
      default: 0,
    },
    recipeGenerated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ImpactLog", impactLogSchema);
