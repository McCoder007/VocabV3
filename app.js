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
    
    // Reset translations
    translations.classList.add('hidden');
    englishWord.textContent = '';
    chineseWord.textContent = '';
    
    // Reset progress bar with a small delay to ensure proper transition
    setTimeout(() => {
        countdownProgress.style.transition = 'none';
        countdownProgress.style.transform = 'scaleX(1)';
        
        // Force reflow to ensure the transition is reset
        void countdownProgress.offsetWidth;
        
        // Restore transition
        countdownProgress.style.transition = 'transform 3s linear';
        
        // Get current word
        const currentWord = vocabularyData[currentWordIndex];
        
        // Update image
        vocabImage.src = currentWord.image;
        
        // Start countdown
        startCountdown();
        
        // Move to next word index
        currentWordIndex = (currentWordIndex + 1) % vocabularyData.length;
        
        // Allow transitions again after a short delay
        setTimeout(() => {
            isTransitioning = false;
        }, 300);
    }, 10);
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