const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");

// =========================================
// POST /api/recipes → Save a new recipe
// =========================================
router.post("/", async (req, res) => {
  try {
    const { title, ingredients, instructions } = req.body;

    // Validation
    if (!title || !ingredients || !instructions) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create and save new recipe
    const newRecipe = new Recipe({ title, ingredients, instructions });
    const savedRecipe = await newRecipe.save();

    res.status(201).json({
      message: "Recipe saved successfully!",
      recipe: savedRecipe,
    });
  } catch (error) {
    console.error("❌ Error saving recipe:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// =========================================
// GET /api/recipes → Fetch all recipes
// =========================================
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.status(200).json(recipes);
  } catch (error) {
    console.error("❌ Error fetching recipes:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// =========================================
// DELETE /api/recipes/:id → Delete a recipe
// =========================================
router.delete("/:id", async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);

    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting recipe:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
