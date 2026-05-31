const express = require("express");
const router = express.Router();

const PantryItem = require("../models/PantryItem");
const ImpactLog = require("../models/ImpactLog");
const Groq = require("groq-sdk");

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// =========================================
// POST /api/ai-recipes/generate
// =========================================
router.post("/generate", async (req, res) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        message: "GROQ_API_KEY not found in .env file",
      });
    }

    const { ingredientIds = [] } = req.body;

    let selectedItems = [];

    // Get ingredients from pantry
    if (ingredientIds.length > 0) {
      selectedItems = await PantryItem.find({
        _id: { $in: ingredientIds },
      });
    } else {
      selectedItems = await PantryItem.find({
        status: "active",
      })
        .sort({ expiryDate: 1 })
        .limit(4);
    }

    if (selectedItems.length === 0) {
      return res.status(400).json({
        message:
          "No ingredients found in your pantry. Please add ingredients first.",
      });
    }

    const ingredientDescriptions = selectedItems.map((item) => {
      const daysLeft = Math.max(
        0,
        Math.ceil(
          (new Date(item.expiryDate) - new Date()) /
          (1000 * 60 * 60 * 24)
        )
      );

      return `${item.name} (${item.quantity} ${item.unit}, category: ${item.category}, expires in ${daysLeft} days)`;
    });

    const systemPrompt = `
You are Zero-Waste Chef.

Generate a delicious recipe using as many pantry ingredients as possible.

Return ONLY valid JSON in this exact format:

{
  "recipe_name": "Recipe Name",
  "description": "Short description",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "steps": ["step 1", "step 2"],
  "cooking_time": "20 mins",
  "difficulty": "Easy",
  "waste_prevention_reason": "Explain sustainability impact"
}

DO NOT include markdown.
DO NOT include backticks.
ONLY return JSON.
`;

    const userPrompt = `
Ingredients:

${ingredientDescriptions.join("\n")}

Create a recipe that uses as many ingredients as possible.
You may add common kitchen staples like salt, pepper, oil, spices, flour and water.
`;

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const rawReply =
      completion?.choices?.[0]?.message?.content || "{}";

    console.log("========== GROQ RESPONSE ==========");
    console.log(rawReply);
    console.log("===================================");

    let recipeData;

    try {
      recipeData = JSON.parse(rawReply);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);

      return res.status(500).json({
        message: "AI returned invalid JSON",
        rawResponse: rawReply,
      });
    }

    // Analytics log
    try {
      await new ImpactLog({
        action: "consume_fresh",
        itemName: recipeData.recipe_name,
        category: "AI Recipes",
        quantity: 1,
        unit: "recipe",
        estimatedWeightKg: 0.1,
        moneySavedINR: 0,
        co2ReducedKg: 0,
        recipeGenerated: true,
      }).save();
    } catch (logError) {
      console.error("ImpactLog Error:", logError);
    }

    return res.status(200).json({
      recipe: recipeData,
      usedIngredients: selectedItems,
    });
  } catch (error) {
    console.error("❌ Groq Recipe Error:");
    console.error(error);

    return res.status(500).json({
      message: "Chef-Cook AI was unable to generate a recipe.",
      error: error.message,
    });
  }
});

module.exports = router;