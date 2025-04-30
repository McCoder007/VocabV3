# Secure API Key Management for GitHub Pages Projects

This documentation outlines a secure method for managing API keys in client-side web applications hosted on GitHub Pages. It prevents sensitive credentials from being exposed in your source code repository while making them available to your deployed application.

## Overview

When deploying a web application to GitHub Pages that requires API keys (such as Google TTS), you need a way to:
1. Keep API keys out of your source code repository
2. Make the keys available to your client-side JavaScript code
3. Automate the deployment process

## Implementation Steps

### 1. Store API Keys in GitHub Secrets

1. Go to your repository on GitHub
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Create a secret named `GOOGLE_TTS_API_KEY` (or whatever your key is called)
5. Paste your API key as the value
6. Click "Add secret"

### 2. Set Up Placeholder Files

Create configuration files with placeholders that will be replaced during build:

**api-key.js**:
```javascript
// This file contains only the API key and will be replaced during build
const GOOGLE_TTS_API_KEY = '__GOOGLE_TTS_API_KEY__';
```

**config.js**:
```javascript
// Configuration for the application
const config = {
    googleTTSApiKey: '__GOOGLE_TTS_API_KEY__' // This will be replaced during build
};
```

### 3. Create an API Key Injection Script

Create `update-api-key.js` to replace placeholders with actual keys during build:

```javascript
// Script to update API keys in files during build
const fs = require('fs');

// Get API key from environment variable
const apiKey = process.env.GOOGLE_TTS_API_KEY;

if (!apiKey) {
  console.error('Error: GOOGLE_TTS_API_KEY environment variable is not set');
  process.exit(1);
}

// Update config.js with the API key
try {
  console.log('Creating config.js file');
  const configContent = `// Configuration for the application
const config = {
    googleTTSApiKey: '${apiKey}' // API key set during build process
};`;
  
  fs.writeFileSync('config.js', configContent);
  console.log('Successfully created config.js with API key');
} catch (error) {
  console.error(`Error creating config.js: ${error.message}`);
  process.exit(1);
}

// You can add more file updates as needed
```

### 4. Set Up GitHub Actions Workflow

Create a file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: write
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'

      - name: Install dependencies
        run: npm install

      - name: Check for API key
        run: |
          if [ -z "${{ secrets.GOOGLE_TTS_API_KEY }}" ]; then
            echo "ERROR: GOOGLE_TTS_API_KEY secret is not set in repository settings"
            exit 1
          else
            echo "API key is set and available"
          fi

      - name: Update API keys in files
        env:
          GOOGLE_TTS_API_KEY: ${{ secrets.GOOGLE_TTS_API_KEY }}
        run: |
          node update-api-key.js
          echo "API keys have been updated in the necessary files"

      - name: Verify API key replacement
        env:
          GOOGLE_TTS_API_KEY: ${{ secrets.GOOGLE_TTS_API_KEY }}
        run: |
          echo "Verifying API key replacement in files..."
          if grep -q "$GOOGLE_TTS_API_KEY" config.js; then
            echo "✅ API key found in config.js"
          else
            echo "❌ ERROR: API key NOT found in config.js"
            exit 1
          fi

      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: .
          branch: gh-pages
          token: ${{ secrets.GITHUB_TOKEN }}
          clean: true
```

### 5. Update .gitignore

Ensure your `.gitignore` prevents committing any files that might contain actual API keys:

```
# Environment variables and secrets
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# These files should only be generated during build
api-key-validation.html
```

### 6. Reference Config Files in Your Application

In your `index.html`, load the configuration files before your application code:

```html
<script src="config.js"></script>
<script src="api-key.js"></script>
<!-- Load your application scripts after -->
<script src="app.js"></script>
```

### 7. Access API Keys in Your Code

In your application code, access the API key from the config object:

```javascript
// In your application code
function makeApiCall() {
  // Access the API key from the config object
  const apiKey = config.googleTTSApiKey;
  
  // Or use the global constant if you prefer
  // const apiKey = GOOGLE_TTS_API_KEY;
  
  // Use the API key in your fetch requests
  fetch(`https://api.example.com/endpoint?key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      // Process the data
    });
}
```

### 8. Configure GitHub Pages

1. Go to your repository Settings
2. Navigate to Pages
3. Set the "Build and deployment" source to "Deploy from a branch"
4. Select the `gh-pages` branch and root folder
5. Click "Save"

## Security Benefits

This approach:
1. Keeps API keys out of your source code repository
2. Restricts access to API keys to those with repository admin rights
3. Automates the injection of API keys during the build process
4. Ensures keys are only present in the deployed version, not the source code
5. Allows easy rotation of API keys without changing code

## Testing Locally

For local development, you can:

1. Create a `.env` file with your API keys (add to `.gitignore`)
2. Use a simple script to load these keys during development:

```javascript
// local-dev.js
require('dotenv').config();
const { execSync } = require('child_process');

// Run the same update script used in production
try {
  execSync('node update-api-key.js', { stdio: 'inherit' });
  console.log('Local development environment set up with API keys from .env');
} catch (error) {
  console.error('Failed to set up local environment:', error);
}
```

This setup ensures your API keys remain secure while allowing your application to function correctly in both development and production environments. 