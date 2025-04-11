// Script to safely update the API key in index.html and config.js
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

// Create or update config.js
try {
  console.log('Checking config.js file');
  let configContent;
  
  try {
    configContent = fs.readFileSync('config.js', 'utf8');
    console.log('Existing config.js file found');
  } catch (readError) {
    console.log('No existing config.js found or unable to read it, creating a new one');
    configContent = `// Configuration for the vocabulary learning app
const config = {
    googleTTSApiKey: '__GOOGLE_TTS_API_KEY__'
};`;
  }
  
  // Check if the content has our expected structure
  if (!configContent.includes('googleTTSApiKey')) {
    console.log('config.js does not contain googleTTSApiKey, creating a proper structure');
    configContent = `// Configuration for the vocabulary learning app
const config = {
    googleTTSApiKey: '__GOOGLE_TTS_API_KEY__'
};`;
  }
  
  // Replace the placeholder with the actual API key
  const updatedConfigContent = configContent.replace(/__GOOGLE_TTS_API_KEY__/g, apiKey);
  
  // Write the updated content back to the file
  fs.writeFileSync('config.js', updatedConfigContent);
  console.log('Successfully updated config.js with API key');
  console.log('Content of config.js:');
  console.log(updatedConfigContent);
} catch (error) {
  console.error(`Error updating config.js: ${error.message}`);
  process.exit(1);
} 