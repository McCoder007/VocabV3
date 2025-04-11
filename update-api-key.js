// Script to safely update the API key in index.html and config.js
const fs = require('fs');

// Get API key from environment variable
const apiKey = process.env.GOOGLE_TTS_API_KEY;

if (!apiKey) {
  console.error('Error: GOOGLE_TTS_API_KEY environment variable is not set');
  process.exit(1);
} else {
  console.log('API key found in environment variable');
  console.log(`API key starts with: ${apiKey.substring(0, 4)}...`);
}

// Update index.html with the exact pattern match
try {
  console.log('Reading index.html file');
  const indexContent = fs.readFileSync('index.html', 'utf8');
  console.log('Successfully read index.html file');
  
  // Create a completely new script tag with hardcoded API key
  const scriptPattern = /<script>\s*\/\/\s*Initialize with API key[\s\S]*?<\/script>/;
  const newScript = `<script>
        // Initialize with API key and voice settings
        document.addEventListener('DOMContentLoaded', function() {
            // Log what we're trying to do
            console.log('Initializing Google TTS...');
            
            // Direct API key - no placeholder
            const apiKey = '${apiKey}';
            console.log('API key length:', apiKey.length);
            console.log('API key first 4 chars:', apiKey.substring(0, 4));
            
            // Directly use the API key - hardcoded during build
            googleTTS.setApiKey(apiKey);
            
            // Set to male Neural2 voice
            googleTTS.setVoice('en-US-Neural2-D');
            
            // Initialize audio on first user interaction for iOS
            document.body.addEventListener('touchstart', function() {
                // Try to initialize audio context
                if (googleTTS.audioContext && googleTTS.audioContext.state === 'suspended') {
                    googleTTS.audioContext.resume();
                }
            }, {once: true});
        });
    </script>`;
  
  // Replace the entire script tag
  const updatedContent = indexContent.replace(scriptPattern, newScript);
  
  // Check if replacement happened
  if (updatedContent === indexContent) {
    console.error('❌ Failed to find and replace the script tag in index.html');
  } else {
    // Write the updated content back to the file
    fs.writeFileSync('index.html', updatedContent);
    console.log('✅ Successfully updated index.html with API key');
    
    // Debug - confirm the api key is properly set
    if (updatedContent.includes(apiKey)) {
      console.log('✓ Confirmed API key is present in index.html');
    } else {
      console.error('✗ API key NOT found in updated index.html!');
    }
  }
} catch (error) {
  console.error(`Error updating index.html: ${error.message}`);
  process.exit(1);
}

// Create or update config.js
try {
  console.log('Creating config.js file with API key');
  const configContent = `// Configuration for the vocabulary learning app
const config = {
    googleTTSApiKey: '${apiKey}'  // Direct insertion with no placeholder
};`;
  
  // Always create a fresh config.js with the API key directly inserted
  fs.writeFileSync('config.js', configContent);
  console.log('Successfully created config.js with API key directly inserted');
  console.log(`Config contains key that starts with: ${apiKey.substring(0, 4)}...`);
} catch (error) {
  console.error(`Error updating config.js: ${error.message}`);
  process.exit(1);
}

// Create a direct app.js injection to immediately set the API key
try {
  console.log('Creating app-init.js file to directly set the API key');
  const initContent = `// Direct TTS API key setter
console.log('Directly setting Google TTS API key from app-init.js');
if (typeof googleTTS !== 'undefined') {
    googleTTS.setApiKey('${apiKey}');
} else {
    console.error('googleTTS not defined yet - will rely on the initialization in index.html');
}`;
  
  fs.writeFileSync('app-init.js', initContent);
  console.log('Successfully created app-init.js');
  
  // Now update index.html to include this script right after google-tts.js
  try {
    const indexContent = fs.readFileSync('index.html', 'utf8');
    const updatedContent = indexContent.replace(
      /<script src="google-tts.js"><\/script>/,
      `<script src="google-tts.js"></script>\n    <script src="app-init.js"></script>`
    );
    
    if (updatedContent !== indexContent) {
      fs.writeFileSync('index.html', updatedContent);
      console.log('✅ Successfully added app-init.js to index.html');
    }
  } catch (indexError) {
    console.error(`Error updating index.html for app-init.js: ${indexError.message}`);
  }
} catch (error) {
  console.error(`Error creating app-init.js: ${error.message}`);
  // Continue even if this fails
}

// Fix google-tts.js
try {
  console.log('Updating google-tts.js to completely disable placeholder checks');
  
  if (!fs.existsSync('google-tts.js')) {
    console.warn('google-tts.js not found, skipping modification');
  } else {
    const googleTtsContent = fs.readFileSync('google-tts.js', 'utf8');
    
    // Replace any check for placeholder with false
    let modifiedContent = googleTtsContent
      .replace(/key\.startsWith\(['"]__GOOGLE_TTS_API_KEY__['"]\)/g, 'false')
      .replace(/this\.apiKey\.startsWith\(['"]__GOOGLE_TTS_API_KEY__['"]\)/g, 'false')
      .replace(/startsWith\(['"]__GOOGLE_TTS_API_KEY__['"]\)/g, 'false');
      
    fs.writeFileSync('google-tts.js', modifiedContent);
    console.log('Successfully updated google-tts.js');
  }
} catch (error) {
  console.error(`Error updating google-tts.js: ${error.message}`);
  // Continue even if this fails
} 