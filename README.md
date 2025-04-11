# Vocabulary Learning App

A mobile web application designed to help users learn vocabulary through an interactive, image-based learning experience with text-to-speech support.

## Features

- Display vocabulary items one at a time with images
- English and Chinese translations
- 3-second countdown before revealing translations
- Text-to-speech pronunciation of English words
- Mobile-responsive design
- Clean, card-based UI

## Setup

### Prerequisites

- Node.js
- A Google Cloud account with the Text-to-Speech API enabled
- A Google Cloud API key with access to the Text-to-Speech API

### Installation

1. Clone this repository:
```
git clone https://github.com/McCoder007/VocabV3.git
cd VocabV3
```

2. Install dependencies:
```
npm install
```

3. Add your Google TTS API key to GitHub Secrets:
   - Go to your repository settings
   - Navigate to "Secrets and variables" → "Actions"
   - Create a new secret named `GOOGLE_TTS_API_KEY`
   - Paste your API key as the value

### Deployment

The app is automatically deployed to GitHub Pages when changes are pushed to the main branch. The API key is securely injected during the build process.

## Development

To run the app locally:

1. Set your API key in the environment:
```
export GOOGLE_TTS_API_KEY=your_api_key_here
```

2. Run the build script:
```
npm run build
```

3. Serve the files using a local server:
```
npm run serve
```

## License

MIT 