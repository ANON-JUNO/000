const express = require('express');
const fetch = require('node-fetch');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

// Initialize Express
const app = express();
const port = process.env.PORT || 5000;

// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Set up middleware to parse JSON bodies
app.use(express.json());

// Set up file upload using multer
const upload = multer({ dest: 'uploads/' });

// API endpoint for AI query
app.get('/api/v2/gpt4', async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: 'No query provided' });
  }

  try {
    const response = await fetch(`https://markdevs-last-api-2epw.onrender.com/api/v2/gpt4?query=${encodeURIComponent(query)}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data from AI service' });
  }
});

// API endpoint for code generation
app.get('/api/codegpt', async (req, res) => {
  const { lang, q } = req.query;
  if (!q || !lang) {
    return res.status(400).json({ error: 'No query or language provided' });
  }

  try {
    const response = await fetch(`https://joshweb.click/api/codegpt?type=code&lang=${lang}&q=${encodeURIComponent(q)}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate code' });
  }
});

// API endpoint for Ashley's response
app.get('/api/ashley', async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: 'No query provided' });
  }

  try {
    const response = await fetch(`https://markdevs-last-api-2epw.onrender.com/api/ashley?query=${encodeURIComponent(query)}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data from Ashley service' });
  }
});

// API endpoint for image recognition
app.post('/api/recognize-image', upload.single('file'), async (req, res) => {
  const { file, body } = req;
  if (!file || !body.question) {
    return res.status(400).json({ error: 'No file or question provided' });
  }

  try {
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);
    formData.append('question', body.question);

    const response = await fetch(`https://joshweb.click/gemini?prompt=${encodeURIComponent(body.question)}`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to recognize image' });
  }
});

// Serve static files (for the front-end)
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
