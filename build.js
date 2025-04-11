const fs = require('fs');
const path = require('path');

// Read the API key from environment variable
const apiKey = process.env.GOOGLE_TTS_API_KEY;

console.log('Starting build process...');

if (!apiKey) {
    console.error('Error: GOOGLE_TTS_API_KEY environment variable is not set');
    process.exit(1);
}

console.log(`API key found (${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)})`);

// Read the config file
const configPath = path.join(__dirname, 'config.js');
console.log(`Reading config file from: ${configPath}`);

try {
    let configContent = fs.readFileSync(configPath, 'utf8');
    console.log('Original config content:', configContent);

    // Replace the placeholder with the actual API key
    const updatedContent = configContent.replace(
        /__GOOGLE_TTS_API_KEY__/g,
        apiKey
    );

    if (configContent === updatedContent) {
        console.error('WARNING: No replacements were made! Check if placeholder exists in config file.');
    } else {
        console.log('Placeholder successfully replaced with API key');
    }

    // Write the updated config file
    fs.writeFileSync(configPath, updatedContent);
    console.log('Updated config file written successfully');

    // Verify the change
    const verifyContent = fs.readFileSync(configPath, 'utf8');
    console.log('Verifying config content (should not contain placeholder):', verifyContent);
    
    if (verifyContent.includes('__GOOGLE_TTS_API_KEY__')) {
        console.error('ERROR: Placeholder still exists in config file after writing!');
        process.exit(1);
    }

    console.log('Build completed successfully');
} catch (error) {
    console.error('Error during build process:', error);
    process.exit(1);
} 