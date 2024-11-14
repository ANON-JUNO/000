const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Set up file upload
const upload = multer({ storage: multer.memoryStorage() });

// Route for asking AI
app.post("/api/askAI", async (req, res) => {
  const { query } = req.body;
  try {
    const response = await fetch(`https://haji-mix.onrender.com/gpt4om?prompt=${encodeURIComponent(query)}`);
    const data = await response.json();

    res.json({ response: `AI's response to "${query}":\n${data.response || "No response from AI."}` });
  } catch (error) {
    res.status(500).json({ error: "Error fetching AI response." });
  }
});

// Route for generating code
app.post("/api/generateCode", async (req, res) => {
  const { query, language } = req.body;
  try {
    const response = await fetch(`https://joshweb.click/api/codegpt?type=code&lang=${language.toLowerCase()}&q=${encodeURIComponent(query)}`);
    const data = await response.json();
    res.json({ result: `Generated ${language} Code:\n${data.result || "No code generated."}` });
  } catch (error) {
    res.status(500).json({ error: "Error generating code." });
  }
});

// Route for Ask Ashley
app.post("/api/askAshley", async (req, res) => {
  const { query } = req.body;
  try {
    const response = await fetch(`https://markdevs-last-api-2epw.onrender.com/api/ashley?query=${encodeURIComponent(query)}`);
    const data = await response.json();
    res.json({ response: `Ashley's response to "${query}":\n${data.result || "No response from Ashley."}` });
  } catch (error) {
    res.status(500).json({ error: "Error fetching Ashley response." });
  }
});

// Route for image recognition
app.post("/api/recognizeImage", upload.single("file"), async (req, res) => {
  const { question } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No image uploaded." });
  }

  try {
    const formData = new FormData();
    formData.append("file", file.buffer, file.originalname);
    formData.append("question", question);

    const response = await fetch(`https://joshweb.click/gemini?prompt=${encodeURIComponent(question)}`, {
      method: "POST",
      body: formData
    });
    
    const data = await response.json();
    res.json({ result: `Image recognition result for "${question}":\n${data.gemini || "Image recognition failed."}` });
  } catch (error) {
    res.status(500).json({ error: "Error recognizing image." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
