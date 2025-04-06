// Modal and UI handling functions
function showGreetingBox() {
  document.getElementById('greeting_box').classList.remove('hidden');
  document.getElementById('overlay').classList.remove('hidden');
  document.getElementById('home-screen').classList.add('blurred');
}

function closeGreetingBox() {
  document.getElementById('greeting_box').classList.add('hidden');
  document.getElementById('overlay').classList.add('hidden');
  document.getElementById('home-screen').classList.remove('blurred');
}

function showRulesBox() {
  document.getElementById('greeting_box').classList.add('hidden');
  document.getElementById('rules_box').classList.remove('hidden');
}

function closeRulesBox() {
  document.getElementById('rules_box').classList.add('hidden');
  document.getElementById('overlay').classList.add('hidden');
  document.getElementById('home-screen').classList.remove('blurred');
}

function startQuiz() {
  let playerName = document.getElementById('player_name').value.trim();
  
  if (playerName === "") {
    alert("Please enter your name!");
  } else {
    // Store player name in localStorage to use it on quiz page
    localStorage.setItem('playerName', playerName);
    alert("Good Luck, " + playerName + "! Let's start the quiz!");
    
    // Initialize streak counter
    localStorage.setItem('currentStreak', '0');
    
    // Redirect to the quiz page
    window.location.href = "quiz.html";
  }
}

function getRandomQuestions() {
  let shuffled = questions.sort(() => 0.5 - Math.random()); // Shuffle array
  return shuffled.slice(0, 10); // Select first 10 questions
}

let questions = [
  { question: "Maria has 7 apples and her friend gave her 5 more. How many apples does Maria have in all?", choices: ["A) 10", "C) 12", "B) 11", "D) 13"], answer: "C) 12" },
  { question: "There are 12 birds sitting on a tree. 4 birds flew away. How many birds are left on the tree?", choices: ["A) 6", "C) 10", "B) 8", "D) 16"], answer: "B) 8" },
  { question: "Jose has 10 candies. He wants to share them equally with his 2 friends. How many candies will each friend get?", choices: ["A) 3", "C) 8", "B) 5", "D) 12"], answer: "B) 5" },
  { question: "A pencil costs 5 pesos. How much will 3 pencils cost?", choices: ["A) Php 7", "C) Php 15", "B) Php 12", "D) Php 20"], answer: "C) Php 15" },
  { question: "Lina baked 15 cookies. Her family ate 8 cookies. How many cookies are left?", choices: ["A) 5", "C) 7", "B) 6", "D) 23"], answer: "C) 7" },
  { question: "There are 6 red balloons and 9 blue balloons at the party. How many balloons are there in total?", choices: ["A) 12", "C) 14", "B) 13", "D) 15"], answer: "D) 15" },
  { question: "Sarah has 4 groups of stickers. Each group has 5 stickers. How many stickers does Sarah have?", choices: ["A) 16", "C) 20", "B) 24", "D) 25"], answer: "C) 20" },
  { question: "A flower has 5 petals. How many petals do 4 flowers have?", choices: ["A) 15", "C) 20", "B) 25", "D) 9"], answer: "C) 20" },
  { question: "There are 20 students in the class. Half of them are girls. How many girls are in the class?", choices: ["A) 5", "C) 15", "B) 10", "D) 22"], answer: "B) 10" },
  { question: "A farmer planted 16 seeds in a row. If he planted another row with the same number of seeds, how many seeds did he plant in total?", choices: ["A) 22", "C) 30", "B) 32", "D) 16"], answer: "B) 32" },
  { question: "Anna has 11 marbles. She lost 3 marbles. How many marbles does she have now?", choices: ["A) 14", "C) 7", "B) 8", "D) 9"], answer: "B) 8" },
  { question: "There are 9 mangoes in a basket. If you add 7 more mangoes, how many mangoes will be in the basket?", choices: ["A) 14", "C) 16", "B) 17", "D) 2"], answer: "C) 16" },
  { question: "A storybook has 30 pages. Lisa has read 10 pages. How many more pages does she need to read?", choices: ["A) 40", "C) 15", "B) 20", "D) 30"], answer: "B) 20" },
  { question: "There are 5 tricycles parked in a row. Each tricycle has 3 wheels. How many wheels are there in total?", choices: ["A) 10", "C) 15", "B) 8", "D) 20"], answer: "C) 15" },
  { question: "Carlo has 14 toy soldiers. He gives 6 toy soldiers to his brother. How many toy soldiers does Carlo have left?", choices: ["A) 20", "C) 10", "B) 8", "D) 7"], answer: "B) 8" },
  { question: "There are 8 yellow ducks and 6 white ducks in the pond. How many ducks are there altogether?", choices: ["A) 12", "C) 14", "B) 15", "D) 2"], answer: "C) 14" },
  { question: "Mother bought 2 packs of juice. Each pack has 6 juice boxes. How many juice boxes did Mother buy?", choices: ["A) 4", "C) 8", "B) 12", "D) 18"], answer: "B) 12" },
  { question: "There are 18 cupcakes on a tray. If 9 cupcakes are eaten, how many cupcakes are left?", choices: ["A) 27", "C) 8", "B) 9", "D) 11"], answer: "B) 9" },
  { question: "A notebook costs 10 pesos. How much will 2 notebooks cost?", choices: ["A) 5 pesos", "C) 20 pesos", "B) 12 pesos", "D) 8 pesos"], answer: "C) 20 pesos" },
  { question: "Ben has 25 pesos. He wants to buy a toy car that costs 18 pesos. How much change will he get?", choices: ["A) Php 5", "C) Php 8", "B) Php 7", "D) Php 13"], answer: "B) Php 7" }
];

