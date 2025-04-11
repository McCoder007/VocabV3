// Script to update API keys in files during build
const fs = require('fs');

// Get API key from environment variable
const apiKey = process.env.GOOGLE_TTS_API_KEY;

if (!apiKey) {
  console.error('Error: GOOGLE_TTS_API_KEY environment variable is not set');
  process.exit(1);
} else {
  console.log('API key found in environment variable');
}

// Update index.html - replace the placeholder with the actual API key
try {
  console.log('Reading index.html file');
  const indexContent = fs.readFileSync('index.html', 'utf8');
  
  // Replace the placeholder with the actual API key
  const updatedContent = indexContent.replace(
    /'__GOOGLE_TTS_API_KEY__'/g, 
    `'${apiKey}'`
  );
  
  // Write the updated content back to the file
  fs.writeFileSync('index.html', updatedContent);
  console.log('Successfully updated index.html with API key');
} catch (error) {
  console.error(`Error updating index.html: ${error.message}`);
  process.exit(1);
}

// Update config.js - replace the placeholder with the actual API key
try {
  console.log('Checking if config.js exists');
  
  // Create config.js file with proper format
  const configContent = `// Configuration for the vocabulary learning app
const config = {
    googleTTSApiKey: '${apiKey}' // This will be replaced during build
};`;
  
  // Write the content to the file
  fs.writeFileSync('config.js', configContent);
  console.log('Successfully created/updated config.js with API key');
} catch (error) {
  console.error(`Error updating config.js: ${error.message}`);
  process.exit(1);
} 