const express = require('express');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
const identifyEWaste = require('./identify-ewaste'); // Import the identification function
const app = express();

app.use(cors());
app.use(bodyParser.json());
const upload = multer({ dest: '../components/Assets/uploads' });

app.post('/api/identify-ewaste', upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file.path;
    const result = await identifyEWaste(imagePath); // Call your model to identify the e-waste
    res.json(result); // Send back the result
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
