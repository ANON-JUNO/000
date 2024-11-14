const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fetch = require('node-fetch');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

// Static file serving
app.use(express.static(path.join(__dirname, 'public')));

// API for handling GPT4 and code generation
app.get('/gpt4om', async (req, res) => {
  const prompt = req.query.prompt;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await fetch(`https://haji-mix.onrender.com/gpt4om?prompt=${encodeURIComponent(prompt)}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching from AI service', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Code generation endpoint
app.get('/codegpt', async (req, res) => {
  const { type, lang, q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    const response = await fetch(`https://joshweb.click/api/codegpt?type=${type}&lang=${lang}&q=${encodeURIComponent(q)}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error generating code', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Image recognition endpoint
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/gemini', upload.single('file'), async (req, res) => {
  const { file, body } = req;
  const question = body.question;

  if (!file || !question) {
    return res.status(400).json({ error: 'Image and question are required' });
  }

  try {
    const response = await fetch('https://example.com/api/image-recognition', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, image: file.buffer }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error recognizing image', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
