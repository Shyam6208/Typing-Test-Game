const textDisplay = document.getElementById("textDisplay");
const typingArea = document.getElementById("typingArea");
const startButton = document.getElementById("startButton");
const timerDisplay = document.getElementById("timerDisplay");
const wpmDisplay = document.getElementById("wpmDisplay");
const accuracyDisplay = document.getElementById("accuracyDisplay");
const accuracyBar = document.getElementById("accuracyFill");
const timeSelect = document.getElementById("timeSelect");

let testTexts = {
  30: [
    "it was the best of times it was the worst of times it was the age of wisdom it was the age of foolishness it was the epoch of belief ",
    "the epoch of incredulity it was the season of light it was the season of darkness it was the spring of hope it was the winter of despair ",
    "we had everything before us we were all going direct to heaven we were all going direct the other way"
  ],
  60: [
    "in the age of technology innovation drives progress at an unprecedented pace from artificial intelligence to quantum computing the tools",
    "we create shape the future of industries and societies alike embracing change and adapting to new challenges will empower us",
    "Web development includes coding, testing, and designing. A well-built website can attract many users and provide valuable information."
  ],
  120: [
    "success is not the key to happiness happiness is the key to success if you love what you are doing you will be successful the journey of a thousand miles begins with one step believe in yourself ",
    "Programming languages like JavaScript, Python, and Ruby offer developers various tools and libraries that simplify coding and debugging processes. However, mastering these languages requires time, dedication, and practice. A well-structured program is not just about solving a problem; it’s about solving it efficiently and in a way that others can understand and modify later.",
    "The evolution of technology has dramatically reshaped human civilization. From the invention of the wheel to the digital revolution, every milestone has brought new challenges and opportunities. Today, the internet connects billions of people across the world, allowing instant communication and access to vast amounts of information. As technology continues to advance, the need for cybersecurity, data privacy, and ethical AI usage becomes ever more critical."
  ]
};

let timeLimit = 30;
let timer;
let startTime;
let correctCharCount = 0;
let typingStarted = false;

startButton.addEventListener("click", startTest);

function startTest() {
  resetTest();
  
  timeLimit = parseInt(timeSelect.value);
  const testTextArray = testTexts[timeLimit];
  const randomIndex = Math.floor(Math.random() * testTextArray.length);
  const testText = testTextArray[randomIndex];
  displayText(testText);
  
  typingArea.disabled = false;
  typingArea.value = "";
  typingArea.focus();

  timerDisplay.textContent = `Time: ${timeLimit}s`;
}

function updateTimer() {
  const currentTime = new Date().getTime();
  const elapsed = Math.floor((currentTime - startTime) / 1000);
  const timeRemaining = timeLimit - elapsed;

  if (timeRemaining <= 0) {
    clearInterval(timer);
    typingArea.disabled = true;
    calculateWPM();
    calculateAccuracy();
    return;
  }

  timerDisplay.textContent = `Time: ${timeRemaining}s`;
}

function calculateWPM() {
  const elapsedMinutes = (new Date().getTime() - startTime) / 60000;
  const wordCount = correctCharCount / 5;
  const wpm = Math.floor(wordCount / elapsedMinutes);
  wpmDisplay.textContent = `WPM: ${wpm}`;
}

function calculateAccuracy() {
  const totalTypedChars = typingArea.value.length;
  const accuracy = totalTypedChars > 0 ? (correctCharCount / totalTypedChars) * 100 : 0;

  accuracyDisplay.textContent = `Accuracy: ${accuracy.toFixed(2)}%`;
  accuracyBar.style.width = `${accuracy}%`;
  accuracyBar.style.backgroundColor = accuracy > 80 ? 'green' : 'red'; // Change color based on performance
}

function displayText(text) {
  textDisplay.innerHTML = '';

  text.split('').forEach(char => {
    const span = document.createElement('span');
    span.textContent = char;
    textDisplay.appendChild(span);
  });
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

  // Highlight the current character
  const nextCharIndex = inputChars.length;
  if (textSpans[nextCharIndex]) {
    textSpans[nextCharIndex].classList.add('current');
  }

  calculateWPM();
  calculateAccuracy();
}

function resetTest() {
  clearInterval(timer);
  typingStarted = false;
  correctCharCount = 0;
  typingArea.disabled = true;
  typingArea.value = "";
  textDisplay.innerHTML = "";
  timerDisplay.textContent = `Time: ${timeLimit}s`;
  wpmDisplay.textContent = `WPM: 0`;
  accuracyDisplay.textContent = `Accuracy: 0%`;
  accuracyBar.style.width = `0%`;
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


// Event listener for typing input
typingArea.addEventListener("input", onInput);
