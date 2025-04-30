// Declare googleTTS; will be initialized after DOM load
let googleTTS;

// API key is set in index.html

// DOM Elements
const vocabImage = document.getElementById('vocab-image');
const englishWord = document.getElementById('english-word');
const chineseWord = document.getElementById('chinese-word');
const translations = document.getElementById('translations');
const countdownProgress = document.querySelector('.countdown-progress');
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

// Sets Menu Elements
const setsMenu = document.getElementById('sets-menu');
const setsList = document.getElementById('sets-list');
const backToStartButton = document.getElementById('back-to-start');

// Tab and List View Elements
const tabContainer = document.getElementById('tab-container');
const backToSetsButton = document.getElementById('back-to-sets');
const tabFlashcards = document.getElementById('tab-flashcards');
const tabLearning = document.getElementById('tab-learning');
const tabKnown = document.getElementById('tab-known');
const learningListView = document.getElementById('learning-list-view');
const knownListView = document.getElementById('known-list-view');
const learningListUl = document.getElementById('learning-list-ul');
const knownListUl = document.getElementById('known-list-ul');

// Constants for localStorage
const LOCAL_STORAGE_KEY = 'vocabProgressV3';
const ACTIVE_SET_KEY = 'activeVocabSetV3';

// State
let currentWordIndex = 0;
let countdownTimeout;
let isTransitioning = false;
let audioElements = []; // Array to store preloaded audio elements
let lastPlayedAudioIndex = -1; // Keep track of the last played audio index
let activeSetId = null; // Track which set is currently active

// Function to update the progress bar and label
function updateProgressBar() {
    const totalWords = vocabularyData.length;
    const knownWords = vocabularyData.filter(word => word.status === 'known').length;
    const progressPercentage = totalWords > 0 ? Math.round((knownWords / totalWords) * 100) : 0;
    
    // Update progress bar width (still using percentage for the visual bar)
    progressBar.style.width = `${progressPercentage}%`;
    
    // Update progress label text to show count instead of percentage
    progressLabel.textContent = `Words Learned: ${knownWords}/${totalWords}`;

    // Keep console log for debugging if needed
    // console.log(`Progress: ${knownWords}/${totalWords} (${progressPercentage}%)`);
}

// Function to preload audio files
function preloadAudioFiles() {
    console.log('Preloading audio files...');
    // Clear existing audio elements if any
    audioElements = [];
    
    // Create audio elements for each audio file (w1-w9)
    for (let i = 1; i <= 9; i++) {
        const audio = new Audio();
        
        // Add event listeners to track loading status
        audio.addEventListener('canplaythrough', () => {
            console.log(`Audio w${i}.mp3 loaded successfully and can play through`);
        });
        
        audio.addEventListener('error', (e) => {
            console.error(`Error loading audio w${i}.mp3:`, e);
        });
        
        // Set source and load
        audio.src = `audio/w${i}.mp3`;
        audio.load(); // Preload the audio
        audioElements.push(audio);
    }
    console.log('Audio preloading initiated for 9 files.');
}

