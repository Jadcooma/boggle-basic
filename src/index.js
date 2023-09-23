// Import assertion to prevent importing malicious scripts by checking the MIME type 
import dice from './data/dice';

var playing = false;
updateGameUI();

function updateGameUI() {
  const gameToggle = document.querySelector('button[data-role="game-toggle"]');
  const gameContainer = document.querySelector('div.container');

  gameToggle.textContent = (playing) ? 'STOP' : 'PLAY';
  gameContainer.style.display = (playing) ? 'grid' : 'none';
}

function newGame() {
  if (playing) return;
  playing = true;

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
}

function stopGame() {
  if (!playing) return;
  playing = false;

  // Remove dice from previous game
  document.querySelectorAll('div.container>div').forEach(oldDie => oldDie.remove());
}

function toggleGame() {
  if (playing) stopGame();
  else newGame();

  updateGameUI();
}

// Add click listener to the game toggle to play or stop the game
document.querySelector('button[data-role="game-toggle"]')
  .addEventListener('click', toggleGame);