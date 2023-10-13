// Import assertion to prevent importing malicious scripts by checking the MIME type 
import dice from './data/dice';

const gameDuration = 1000 * 60 * 3 // milliseconds in 3 minutes

const state = Object.freeze({
  NONE: 0,
  ACTIVE: 1,
  PAUSED: 2,
  OVER: 3,
});

let gameState;
let timerIntervalID;
let timeRemaining;

function init() {
  gameState = state.NONE;
  timeRemaining = gameDuration;
  updateTimerDisplay();
  updateGameUI();
}

function updateGameUI() {
  const gameToggle = document.querySelector('[data-role="game-toggle"]');
  const gameContainer = document.querySelector('div.container');
  const timerToggle = document.querySelector('[data-role="timer-toggle"]');
  const timerDisplay = document.querySelector('[data-role="timer-display"]');

  switch (gameState) {
    case state.NONE:
      gameContainer.style.display = 'none';
      timerToggle.style.display = 'none';
      timerDisplay.style.display = 'none';
      gameToggle.textContent = 'NEW GAME';
      break;  
    case state.ACTIVE:
      gameContainer.style.display = 'grid';
      timerToggle.style.display = 'inline';
      timerDisplay.style.display = 'block';
      gameToggle.textContent = 'STOP';
      timerToggle.textContent = 'PAUSE';
      timerDisplay.classList.remove('done');
      break;
    case state.PAUSED:
      gameContainer.style.display = 'none';
      timerToggle.textContent = 'CONTINUE';
      break;
    case state.OVER:
      gameContainer.style.display = 'none';
      timerToggle.style.display = 'none';
      gameToggle.textContent = 'NEW GAME';
      timerDisplay.classList.add('done');
  }
}

function newGame() {
  gameState = state.ACTIVE;
  timeRemaining = gameDuration;

  startTimer();

  // Returns a random number between min (included) and max (excluded)
  const integerBetween = (min, max) => Math.floor((max - min) * Math.random() + min);

  // Roll all dice
  const rolledDice = dice.map(die => die[integerBetween(0, 6)]);

  // Shuffle all rolled dice
  const shuffledDice = [];

  while (rolledDice.length > 0) {
    const index = integerBetween(0, rolledDice.length);
    const shuffledDie = rolledDice.splice(index, 1).at(0);
    shuffledDice.push(shuffledDie);
  }

  // Add shuffled dice to the game
  const gameContainer = document.querySelector('div.container');

  for (const die of shuffledDice) {
    const newDie = document.createElement('div');
    newDie.innerText = die;
    gameContainer.appendChild(newDie);
  }

  updateGameUI();
  updateTimerDisplay();
}

function stopGame() {
  gameState = state.NONE;
  stopTimer();

  removeDice();
  updateGameUI();
}

function removeDice() {
  document.querySelectorAll('div.container>div').forEach(oldDie => oldDie.remove());
}

function toggleGame() {
  switch (gameState) {
    case state.ACTIVE:
    case state.PAUSED: 
      stopGame(); break;
    case state.NONE:
    case state.OVER: 
      newGame();
  }

  updateGameUI();
}

function toggleTimer() {
  if (gameState == state.ACTIVE) {
    gameState = state.PAUSED;
    stopTimer();
  } else if (gameState == state.PAUSED) {
    gameState = state.ACTIVE;
    startTimer();
  }

  updateGameUI();
}

function startTimer() {
  timerIntervalID = setInterval(runTimer, 1000);
}

function stopTimer() {
  clearInterval(timerIntervalID);
}

function runTimer() {
  if (timeRemaining == 0) {
    gameOver();
  } else {
    timeRemaining -= 1000;
  }

  updateTimerDisplay();
}

function gameOver() {
  gameState = state.OVER;
  stopTimer();
  removeDice();
  playAlarm();
  updateGameUI();
}

function playAlarm() {
  const alarm = document.querySelector('[data-role="alarm"]');
  if (!(alarm instanceof HTMLAudioElement)) return;
  
  alarm.play();
}

function updateTimerDisplay() {
  const secondsRemaining = timeRemaining / 1000;
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = (minutes > 0) 
    ? secondsRemaining % (minutes * 60)
    : secondsRemaining;
  
  const minutesField = document.querySelector('[data-role="minutes"]');
  const secondsField = document.querySelector('[data-role="seconds"]');

  // Add a leading zero if field contains single digit
  minutesField.textContent = (minutes < 10) ? `0${minutes}` : minutes;
  secondsField.textContent = (seconds < 10) ? `0${seconds}` : seconds;
}

// Pressing the game toggle starts or stops the game
document.body.querySelector('[data-role="game-toggle"]')
  .addEventListener('click', toggleGame);

// Pressing the timer toggle pauses or resumes the game
document.body.querySelector('[data-role="timer-toggle"]')
  .addEventListener('click', toggleTimer);

// Initialize the page when loaded
document.body.onload = () => init();