let randomquestions = [];
let currentQuestionIndex = 0;
let timer;
let score = 0;
let resizeTimeout; // For debouncing resize events

// Ensure resize events are properly handled
window.addEventListener('resize', handleResize);
window.addEventListener('orientationchange', handleResize);

// Improved resize handler with debouncing
function handleResize() {
  // Clear any existing timeout to prevent multiple rapid executions
  clearTimeout(resizeTimeout);
  
  // Set a small timeout to allow browser to complete resize/reflow
  resizeTimeout = setTimeout(function() {
    updateBackgroundPosition();
    adjustLayout();
  }, 100);
}

function loadQuestion() {
  if (currentQuestionIndex >= randomquestions.length) {
    endQuiz();
    return;
  }
  
  let questionData = randomquestions[currentQuestionIndex];
  document.getElementById("question-number").innerText = currentQuestionIndex + 1;
  document.getElementById("question").innerText = questionData.question;
  
  let choicesContainer = document.getElementById("choices");
  choicesContainer.innerHTML = "";
  
  questionData.choices.forEach(choice => {
    let btn = document.createElement("button");
    btn.innerText = choice;
    
    // Base button styling - we'll adjust size in adjustLayout()
    btn.className = "bg-white hover:bg-yellow-400 rounded-full question-text flex justify-center mx-auto border-2 border-black";
    
    btn.onclick = () => checkAnswer(choice, questionData.answer);
    choicesContainer.appendChild(btn);
  });
  
  startTimer();
  
  // Apply responsive layout immediately
  adjustLayout();
}

// Function to track and save streaks during the quiz
function trackStreak(isCorrect) {
  let currentStreak = parseInt(localStorage.getItem('currentStreak') || '0');
  
  if (isCorrect) {
    // Increment streak for correct answer
    currentStreak++;
  } else {
    // Reset streak for incorrect answer
    currentStreak = 0;
  }
  
  // Save the updated streak
  localStorage.setItem('currentStreak', currentStreak.toString());
  
  // Update best streak if current streak is higher
  const bestStreak = parseInt(localStorage.getItem('bestStreak') || '0');
  if (currentStreak > bestStreak) {
    localStorage.setItem('bestStreak', currentStreak.toString());
  }
  
  return currentStreak;
}

