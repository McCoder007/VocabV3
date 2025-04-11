// Declare googleTTS; will be initialized after DOM load
let googleTTS;

// API key is set in index.html

// DOM Elements
const vocabImage = document.getElementById('vocab-image');
const englishWord = document.getElementById('english-word');
const chineseWord = document.getElementById('chinese-word');
const translations = document.getElementById('translations');
const countdownProgress = document.querySelector('.countdown-progress');
const nextButton = document.getElementById('next-button');
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
const vocabularyCard = document.getElementById('vocabulary-card');

// State
let currentWordIndex = 0;
let countdownTimeout;
let isTransitioning = false;

function setupStartScreen() {
    // Ensure vocab card is hidden and start screen is shown initially
    vocabularyCard.classList.add('hidden');
    startScreen.classList.remove('hidden');

    // Add listener to the start button
    startButton.addEventListener('click', () => {
        startScreen.classList.add('hidden');
        vocabularyCard.classList.remove('hidden');
        initAppLogic(); // Call the main app initialization logic
    }, { once: true }); // Only allow starting once
}

// Initialize the main app logic (called after start button)
function initAppLogic() {
    // Instantiate the TTS Manager now that the config should be loaded and user interacted
    googleTTS = new GoogleTTSManager();

    // Set up event listeners
    nextButton.addEventListener('click', () => {
        if (!isTransitioning) {
            showNextWord();
        }
    });
    
    // Show first word
    showNextWord();
}

// Show the next vocabulary word
function showNextWord() {
    // Prevent rapid clicking
    if (isTransitioning) return;
    isTransitioning = true;

    // Reset state
    clearTimeout(countdownTimeout);

    // Reset translations visibility
    translations.classList.add('hidden');
    // Optionally clear content if needed, but hiding might be enough
    // englishWord.textContent = '';
    // chineseWord.textContent = '';

    // Get current word data BEFORE updating the index
    const wordToShow = vocabularyData[currentWordIndex];

    // Update image IMMEDIATELY
    vocabImage.src = wordToShow.image;

    // Reset progress bar animation
    countdownProgress.style.transition = 'none';
    countdownProgress.style.transform = 'scaleX(1)';
    // Force reflow might still be useful here to ensure reset applies before transition starts
    void countdownProgress.offsetWidth;
    countdownProgress.style.transition = 'transform 3s linear';

    // Start countdown (which also handles the animation start)
    startCountdown();

    // Move to next word index for the *next* call
    currentWordIndex = (currentWordIndex + 1) % vocabularyData.length;

    // Allow transitions again after a short delay (can be adjusted)
    setTimeout(() => {
        isTransitioning = false;
    }, 100); // Reduced delay, adjust as needed
}

// Start the countdown timer
function startCountdown() {
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

// Initialize the start screen setup when the page loads
document.addEventListener('DOMContentLoaded', setupStartScreen); 