// Function to play audio for the current word
function playWordAudio(index) {
    try {
        // Find an appropriate audio file to play
        let audioIndex = 0;
        
        if (index === 0) {
            // First word always plays w1.mp3
            audioIndex = 0;
        } else {
            // For other words, randomly select from w2-w9
            audioIndex = 1 + Math.floor(Math.random() * 8); // Random index 1-8 (w2-w9)
        }
        
        console.log(`Attempting to play audio w${audioIndex+1}.mp3`);
        
        // Simple direct approach - create and play immediately
        const audioPath = `audio/w${audioIndex+1}.mp3`;
        const audio = new Audio(audioPath);
        
        // Start playing immediately
        const playPromise = audio.play();
        
        // Handle any errors
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error(`Error playing ${audioPath}:`, error);
                
                // Try alternative audio file if this one fails
                const fallbackIndex = (audioIndex + 1) % 9; // Try the next audio file
                const fallbackPath = `audio/w${fallbackIndex+1}.mp3`;
                console.log(`Trying fallback audio ${fallbackPath}`);
                
                // Simple fallback
                setTimeout(() => {
                    new Audio(fallbackPath).play().catch(e => {
                        console.error(`Fallback audio also failed:`, e);
                    });
                }, 100);
            });
        }
        
        lastPlayedAudioIndex = audioIndex;
    } catch (error) {
        console.error('Unexpected error in playWordAudio:', error);
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
    // Ensure initial state: tabs and card hidden
    tabContainer.classList.add('hidden');
    vocabularyCard.classList.add('card-hidden');
    learningListView.classList.add('hidden');
    knownListView.classList.add('hidden');
    
    // Show sets menu directly
    showSetsMenu();

    // Refresh button listener
    backToStartButton.addEventListener('click', () => {
        showSetsMenu(); // Just refresh the sets menu
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

// Function to display the sets menu
function showSetsMenu() {
    console.log('Showing sets menu - clearing existing buttons');
    // Clear existing set buttons
    setsList.innerHTML = '';
    
    console.log('Creating buttons for each set - vocabularySets:', vocabularySets);
    // Create buttons for each vocabulary set
    vocabularySets.forEach(set => {
        const setButton = document.createElement('button');
        setButton.classList.add('set-button');
        setButton.dataset.setId = set.id;
        
        const wordCount = set.words.length;
        
        // Create inner structure for the set button
        setButton.innerHTML = `
            <span class="set-name">${set.name}</span>
            <span class="word-count">${wordCount} words</span>
        `;
        
        // Add click event to load the selected set
        setButton.addEventListener('click', () => {
            loadVocabularySet(set.id);
        });
        
        setsList.appendChild(setButton);
    });
    
    console.log('Removing hidden class from sets menu');
    // Show the sets menu
    setsMenu.classList.remove('hidden');
}

// Function to load a specific vocabulary set
function loadVocabularySet(setId) {
    // Find the selected set
    const selectedSet = vocabularySets.find(set => set.id === setId);
    
    if (!selectedSet) {
        console.error(`Vocabulary set with ID ${setId} not found`);
        return;
    }
    
    // Update active set ID
    activeSetId = setId;
    
    // Save active set to localStorage
    localStorage.setItem(ACTIVE_SET_KEY, activeSetId);
    
    // Load vocabulary data from the selected set
    vocabularyData = [...selectedSet.words];
    
    // Load progress from localStorage
    loadProgress();
    
    // Hide sets menu
    setsMenu.classList.add('hidden');
    
    // Show tabs and vocabulary card
    tabContainer.classList.remove('hidden');
    vocabularyCard.classList.remove('card-hidden');
    setActiveTab(tabFlashcards);
    
    // Initialize app logic
    initAppLogic();
}

// Function to save progress to localStorage
function saveProgress() {
    if (!activeSetId) return;
    
    try {
        // Create object to store set-specific progress
        const progressData = {
            setId: activeSetId,
            words: vocabularyData.map(word => ({
                english: word.english,
                status: word.status
            }))
        };
        
        // Store in localStorage with set-specific key
        const storageKey = `${LOCAL_STORAGE_KEY}_${activeSetId}`;
        localStorage.setItem(storageKey, JSON.stringify(progressData));
        
        console.log(`Progress saved for set ${activeSetId}`);
    } catch (e) {
        console.error('Error saving progress:', e);
    }
}

// Function to load progress from localStorage
function loadProgress() {
    if (!activeSetId) return;
    
    try {
        // Get set-specific progress from localStorage
        const storageKey = `${LOCAL_STORAGE_KEY}_${activeSetId}`;
        const savedData = localStorage.getItem(storageKey);
        
        if (savedData) {
            const progressData = JSON.parse(savedData);
            
            // Update status for matching words
            if (progressData.words && progressData.words.length > 0) {
                progressData.words.forEach(savedWord => {
                    const wordToUpdate = vocabularyData.find(word => word.english === savedWord.english);
                    if (wordToUpdate) {
                        wordToUpdate.status = savedWord.status;
                    }
                });
            }
            
            console.log(`Progress loaded for set ${activeSetId}`);
        } else {
            console.log(`No saved progress found for set ${activeSetId}`);
        }
    } catch (e) {
        console.error('Error loading progress:', e);
    }
    
    // Update progress bar based on loaded data
    updateProgressBar();
}

// Function to reset progress
function resetAllProgress() {
    if (!activeSetId) return;
    
    // Confirmation before resetting
    if (!confirm('This will reset all progress for the current word set. Continue?')) {
        return;
    }
    
    // Reset all words in the current set to 'new' status
    vocabularyData.forEach(word => {
        word.status = 'new';
    });
    
    // Update the progress bar to reflect reset
    updateProgressBar();
    
    // Save the reset progress to localStorage
    saveProgress();
    
    // Reset UI state
    clearTimeout(countdownTimeout);
    isTransitioning = false;
    
    // Return to the set menu
    setsMenu.classList.remove('hidden');
    tabContainer.classList.add('hidden');
    vocabularyCard.classList.add('card-hidden');
    
    console.log(`All progress has been reset for set ${activeSetId}!`);
}

// Initialize the main app logic (called after set selection)
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

    // Get a random initial word instead of always starting with index 0
    const randomInitialIndex = getRandomWordIndex();
    showSpecificWord(randomInitialIndex);
}

// Helper function to get a random word index
function getRandomWordIndex() {
    if (!vocabularyData || vocabularyData.length === 0) {
        return 0;
    }
    return Math.floor(Math.random() * vocabularyData.length);
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
    // Check if there was a previously active set
    activeSetId = localStorage.getItem(ACTIVE_SET_KEY);
    
    // If there was a previously active set, load it
    if (activeSetId) {
        const selectedSet = vocabularySets.find(set => set.id === activeSetId);
        if (selectedSet) {
            // Load the words from the previously active set
            vocabularyData = [...selectedSet.words];
            // Load progress for this set
            loadProgress();
        } else {
            // If the set wasn't found, clear the stored active set
            localStorage.removeItem(ACTIVE_SET_KEY);
            activeSetId = null;
        }
    }

    // Initialize the Google TTS manager
    googleTTS = new GoogleTTSManager();
    
    // Set up the start screen (which will show the sets menu)
    setupStartScreen();
    
    // Add listener for the reset button 
    const resetButtonElement = document.getElementById('reset-button');
    if (resetButtonElement) {
        resetButtonElement.addEventListener('click', resetAllProgress);
    } else {
        console.error('Reset button not found!');
    }

    // Add listener for the back to sets button
    backToSetsButton.addEventListener('click', () => {
        // Stop any running countdowns
        clearTimeout(countdownTimeout);
        
        // Hide the flashcard interface
        tabContainer.classList.add('hidden');
        vocabularyCard.classList.add('card-hidden');
        
        // Show the sets menu
        showSetsMenu();
    });

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

    // --- Add Button Listeners for Word Actions ---
    stillLearningButton.addEventListener('click', () => {
        if (isTransitioning) return;
        
        // Update word status to 'learning'
        vocabularyData[currentWordIndex].status = 'learning';
        
        // Save progress
        saveProgress();
        
        // Update progress bar
        updateProgressBar();
        
        // Show next word
        showNextWord();
    });

    gotItButton.addEventListener('click', () => {
        if (isTransitioning) return;
        
        // Update word status to 'known'
        vocabularyData[currentWordIndex].status = 'known';
        
        // Save progress
        saveProgress();
        
        // Update progress bar
        updateProgressBar();
        
        // Show next word
        showNextWord();
    });

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