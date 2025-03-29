const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.post("/api/askAI", async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Query is required" });

  try {
    const response = await axios.get(
      `https://markdevs-last-api-2epw.onrender.com/api/adobo/gpt?query=${encodeURIComponent(query)}`
    );
    res.json({ result: response.data.result });
  } catch (error) {
    res.status(500).json({ error: "Error fetching AI response" });
  }
});

app.post("/api/humanizer", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  try {
    const response = await axios.get(
      `https://jonell01-ccprojectsapihshs.hf.space/api/aihuman?text=${encodeURIComponent(text)}`
    );
    res.json({ result: response.data.result });
  } catch (error) {
    res.status(500).json({ error: "Error fetching Humanizer response" });
  }
});

// Catch-all to serve frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