function checkAnswer(selected, correct) {
  clearInterval(timer);
  let buttons = document.querySelectorAll("#choices button");
  
  const isCorrect = selected === correct;
  
  // Update streak
  const currentStreak = trackStreak(isCorrect);

  buttons.forEach(btn => { 
    if (btn.innerText === correct) {
      btn.classList.add("!bg-green-500", "!text-white"); // Correct answer turns green
    } 
    if (btn.innerText === selected && selected !== correct) {
      btn.classList.add("!bg-red-500", "!text-white"); // Incorrect choice turns red
    }

    btn.disabled = true; // Disable buttons after selection
  });
  
  // Update score if answer is correct
  if (selected === correct) {
    score++;
    localStorage.setItem('quizScore', score);
  }

  setTimeout(() => {
    nextQuestion();
  }, 1500); // Move to the next question after a short delay
}

function nextQuestion() {
  currentQuestionIndex++;
  loadQuestion();
}

function startTimer() {
  let timeLeft = 19;
  clearInterval(timer);
  
  // Update timer display
  const timerElement = document.getElementById("timer");
  timerElement.innerText = timeLeft;
  
  timer = setInterval(() => {
      timeLeft--;
      timerElement.innerText = timeLeft;

      // Add styling but don't override existing classes
      timerElement.classList.add(
          "bg-yellow-400", "text-black", "font-bold", 
          "rounded-3xl", "text-center", "flex", "items-center", "justify-center"
      );

      if (timeLeft === 0) {
          clearInterval(timer);
          // Use a more mobile-friendly approach than alert
          showMessage("Time's up!");
          
          // Time's up means incorrect answer - update streak
          trackStreak(false);
          
          setTimeout(() => {
              nextQuestion();
          }, 1000);
      }
  }, 1000);
}

// Create a non-blocking message display
function showMessage(message) {
  // Check if message container exists, create if not
  let messageContainer = document.getElementById("message-container");
  if (!messageContainer) {
    messageContainer = document.createElement("div");
    messageContainer.id = "message-container";
    messageContainer.className = "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-xl shadow-lg z-50 text-center";
    document.body.appendChild(messageContainer);
  }
  
  messageContainer.textContent = message;
  messageContainer.style.display = "block";
  
  setTimeout(() => {
    messageContainer.style.display = "none";
  }, 1500);
}

function endQuiz() {
  // Save final score to localStorage
  localStorage.setItem('quizScore', score);
  localStorage.setItem('totalQuestions', randomquestions.length);
  
  // Redirect to results page
  window.location.href = 'results.html';
}

function goBack() {
  let confirmExit = confirm("Are you sure you want to exit the quiz?");
  if (confirmExit) {
    window.location.href = 'index.html';
  }
}

function updateBackgroundPosition() {
  const bg = document.querySelector('.bg-container');
  if (!bg) return;
  
  const screenHeight = window.innerHeight;
  const screenWidth = window.innerWidth;

  // Dynamically calculate position — adjust formula as desired
  const verticalPosition = Math.min(50, (screenWidth / screenHeight) * 25); // max 50%

  bg.style.backgroundPosition = `center ${verticalPosition}%`;
}

function adjustLayout() {
  // Adjust button sizes based on screen size
  const choiceButtons = document.querySelectorAll("#choices button");
  const isMobile = window.innerWidth < 900;
  
  choiceButtons.forEach(btn => {
    // Remove all size classes first
    btn.classList.remove("py-4", "px-30", "text-2xl", "py-2", "px-3", "text-lg", "w-full");
    
    // Apply appropriate size classes based on current screen size
    if (isMobile) {
      btn.classList.add("py-2", "px-3", "text-lg", "w-full");
    } else {
      btn.classList.add("py-4", "px-30", "text-2xl");
    }
  });
  
  // Adjust question font size
  const questionElement = document.getElementById("question");
  if (questionElement) {
    questionElement.classList.remove("text-5xl", "text-3xl");
    if (isMobile) {
      questionElement.classList.add("text-3xl");
    } else {
      questionElement.classList.add("text-5xl");
    }
  }
}

