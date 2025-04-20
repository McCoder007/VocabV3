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
let audioElements = []; // Array to store preloaded audio elements
let lastPlayedAudioIndex = -1; // Keep track of the last played audio index

// Function to preload audio files
function preloadAudioFiles() {
    console.log('Preloading audio files...');
    // Create audio elements for each audio file (w1-w9)
    for (let i = 1; i <= 9; i++) {
        const audio = new Audio(`audio/w${i}.mp3`);
        audio.load(); // Preload the audio
        audioElements.push(audio);
    }
    console.log('Audio preloading initiated.');
}

// Function to play audio for the current word
function playWordAudio(index) {
    // First word always plays w1.mp3
    if (index === 0) {
        audioElements[0].currentTime = 0; // Reset to beginning
        audioElements[0].play();
        lastPlayedAudioIndex = 0;
    } else {
        // For other words, randomly select from w2-w9
        // But avoid the last played audio
        let randomIndex;
        do {
            randomIndex = 1 + Math.floor(Math.random() * 8); // Random index 1-8 (w2-w9)
        } while (randomIndex === lastPlayedAudioIndex);
        
        audioElements[randomIndex].currentTime = 0; // Reset to beginning
        audioElements[randomIndex].play();
        lastPlayedAudioIndex = randomIndex;
    }
}

// Function to preload images
function preloadImages() {
    console.log('Preloading images...');
    vocabularyData.forEach(item => {
        const img = new Image();
        img.src = item.image;
    });
    console.log('Image preloading initiated.');
}

function setupStartScreen() {
    // Ensure vocab card is hidden and start screen is shown initially
    // vocabularyCard.classList.add('hidden'); // No longer needed, uses card-hidden
    // startScreen.classList.remove('hidden'); // Start screen should be visible by default

    // Add listener to the start button
    startButton.addEventListener('click', () => {
        startScreen.style.display = 'none'; // Hide start screen directly
        vocabularyCard.classList.remove('card-hidden'); // Remove the card-hidden class
        initAppLogic(); // Call the main app initialization logic
    }, { once: true }); // Only allow starting once
}

// Initialize the main app logic (called after start button)
function initAppLogic() {
    // Instantiate the TTS Manager now that the config should be loaded and user interacted
    googleTTS = new GoogleTTSManager();

    // Start preloading images in the background
    preloadImages();
    
    // Preload audio files
    preloadAudioFiles();

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
    
    // Play audio for the current word
    playWordAudio(currentWordIndex);

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