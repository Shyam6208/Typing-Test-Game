const textDisplay = document.getElementById("textDisplay");
const typingArea = document.getElementById("typingArea");
const startButton = document.getElementById("startButton");
const timerDisplay = document.getElementById("timerDisplay");
const wpmDisplay = document.getElementById("wpmDisplay");
const accuracyDisplay = document.getElementById('accuracyDisplay');
const accuracyBar = document.getElementById('accuracyFill');
const timeSelect = document.getElementById("timeSelect");

let testTexts = {
  30: "few word still both people off hand over most fact present man no own should when face day group open life of such public can increase like little fact home like person all say tell good well",
  60: "the quick brown fox jumps over the lazy dog while another creature waits in the shadow, preparing for a leap to the next challenge that would test agility and wit,programming languages like JavaScript and Python are often used to build web applications, which are interactive and require user input to function properly, offering vast possibilities to developers",
  120: "The quick brown fox jumps over the lazy dog near the riverbank. It was a bright and sunny day, with the wind blowing gently through the trees. Birds were chirping, and the leaves rustled softly as the breeze passed by. In the distance, children could be heard laughing and playing, their voices echoing across the park. Suddenly, a loud noise interrupted the peaceful scene. Everyone paused for a moment, looking around to see what had happened."
};

let timeLimit = 30;
let timer;
let startTime;
let isRunning = false;
let cursorSpan;
let wordIndex = 0;
let wordCount = 0;
let correctWordCount = 0;  // Counter for correct words
let typingStarted = false;  // Flag to check if typing has started

function startTest() {
  resetTest();  // Reset everything when starting a new test
  
  timeLimit = parseInt(timeSelect.value); // Get the new selected time
  testText = testTexts[timeLimit]; // Choose the text based on the selected time
  displayText(testText); // Display the selected text
  
  typingArea.disabled = false;
  typingArea.value = "";
  typingArea.focus();

  timerDisplay.textContent = `Time: ${timeLimit}s`;

  typingArea.addEventListener("input", onInput);
}

function updateTimer() {
  const currentTime = new Date().getTime();
  const elapsed = Math.floor((currentTime - startTime) / 1000);
  const timeRemaining = timeLimit - elapsed;

  if (timeRemaining <= 0) {
    clearInterval(timer);
    typingArea.disabled = true;
    calculateWPM();
    calculateAccuracy(); // Show accuracy at the end of the test
    return;
  }

  timerDisplay.textContent = `Time: ${timeRemaining}s`;
}

function calculateWPM() {
  const elapsedMinutes = (new Date().getTime() - startTime) / 60000; // Convert milliseconds to minutes
  const wpm = Math.floor(correctWordCount / elapsedMinutes);  // WPM based on correct words only
  wpmDisplay.textContent = `WPM: ${wpm}`;
}

function calculateAccuracy() {
  const totalTypedWords = wordCount;  // Total words typed (correct + incorrect)
  const accuracy = (correctWordCount / totalTypedWords) * 100;  // Calculate accuracy percentage
  
  // Update accuracy display and progress bar
  accuracyDisplay.textContent = `Accuracy: ${accuracy.toFixed(2)}%`;
  accuracyBar.style.width = `${accuracy}%`;  // Fill the progress bar according to accuracy
}

function displayText(text) {
  const words = text.split(' ');
  textDisplay.innerHTML = ''; // Clear the text display

  words.forEach(word => {
    const span = document.createElement('span');
    span.textContent = word;
    textDisplay.appendChild(span);
  });

  cursorSpan = document.createElement('span');
  cursorSpan.classList.add('cursor');
  textDisplay.appendChild(cursorSpan);
}

function onInput() {
  if (!typingStarted) {  // Start timer only when typing starts
    startTime = new Date().getTime();
    typingStarted = true;
    timer = setInterval(updateTimer, 1000);
  }

  const inputWords = typingArea.value.trim().split(' ');
  const textSpans = textDisplay.querySelectorAll("span");

  wordCount = inputWords.length;  // Update the total word count typed

  correctWordCount = 0;  // Reset correct word counter for this input check

  textSpans.forEach((wordSpan, index) => {
    const inputWord = inputWords[index];
    if (inputWord) {
      const actualWord = wordSpan.textContent;
      if (inputWord === actualWord) {
        wordSpan.classList.add('correct');
        wordSpan.classList.remove('incorrect');
        correctWordCount++;  // Increment correct word count if match
      } else {
        wordSpan.classList.add('incorrect');
        wordSpan.classList.remove('correct');
      }
    } else {
      wordSpan.classList.remove('correct', 'incorrect');
    }
  });

  moveCursor(inputWords.length);

  calculateWPM();  // Update WPM dynamically for correct words only
  calculateAccuracy();  // Update accuracy dynamically
}

function moveCursor(position) {
  const textSpans = textDisplay.querySelectorAll("span");
  if (cursorSpan && textSpans[position]) {
    textSpans[position].before(cursorSpan);
  } else {
    textDisplay.appendChild(cursorSpan);
  }
}

function resetTest() {
  clearInterval(timer); // Clear the timer if it's running
  isRunning = false;
  typingStarted = false; // Reset typingStarted flag
  wordIndex = 0;
  wordCount = 0;
  correctWordCount = 0;  // Reset correct word count
  typingArea.disabled = true;
  typingArea.value = "";
  textDisplay.innerHTML = ""; // Clear the text display
  timerDisplay.textContent = `Time: ${timeLimit}s`; // Reset the timer display
  wpmDisplay.textContent = `WPM: 0`; // Reset WPM display
  accuracyDisplay.textContent = `Accuracy: 0%`;  // Reset accuracy display
  accuracyBar.style.width = `0%`;  // Reset accuracy bar
}
function onInput() {
  if (!typingStarted) {
    startTime = new Date().getTime();
    typingStarted = true;
    timer = setInterval(updateTimer, 1000);
  }

  const inputChars = typingArea.value.split('');
  const textSpans = textDisplay.querySelectorAll("span");

  correctCharCount = 0;

  textSpans.forEach((charSpan, index) => {
    const inputChar = inputChars[index];
    if (inputChar == null) {
      charSpan.classList.remove('correct', 'incorrect', 'current');
    } else if (inputChar === charSpan.textContent) {
      charSpan.classList.add('correct');
      charSpan.classList.remove('incorrect');
      correctCharCount++;
    } else {
      charSpan.classList.add('incorrect');
      charSpan.classList.remove('correct');
    }
  });

  // Set the current character style and keep it within view
  const nextCharIndex = inputChars.length;
  if (textSpans[nextCharIndex]) {
    textSpans.forEach((span) => span.classList.remove('current'));
    textSpans[nextCharIndex].classList.add('current');

    // Calculate position to keep the current character within view
    const currentChar = textSpans[nextCharIndex];
    const offset = currentChar.offsetLeft - textDisplay.offsetWidth / 2 + currentChar.offsetWidth / 2;
    textDisplay.scrollLeft = offset;
  }

  calculateWPM();
  calculateAccuracy();
}


startButton.addEventListener("click", startTest);
