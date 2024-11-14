const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup Multer for image upload
const upload = multer({ dest: 'uploads/' });

// Ask AI route
app.get('/askAI', async (req, res) => {
  const prompt = req.query.prompt;

  if (!prompt) {
    return res.json({ error: 'Please provide a prompt.' });
  }

  try {
    const response = await fetch(`https://haji-mix.onrender.com/gpt4om?prompt=${encodeURIComponent(prompt)}`);
    const data = await response.json();

    if (data && data.response) {
      return res.json({
        message: `Ask AI Response:\nAI's response to: "${prompt}"\n\n${data.response}`,
      });
    } else {
      return res.json({ error: 'No response from AI.' });
    }
  } catch (error) {
    return res.json({ error: 'Error fetching response from AI.' });
  }
});

// Generate Code route
app.get('/generateCode', async (req, res) => {
  const query = req.query.query;
  const language = req.query.language;

  if (!query || !language) {
    return res.json({ error: 'Please provide both query and language.' });
  }

  const validLanguages = ['html', 'css', 'javascript', 'python'];

  if (!validLanguages.includes(language.toLowerCase())) {
    return res.json({ error: 'Invalid language. Supported languages: HTML, CSS, JS, Python.' });
  }

  try {
    const response = await fetch(`https://joshweb.click/api/codegpt?type=code&lang=${language}&q=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (data && data.result) {
      return res.json({
        message: `Generated Code:\nCode in ${language.toUpperCase()}:\n\n${formatCode(data.result)}`,
      });
    } else {
      return res.json({ error: 'Error generating code.' });
    }
  } catch (error) {
    return res.json({ error: 'Error generating code.' });
  }
});

// Recognize Image route
app.post('/recognizeImage', upload.single('file'), async (req, res) => {
  const file = req.file;
  const question = req.body.question;

  if (!file) {
    return res.json({ error: 'Please upload an image.' });
  }

  if (!question) {
    return res.json({ error: 'Please provide a question about the image.' });
  }

  try {
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);
    formData.append('question', question);

    const response = await fetch('https://joshweb.click/gemini', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data && data.gemini) {
      return res.json({
        message: `Image Recognition Result:\n\n${data.gemini}`,
      });
    } else {
      return res.json({ error: 'Error recognizing image.' });
    }
  } catch (error) {
    return res.json({ error: 'Error recognizing image.' });
  }
});

// Format code for display
function formatCode(code) {
  return code.replace(/</g, '&lt;').replace(/>/g, '&gt;'); // Escape HTML tags for display
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
