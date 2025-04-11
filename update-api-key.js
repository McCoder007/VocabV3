// Script to update API keys in files during build
const fs = require('fs');

// Get API key from environment variable
const apiKey = process.env.GOOGLE_TTS_API_KEY;

if (!apiKey) {
  console.error('Error: GOOGLE_TTS_API_KEY environment variable is not set');
  process.exit(1);
} else {
  console.log('API key found in environment variable');
  console.log(`API key length: ${apiKey.length}`);
  console.log(`API key first few chars: ${apiKey.substring(0, 4)}...`);
  console.log(`API key is valid format: ${apiKey.startsWith('AIza')}`);
}

// Helper function to manually replace all occurrences of a string
function replaceAll(str, find, replace) {
  // Split by the 'find' string and join with the 'replace' string
  return str.split(find).join(replace);
}

// Update debug-api-key.html - manually replace the placeholder
try {
  console.log('Reading debug-api-key.html file');
  let content = fs.readFileSync('debug-api-key.html', 'utf8');
  console.log('Original content with placeholder:', content.includes('__GOOGLE_TTS_API_KEY__'));
  
  // Replace the placeholder - using manual string replace to avoid regex issues
  content = replaceAll(content, '__GOOGLE_TTS_API_KEY__', apiKey);
  console.log('After replacement, still has placeholder:', content.includes('__GOOGLE_TTS_API_KEY__'));
  console.log('After replacement, has API key:', content.includes(apiKey));
  
  // Write the updated content back to the file
  fs.writeFileSync('debug-api-key.html', content);
  console.log('Successfully updated debug-api-key.html with API key for debugging');
} catch (error) {
  console.error(`Error updating debug file: ${error.message}`);
}

// Update api-key.js - create directly with the API key
try {
  console.log('Creating api-key.js file with direct API key');
  const apiKeyFileContent = `// This file contains only the API key - direct from build process
const GOOGLE_TTS_API_KEY = '${apiKey}';
console.log('API key loaded from separate file: ' + GOOGLE_TTS_API_KEY.substring(0, 4) + '...');`;
  
  fs.writeFileSync('api-key.js', apiKeyFileContent);
  console.log('Successfully created api-key.js with API key');
} catch (error) {
  console.error(`Error creating api-key.js: ${error.message}`);
}

// // Update index.html - REMOVED as key is sourced from config.js now
// try {
//   console.log('Reading index.html file');
//   let content = fs.readFileSync('index.html', 'utf8');
//   console.log('Original index.html has placeholder:', content.includes('__GOOGLE_TTS_API_KEY__'));
//   
//   // Replace the placeholder - using manual string replace to avoid regex issues
//   content = replaceAll(content, '__GOOGLE_TTS_API_KEY__', apiKey);
//   console.log('After replacement, still has placeholder:', content.includes('__GOOGLE_TTS_API_KEY__'));
//   console.log('After replacement, has API key:', content.includes(apiKey));
//   
//   // Write the updated content back to the file
//   fs.writeFileSync('index.html', content);
//   console.log('Successfully updated index.html with API key');
// } catch (error) {
//   console.error(`Error updating index.html: ${error.message}`);
//   process.exit(1);
// }

// Create config.js - create directly with the API key
try {
  console.log('Creating fresh config.js file');
  const configContent = `// Configuration for the vocabulary learning app
const config = {
    googleTTSApiKey: '${apiKey}' // API key set during build process
};`;
  
  fs.writeFileSync('config.js', configContent);
  console.log('Successfully created config.js with API key');
} catch (error) {
  console.error(`Error updating config.js: ${error.message}`);
  process.exit(1);
}

// Create a special validation file to verify that the API key is accessible
try {
  const validationContent = `
  <!-- This file proves the API key was properly set -->
  <html>
  <body>
    <h1>API Key Validation</h1>
    <div id="output"></div>
    <script>
      document.getElementById('output').innerHTML = 
        'API Key was replaced: ' + ('${apiKey}' !== '__GOOGLE_TTS_API_KEY__') + '<br>' +
        'API Key starts with: ' + '${apiKey}'.substring(0, 4) + '...<br>' +
        'API Key length: ' + '${apiKey}'.length;
    </script>
  </body>
  </html>
  `;
  fs.writeFileSync('api-key-validation.html', validationContent);
  console.log('Created validation file: api-key-validation.html');
} catch (error) {
  console.error(`Error creating validation file: ${error.message}`);
} 