const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// --- MIDDLEWARE ---
app.use(
  cors({
    origin: ["http://localhost:3000"], // React frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// --- ROUTES ---
app.use("/api/recipes", require("./routes/recipes"));
app.use("/api/chatbot", require("./routes/chatbot"));

// --- TEST ROUTE ---
app.get("/", (req, res) => {
  res.send("🚀 Zero Food Waste Backend is running!");
});

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Backend server running at http://localhost:${PORT}`);
});
