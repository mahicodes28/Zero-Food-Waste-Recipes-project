const mongoose = require("mongoose");

const pantryItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Ingredient name is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
    },
    unit: {
      type: String,
      required: [true, "Unit is required"],
      trim: true,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: [true, "Expiry date is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Vegetables", "Fruits", "Dairy", "Meat/Protein", "Grains/Pantry", "Bakery", "Beverages", "Others"],
      default: "Others",
    },
    status: {
      type: String,
      enum: ["active", "consumed", "wasted"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PantryItem", pantryItemSchema);
