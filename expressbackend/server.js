const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware should come first
app.use(cors());
app.use(express.json());

// Import routes (CommonJS, no .default)
const chatbotRoutes = require("./routes/chatbot.js");
app.use("/api/chatbot", chatbotRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
