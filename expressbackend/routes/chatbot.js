const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

// Create OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

//  POST /api/chatbot
router.post("/", async (req, res) => {
  try {
    const { message, ingredients = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Build prompt dynamically
    const prompt = ingredients.length
      ? `User has these ingredients: ${ingredients.join(", ")}.\nUser says: ${message}.`
      : `User says: ${message}.`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are 'Your Chat-Cook' — a friendly chef who helps users reduce food waste with simple suggestions.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 250,
    });

    const reply = completion.choices[0].message.content || "I have no response.";

    res.json({ reply });
  } catch (err) {
    console.error("❌ Chatbot error:", err);
    res.status(500).json({ error: "Chatbot server error" });
  }
});

module.exports = router;
