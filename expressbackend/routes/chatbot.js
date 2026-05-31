const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const Groq = require("groq-sdk");

dotenv.config();

// Validate API Key
if (!process.env.GROQ_API_KEY) {
  console.error("❌ GROQ_API_KEY not found in .env");
}

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// =========================================
// POST /api/chatbot
// =========================================
router.post("/", async (req, res) => {
  try {
    const { message, ingredients = [] } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const prompt =
      ingredients.length > 0
        ? `
User has these pantry ingredients:
${ingredients.join(", ")}

User question:
${message}
`
        : `
User question:
${message}
`;

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are "Chef-Cook AI", a friendly and intelligent food waste reduction assistant.

Your responsibilities:
- Help users use ingredients before expiry.
- Suggest recipes.
- Provide cooking tips.
- Suggest ingredient substitutions.
- Encourage sustainable cooking habits.
- Keep responses concise and practical.
          `,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const reply =
      completion?.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    console.log("🤖 Chatbot Reply:", reply);

    return res.status(200).json({
      reply,
    });
  } catch (error) {
    console.error("❌ Chatbot Error:");
    console.error(error);

    return res.status(500).json({
      error: "Chatbot server error",
      details: error.message,
    });
  }
});

module.exports = router;