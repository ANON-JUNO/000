const express = require("express");
const path = require("path");
const app = express();

// Use the PORT environment variable, with a fallback to port 3000
const port = process.env.PORT || 3000;

app.use(express.json());

// Serve the static HTML file from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Endpoint for "Ask AI"
app.post("/ask-ai", (req, res) => {
  const query = req.body.query;
  res.json({ response: `AI's response to: "${query}"` });
});

// Endpoint for "Generate Code"
app.post("/generate-code", (req, res) => {
  const { query, language } = req.body;
  res.json({ result: `Generated code in ${language} for "${query}"` });
});

// Endpoint for "Ask Ashley"
app.post("/ask-ashley", (req, res) => {
  const query = req.body.query;
  res.json({ result: `Ashley's answer to: "${query}"` });
});

// Start the server
app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
