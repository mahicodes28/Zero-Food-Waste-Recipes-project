const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const OpenAI = require("openai");


dotenv.config();

// Create OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ POST /api/chatbot
router.post("/", async (req, res) => {
  try {
    const { message, ingredients = [] } = req.body;

    const prompt = `I have these ingredients: ${ingredients.join(", ")}.
User says: "${message}"
Suggest a zero-waste recipe idea in 3 short steps.`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a chef who helps reduce food waste." },
        { role: "user", content: prompt },
      ],
      max_tokens: 300,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("Chatbot error:", err);
    res.status(500).json({ error: "Chatbot error" });
  }
});

module.exports = router;
