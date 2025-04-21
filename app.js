// Declare googleTTS; will be initialized after DOM load
let googleTTS;

// API key is set in index.html

// DOM Elements
const vocabImage = document.getElementById('vocab-image');
const englishWord = document.getElementById('english-word');
const chineseWord = document.getElementById('chinese-word');
const translations = document.getElementById('translations');
const countdownProgress = document.querySelector('.countdown-progress');
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
const vocabularyCard = document.getElementById('vocabulary-card');
const actionButtons = document.getElementById('action-buttons');
const stillLearningButton = document.getElementById('still-learning-button');
const gotItButton = document.getElementById('got-it-button');
const progressBarContainer = document.getElementById('progress-bar-container');
const progressBar = document.getElementById('progress-bar');
const progressLabel = document.getElementById('progress-label');
const resetButton = document.getElementById('reset-button');
const appTitle = document.querySelector('.app-title');
const viewContainer = document.getElementById('view-container'); // Added view container

// Tab and List View Elements
const tabContainer = document.getElementById('tab-container');
const tabFlashcards = document.getElementById('tab-flashcards');
const tabLearning = document.getElementById('tab-learning');
const tabKnown = document.getElementById('tab-known');
const learningListView = document.getElementById('learning-list-view');
const knownListView = document.getElementById('known-list-view');
const learningListUl = document.getElementById('learning-list-ul');
const knownListUl = document.getElementById('known-list-ul');

// Constants for localStorage
const LOCAL_STORAGE_KEY = 'vocabProgressV3';

// State
let currentWordIndex = 0;
let countdownTimeout;
let isTransitioning = false;
let audioElements = []; // Array to store preloaded audio elements
let lastPlayedAudioIndex = -1; // Keep track of the last played audio index

// Function to update the progress bar and label
function updateProgressBar() {
    const totalWords = vocabularyData.length;
    const knownWords = vocabularyData.filter(word => word.status === 'known').length;
    const progressPercentage = totalWords > 0 ? Math.round((knownWords / totalWords) * 100) : 0;
    
    // Update progress bar width
    progressBar.style.width = `${progressPercentage}%`;
    
    // Update progress label text
    progressLabel.textContent = `Words Learned: ${progressPercentage}%`;

    // Keep console log for debugging if needed
    // console.log(`Progress: ${knownWords}/${totalWords} (${progressPercentage}%)`);
}

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
    // Ensure initial state: tabs and card hidden, start screen shown
    tabContainer.classList.add('hidden');
    vocabularyCard.classList.add('card-hidden');
    learningListView.classList.add('hidden');
    knownListView.classList.add('hidden');
    startScreen.style.display = 'flex'; // Make sure start screen is flex

    // Add listener to the start button
    startButton.addEventListener('click', () => {
        startScreen.style.display = 'none'; 
        tabContainer.classList.remove('hidden'); 
        vocabularyCard.classList.remove('card-hidden'); 
        setActiveTab(tabFlashcards);
        
        // Initialize word logic AFTER showing the card
        initAppLogic(); 
    });
}

// Function to set the active tab button
function setActiveTab(activeTabButton) {
    [tabFlashcards, tabLearning, tabKnown].forEach(button => {
        button.classList.remove('active');
    });
    activeTabButton.classList.add('active');
}

// Function to switch the main view
function switchView(viewToShow) { // viewToShow is the element to show
    // Hide all main views
    vocabularyCard.classList.add('card-hidden'); // Using card-hidden for consistency
    learningListView.classList.add('hidden');
    knownListView.classList.add('hidden');

    // Pause flashcard timer if switching away
    if (viewToShow !== vocabularyCard) {
        clearTimeout(countdownTimeout);
        console.log('Paused flashcard timer.');
    }

    // Show the target view
    if (viewToShow === vocabularyCard) {
        viewToShow.classList.remove('card-hidden');
    } else {
        viewToShow.classList.remove('hidden');
    }
    console.log("Switched view to:", viewToShow.id);
}

// Function to populate the learning list
function populateLearningList() {
    const learningWords = vocabularyData.filter(word => word.status === 'learning');
    learningListUl.innerHTML = ''; // Clear previous list
    if (learningWords.length === 0) {
        learningListUl.innerHTML = '<li>No words currently marked as learning.</li>';
        return;
    }
    learningWords.forEach(word => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${word.english}</span><span>${word.chinese}</span>`;
        learningListUl.appendChild(li);
    });
}

// Function to populate the known list
function populateKnownList() {
    const knownWords = vocabularyData.filter(word => word.status === 'known');
    knownListUl.innerHTML = ''; // Clear previous list
    if (knownWords.length === 0) {
        knownListUl.innerHTML = '<li>No words marked as known yet.</li>';
        return;
    }
    knownWords.forEach(word => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${word.english}</span><span>${word.chinese}</span>`;
        knownListUl.appendChild(li);
    });
}

