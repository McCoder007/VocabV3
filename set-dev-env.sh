#!/bin/bash

# Check if API key is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 YOUR_API_KEY"
    exit 1
fi

# Set API key environment variable
export GOOGLE_TTS_API_KEY=$1

# Run the build
node build.js

# Start the development server
echo "Starting development server..."
node serve.js 