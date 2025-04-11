// Script to safely update the API key in index.html
const fs = require('fs');

// Get API key from environment variable
const apiKey = process.env.GOOGLE_TTS_API_KEY;

if (!apiKey) {
  console.error('Error: GOOGLE_TTS_API_KEY environment variable is not set');
  process.exit(1);
} else {
  console.log('API key found in environment variable');
}

// Update index.html
try {
  console.log('Reading index.html file');
  const indexContent = fs.readFileSync('index.html', 'utf8');
  console.log('Successfully read index.html file');
  
  // Replace the placeholder with the actual API key
  const updatedContent = indexContent.replace(/__GOOGLE_TTS_API_KEY__/g, apiKey);
  
  // Write the updated content back to the file
  fs.writeFileSync('index.html', updatedContent);
  console.log('Successfully updated index.html with API key');
} catch (error) {
  console.error(`Error updating index.html: ${error.message}`);
  process.exit(1);
} 