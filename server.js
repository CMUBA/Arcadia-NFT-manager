const express = require('express');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = 3018;

// Serve static files
app.use(express.static('public'));
app.use('/assets', express.static('assets'));

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle metadata generation request
app.post('/generate-metadata', (req, res) => {
    exec('node scripts/generateMetadata.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            return res.status(500).json({ error: 'Failed to generate metadata' });
        }
        res.json({ message: 'Metadata generated successfully!' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
}); 