// Function to save progress to localStorage
function saveProgress() {
    // Store only the status of each word, keyed by English word for robustness
    const progressToSave = {};
    vocabularyData.forEach((word, index) => {
        // Use English word as key, or index as fallback if needed
        const key = word.english || `word_${index}`; 
        progressToSave[key] = word.status;
    });
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progressToSave));
        console.log('Progress saved to localStorage');
    } catch (e) {
        console.error('Failed to save progress to localStorage:', e);
    }
}

// Function to load progress from localStorage
function loadProgress() {
    try {
        const savedProgress = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedProgress) {
            const parsedProgress = JSON.parse(savedProgress);
            console.log('Loading progress from localStorage...');
            let loadedCount = 0;
            vocabularyData.forEach((word, index) => {
                const key = word.english || `word_${index}`;
                if (parsedProgress[key]) {
                    word.status = parsedProgress[key];
                    loadedCount++;
                }
                // else: keep default 'new' status
            });
            console.log(`Loaded status for ${loadedCount} words.`);
        } else {
            console.log('No saved progress found.');
        }
    } catch (e) {
        console.error('Failed to load or parse progress from localStorage:', e);
        // Optional: Clear corrupted data
        // localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
}

// Function to reset all progress
function resetAllProgress() {
    console.log('Resetting all progress...');
    
    // 1. Clear localStorage & Reset data
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    vocabularyData.forEach(word => { word.status = 'new'; });
    currentWordIndex = 0;
    console.log('Cleared storage and reset statuses.');

    // 2. Update progress bar data (won't be visible yet)
    updateProgressBar();

    // 3. Reset UI to initial state
    tabContainer.classList.add('hidden'); // Hide tabs
    vocabularyCard.classList.add('card-hidden'); // Hide flashcard view
    learningListView.classList.add('hidden'); // Hide learning list
    knownListView.classList.add('hidden'); // Hide known list
    startScreen.style.display = 'flex'; // Show start screen

    // Clear any active timers
    clearTimeout(countdownTimeout);
    isTransitioning = false; 

    console.log('All progress has been reset! Click Start Learning to begin.'); 
}

// Initialize the main app logic (called after start button)
function initAppLogic() {
    // Load progress from localStorage first
    loadProgress();

    // Instantiate the TTS Manager
    googleTTS = new GoogleTTSManager();

    // Preload assets
    preloadImages();
    preloadAudioFiles();

    // Initialize progress bar based on potentially loaded state
    updateProgressBar(); 

    // Show the VERY FIRST word (index 0)
    showSpecificWord(0);
}

// Function to show a specific word by index (used for initialization)
function showSpecificWord(index) {
    if (isTransitioning) return; // Should not happen on init, but safety first
    isTransitioning = true;

    // Reset state
    clearTimeout(countdownTimeout);
    translations.classList.add('hidden');
    actionButtons.classList.add('hidden');

    // Set the current word index
    currentWordIndex = index;

    // Ensure index is valid
    if (currentWordIndex < 0 || currentWordIndex >= vocabularyData.length) {
        console.error("Invalid index provided to showSpecificWord:", index);
        isTransitioning = false;
        // Potentially show an error or the start screen?
        return;
    }

    const wordToShow = vocabularyData[currentWordIndex];

    // Update UI
    vocabImage.src = wordToShow.image;
    playWordAudio(currentWordIndex); // Will correctly play w1.mp3 if index is 0

    // Reset and start countdown animation
    countdownProgress.style.transition = 'none';
    countdownProgress.style.transform = 'scaleX(1)';
    void countdownProgress.offsetWidth;
    countdownProgress.style.transition = 'transform 3.6s linear';
    startCountdown();

    // Allow transitions again
    setTimeout(() => {
        isTransitioning = false;
    }, 100); 
}

// Function to get the index of the next word based on status
function getNextWordIndex() {
    const eligibleIndices = [];
    vocabularyData.forEach((word, index) => {
        if (word.status === 'new' || word.status === 'learning') {
            eligibleIndices.push(index);
        }
    });

    if (eligibleIndices.length === 0) {
        // ALL words are 'known'. Signal completion.
        console.log("All words marked as 'known'. Session complete.");
        return -1; // Use -1 to indicate completion
    }

    // Randomly select an index from the eligible pool
    let randomIndexInPool = Math.floor(Math.random() * eligibleIndices.length);
    let nextIndex = eligibleIndices[randomIndexInPool];

    // Avoid showing the same word twice in a row if possible and more than one choice exists
    if (eligibleIndices.length > 1 && nextIndex === currentWordIndex) {
        console.log('Avoiding immediate repeat, finding alternative...');
        randomIndexInPool = (randomIndexInPool + 1) % eligibleIndices.length;
        nextIndex = eligibleIndices[randomIndexInPool];
    }

    return nextIndex;
}

