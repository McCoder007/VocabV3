const fs = require('fs');
const path = require('path');

// Read the API key from environment variable
const apiKey = process.env.GOOGLE_TTS_API_KEY;

if (!apiKey) {
    console.error('Error: GOOGLE_TTS_API_KEY environment variable is not set');
    process.exit(1);
}

// Read the config file
const configPath = path.join(__dirname, 'config.js');
let configContent = fs.readFileSync(configPath, 'utf8');

// Replace the placeholder with the actual API key
configContent = configContent.replace(
    /__GOOGLE_TTS_API_KEY__/g,
    apiKey
);

// Write the updated config file
fs.writeFileSync(configPath, configContent);

console.log('Build completed successfully'); 