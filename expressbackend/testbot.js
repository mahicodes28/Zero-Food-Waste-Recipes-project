const fetch = require("node-fetch"); // works only with v2

async function testChatbot() {
  try {
  const response = await fetch("http://localhost:5000/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: "Give me a recipe with rice" }),
    });

    const data = await response.json();
    console.log("✅ Chatbot Reply:", data.reply);
  } catch (error) {
    console.error("❌ Error testing chatbot:", error);
  }
}

testChatbot();