// Show the next vocabulary word (using the selection logic)
function showNextWord() {
    if (isTransitioning) return;
    isTransitioning = true;

    // Hide elements
    clearTimeout(countdownTimeout);
    translations.classList.add('hidden');
    actionButtons.classList.add('hidden');

    const nextIndex = getNextWordIndex();

    if (nextIndex === -1) {
        // Handle completion state
        console.log("Learning Complete! No more words to review.");
        // Display completion message
        englishWord.textContent = "Congratulations!";
        chineseWord.textContent = "All words learned!";
        translations.classList.remove('hidden'); // Show the message
        vocabImage.src = ""; // Clear image or show a completion image
        actionButtons.classList.add('hidden'); // Hide action buttons
        countdownProgress.style.transform = 'scaleX(0)'; // Hide progress bar
        isTransitioning = false; // Allow reset etc.
        return; // Stop here
    }
    
    currentWordIndex = nextIndex; 

    const wordToShow = vocabularyData[currentWordIndex];

    vocabImage.src = wordToShow.image;
    playWordAudio(currentWordIndex);

    countdownProgress.style.transition = 'none';
    countdownProgress.style.transform = 'scaleX(1)';
    void countdownProgress.offsetWidth;
    countdownProgress.style.transition = 'transform 3.6s linear';
    startCountdown();

    setTimeout(() => {
        isTransitioning = false;
    }, 100); 
}

// Start the countdown timer
function startCountdown() {
    // Start countdown animation
    countdownProgress.style.transform = 'scaleX(0)';
    
    // Show translations after 3.6 seconds
    countdownTimeout = setTimeout(() => {
        showTranslations();
    }, 3600);
}

// Show translations and play audio
function showTranslations() {
    const currentWord = vocabularyData[currentWordIndex]; 
    if (!currentWord) {
        console.error("Error: Could not find word data for index", currentWordIndex);
        return;
    }

    englishWord.textContent = currentWord.english;
    chineseWord.textContent = currentWord.chinese;
    
    // Reveal elements
    translations.classList.remove('hidden');
    actionButtons.classList.remove('hidden');
    
    // Play audio
    googleTTS.speak(currentWord.english);
}

// Initialize the start screen setup and add tab listeners when the page loads
document.addEventListener('DOMContentLoaded', () => {
    setupStartScreen();

    // Add listener for the reset button 
    const resetButtonElement = document.getElementById('reset-button');
    if (resetButtonElement) {
        resetButtonElement.addEventListener('click', resetAllProgress);
    } else {
        console.error('Reset button not found!');
    }

    // --- Add Tab Button Listeners ---
    tabFlashcards.addEventListener('click', () => {
        setActiveTab(tabFlashcards);
        switchView(vocabularyCard);
        // Refresh the static view of the current card
        showSpecificWord(currentWordIndex);
    });

    tabLearning.addEventListener('click', () => {
        setActiveTab(tabLearning);
        populateLearningList();
        switchView(learningListView);
    });

    tabKnown.addEventListener('click', () => {
        setActiveTab(tabKnown);
        populateKnownList();
        switchView(knownListView);
    });
    // --- End Tab Button Listeners ---

    // --- Moved Flashcard Button Listeners Here ---
    // Ensure these are only active when the flashcard view is visible?
    // No, state logic handles `isTransitioning` which prevents clicks during view switches.
    stillLearningButton.addEventListener('click', () => {
        if (!isTransitioning) {
            const shownWordIndex = currentWordIndex; 
            vocabularyData[shownWordIndex].status = 'learning';
            console.log(`Word "${vocabularyData[shownWordIndex].english}" marked as learning`);
            updateProgressBar();
            saveProgress(); 
            showNextWord(); // This handles getting the next word
        }
    });

    gotItButton.addEventListener('click', () => {
        if (!isTransitioning) {
            const shownWordIndex = currentWordIndex; 
            vocabularyData[shownWordIndex].status = 'known';
            console.log(`Word "${vocabularyData[shownWordIndex].english}" marked as known`);
            updateProgressBar();
            saveProgress(); 
            showNextWord(); // This handles getting the next word
        }
    });
    // --- End Flashcard Button Listeners ---

    // Add touch/click event listener to speak the word again when translations are visible
    translations.addEventListener('click', () => {
        // Only speak if translations are already visible (after countdown)
        if (!translations.classList.contains('hidden') && !isTransitioning) {
            const currentWord = vocabularyData[currentWordIndex];
            if (currentWord) {
                googleTTS.speak(currentWord.english);
                console.log(`Speaking word again: "${currentWord.english}"`);
            }
        }
    });

}); 