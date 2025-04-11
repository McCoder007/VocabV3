# Setting Up Google Cloud Text-to-Speech API

This guide will help you set up the Google Cloud Text-to-Speech API for use with the Vocabulary Learning App.

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown menu at the top of the page
3. Click "New Project"
4. Enter a name for your project and click "Create"
5. Wait for your project to be created

## Step 2: Enable the Text-to-Speech API

1. From the Google Cloud Console dashboard, click "Enable APIs and Services"
2. Search for "Text-to-Speech API"
3. Select the Text-to-Speech API from the results
4. Click "Enable"

## Step 3: Create an API Key

1. From the Google Cloud Console dashboard, go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" and select "API key"
3. Your new API key will be displayed
4. **IMPORTANT:** Restrict the API key to only the Text-to-Speech API for security

## Step 4: Set API Key Restrictions (Recommended)

1. In the credentials page, find your API key and click "Edit"
2. Under "API restrictions", select "Restrict key"
3. Select "Cloud Text-to-Speech API" from the dropdown
4. Click "Save"

## Step 5: Set Up Website Restrictions (Recommended)

1. In the API key editing page, under "Application restrictions", select "HTTP referrers (websites)"
2. Add your website domain, such as `*.github.io/*` for GitHub Pages
3. Click "Save"

## Step 6: Add the API Key to GitHub Secrets

1. Go to your GitHub repository
2. Click on "Settings"
3. Select "Secrets and variables" > "Actions"
4. Click "New repository secret"
5. Name: `GOOGLE_TTS_API_KEY`
6. Value: Paste your API key
7. Click "Add secret"

## Testing Locally

To test the application locally, use:

```bash
./set-dev-env.sh YOUR_API_KEY
```

This will start a local development server with your API key. 