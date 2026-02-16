// Simple Node.js/Express backend to proxy voice cloning requests to ElevenLabs
// Save as server.js

const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const FormData = require('form-data');
const cors = require('cors');

const app = express();
const upload = multer();
const PORT = 5000;

const ELEVENLABS_API_KEY = 'sk_b1abd3bfdb5510257f07f8481648d58001d1906d928f0853';
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/voices/add';

app.use(cors());

app.post('/api/clone', upload.single('voiceSample'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const formData = new FormData();
    formData.append('name', 'My Custom Voice');
    formData.append('files', req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype
    });

    try {
        const response = await fetch(ELEVENLABS_API_URL, {
            method: 'POST',
            headers: {
                'xi-api-key': ELEVENLABS_API_KEY,
                ...formData.getHeaders()
            },
            body: formData
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});