/**
 * Updates the quiz results page with actual quiz statistics
 * This function should be called when the results page loads
 */
function updateQuizResults() {
  // Retrieve data from localStorage
  const score = parseInt(localStorage.getItem('quizScore') || '0');
  const totalQuestions = parseInt(localStorage.getItem('totalQuestions') || '10');
  const streak = parseInt(localStorage.getItem('currentStreak') || '0');
  
  // Calculate statistics
  const accuracy = Math.round((score / totalQuestions) * 100);
  const incorrect = totalQuestions - score;
  
  // Update the DOM elements
  const accuracyValue = document.querySelector('.accuracy-value');
  if (accuracyValue) {
    accuracyValue.textContent = `${accuracy}%`;
  }
  
  // Update the statistics in the badges
  const correctBadge = document.querySelector('.correct-badge .stat-value');
  if (correctBadge) {
    correctBadge.textContent = score;
  }
  
  const incorrectBadge = document.querySelector('.incorrect-badge .stat-value');
  if (incorrectBadge) {
    incorrectBadge.textContent = incorrect;
  }
  
  const streakBadge = document.querySelector('.streak-badge .stat-value');
  if (streakBadge) {
    streakBadge.textContent = streak;
  }
  
  // Update heading based on performance
  const headingElement = document.querySelector('.result-heading');
  if (headingElement) {
    if (accuracy >= 80) {
      headingElement.textContent = 'Great Job!';
    } else if (accuracy >= 50) {
      headingElement.textContent = 'Good Try!';
    } else {
      headingElement.textContent = 'Keep Practicing!';
    }
  }
  
  // Update player name if available
  const playerName = localStorage.getItem('playerName');
  const playerNameElement = document.querySelector('.player-name');
  if (playerNameElement && playerName) {
    playerNameElement.textContent = playerName;
  }
  
  // Log confirmation that the results were updated
  console.log(`Quiz results updated: ${score}/${totalQuestions} correct (${accuracy}%)`);
}

// Initialize quiz
function initQuiz() {
  // Reset score
  score = 0;
  currentQuestionIndex = 0;
  
  // Get new set of random questions
  randomquestions = getRandomQuestions();
  
  // Display player name if available
  const playerName = localStorage.getItem('playerName');
  if (playerName) {
    const playerNameElement = document.getElementById("player-name");
    if (playerNameElement) {
      playerNameElement.textContent = playerName;
    }
  }
  
  // Apply initial layout
  adjustLayout();
  
  // Load first question
  loadQuestion();
}

// Initialize the page when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Check what page we're on
  const isQuizPage = window.location.pathname.includes('quiz.html');
  const isResultsPage = window.location.pathname.includes('results.html');
  
  // Add event listener to overlay if it exists
  const overlay = document.getElementById('overlay');
  if (overlay) {
    overlay.addEventListener('click', function() {
      closeGreetingBox();
      closeRulesBox();
    });
  }
  
  // Apply initial layout immediately
  adjustLayout();
  updateBackgroundPosition();
  
  // Initialize quiz if on quiz page
  if (isQuizPage) {
    initQuiz();
  }
  
  // Update results if on results page
  if (isResultsPage) {
    updateQuizResults();
  }
});

// Initialize on window load to ensure all resources are loaded
window.onload = function() {
  // Run another layout adjustment after full page load
  adjustLayout();
  updateBackgroundPosition();
  
  // Initialize quiz if on quiz page and hasn't been initialized yet
  if (window.location.pathname.includes('quiz.html') && currentQuestionIndex === 0 && randomquestions.length === 0) {
    initQuiz();
  }
  
  // Update results if on results page
  if (window.location.pathname.includes('results.html')) {
    updateQuizResults();
  }
};