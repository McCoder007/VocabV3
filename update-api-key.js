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
}

// Update index.html - replace the placeholder with the actual API key
try {
  console.log('Reading index.html file');
  const indexContent = fs.readFileSync('index.html', 'utf8');
  console.log('Successfully read index.html file');
  
  // Log the content of the index.html file for debugging
  console.log('Original index.html file content snippet:');
  // Only show part of the file containing the API key placeholder
  const startIdx = indexContent.indexOf('googleTTS.setApiKey');
  if (startIdx !== -1) {
    const snippet = indexContent.substring(startIdx, startIdx + 60);
    console.log(snippet);
  } else {
    console.log('Could not find googleTTS.setApiKey in index.html');
  }
  
  // Replace the placeholder with the actual API key - using a more specific pattern
  const pattern = /googleTTS\.setApiKey\(['"]__GOOGLE_TTS_API_KEY__['"]\)/g;
  const replacement = `googleTTS.setApiKey('${apiKey}')`;
  
  if (indexContent.match(pattern)) {
    console.log('Found the exact pattern in index.html');
  } else {
    console.log('WARNING: Exact pattern not found in index.html');
    console.log('Will attempt a more generic replacement');
  }
  
  // Try the specific pattern first
  let updatedContent = indexContent.replace(pattern, replacement);
  
  // If that didn't work, try a more generic approach
  if (updatedContent === indexContent) {
    console.log('Specific pattern replacement failed, trying alternative approaches');
    
    // Try another pattern
    updatedContent = indexContent.replace(
      /__GOOGLE_TTS_API_KEY__/g, 
      apiKey
    );
  }
  
  // Write the updated content back to the file
  fs.writeFileSync('index.html', updatedContent);
  console.log('Successfully updated index.html with API key');
  
  // Verify the replacement worked
  if (updatedContent.includes(apiKey)) {
    console.log('✅ Verified: API key is present in the updated index.html');
  } else {
    console.error('❌ ERROR: API key not found in the updated index.html!');
  }
  
  // Log the content of the updated index.html file for debugging
  console.log('Updated index.html file content snippet:');
  const newStartIdx = updatedContent.indexOf('googleTTS.setApiKey');
  if (newStartIdx !== -1) {
    const snippet = updatedContent.substring(newStartIdx, newStartIdx + 60);
    console.log(snippet.replace(apiKey, '[API_KEY]')); // Hide the actual API key in the logs
  }
} catch (error) {
  console.error(`Error updating index.html: ${error.message}`);
  process.exit(1);
}

// Create a completely fresh config.js with the API key directly
try {
  console.log('Creating fresh config.js file');
  
  // Create config.js file with proper format
  const configContent = `// Configuration for the vocabulary learning app
const config = {
    googleTTSApiKey: '${apiKey}' // API key set during build process
};`;
  
  // Write the content to the file
  fs.writeFileSync('config.js', configContent);
  console.log('Successfully created config.js with API key');
  
  // Verify the API key is in the config file
  if (fs.readFileSync('config.js', 'utf8').includes(apiKey)) {
    console.log('✅ Verified: API key is present in config.js');
  } else {
    console.error('❌ ERROR: API key not found in config.js!');
  }
} catch (error) {
  console.error(`Error updating config.js: ${error.message}`);
  process.exit(1);
} 