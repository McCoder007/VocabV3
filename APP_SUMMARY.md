# Vocabulary Flashcards App Summary

This is a web-based vocabulary flashcard application designed specifically for iOS devices, primarily iPhones. The app helps users learn vocabulary words through a spaced repetition system.

## Core Functionality
- Displays flashcards with images first, then reveals translations
- Tracks learning progress for each word (learning vs. known)
- Shows overall progress percentage
- Provides tabbed navigation between flashcards, learning words, and known words

## Technical Implementation
- Pure HTML/CSS/JavaScript (no framework)
- Responsive design optimized for iPhone screens
- Uses CSS safe-area insets for iPhone notch compatibility
- Stores progress in localStorage (key: vocabProgressV3)
- Preloads images and audio for smooth experience

## UI Components
- Start screen with welcome message and start button
- Flashcard view with image, English/Chinese translations, and action buttons
- Learning list showing words still being learned
- Known list showing mastered words
- Progress bar showing overall completion percentage
- Tab navigation system for switching between views

## File Structure
- index.html: Main app structure
- styles.css: All styling with responsive design
- app.js: Core application logic and state management
- vocabulary-data.js: Contains the vocabulary word dataset
- google-tts.js: Handles text-to-speech functionality

The app is designed to fit entirely on one screen without scrolling, with special attention to iOS-specific interface requirements like notch areas and safe zones. 