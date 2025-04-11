// Initialize Google TTS
const googleTTS = new GoogleTTSManager();

// Set the API key from config
googleTTS.setApiKey(config.googleTTSApiKey);

// DOM Elements
const vocabImage = document.getElementById('vocab-image');
const englishWord = document.getElementById('english-word');
const chineseWord = document.getElementById('chinese-word');
const translations = document.getElementById('translations');
const countdownProgress = document.querySelector('.countdown-progress');
const nextButton = document.getElementById('next-button');

// State
let currentWordIndex = 0;
let countdownTimeout;

// Initialize the app
function init() {
    // Set up event listeners
    nextButton.addEventListener('click', showNextWord);
    
    // Show first word
    showNextWord();
}

// Show the next vocabulary word
function showNextWord() {
    // Reset state
    clearTimeout(countdownTimeout);
    translations.classList.add('hidden');
    countdownProgress.style.transform = 'scaleX(1)';
    
    // Get current word
    const currentWord = vocabularyData[currentWordIndex];
    
    // Update image
    vocabImage.src = currentWord.image;
    
    // Start countdown
    startCountdown();
    
    // Move to next word index
    currentWordIndex = (currentWordIndex + 1) % vocabularyData.length;
}

// Start the countdown timer
function startCountdown() {
    // Reset progress bar
    countdownProgress.style.transform = 'scaleX(1)';
    
    // Start countdown animation
    countdownProgress.style.transform = 'scaleX(0)';
    
    // Show translations after 3 seconds
    countdownTimeout = setTimeout(() => {
        showTranslations();
    }, 3000);
}

// Show translations and play audio
function showTranslations() {
    const currentWord = vocabularyData[(currentWordIndex - 1 + vocabularyData.length) % vocabularyData.length];
    
    // Update translations
    englishWord.textContent = currentWord.english;
    chineseWord.textContent = currentWord.chinese;
    
    // Show translations
    translations.classList.remove('hidden');
    
    // Play audio
    googleTTS.speak(currentWord.english);
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', init); 