const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");

dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());

// CORS (allow frontend from Vercel & local)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://your-frontend-name.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// API Routes
app.use("/api/recipes", require("./routes/recipes"));
app.use("/api/chatbot", require("./routes/chatbot"));

// -------------------------
// SERVE REACT FRONTEND BUILD
// -------------------------
app.use(express.static(path.join(__dirname, "../reactfrontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../reactfrontend/build/index.html"));
});

// -------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
