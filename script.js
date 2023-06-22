// Number of objects to generate
const totalObjects = 8;
// Number of columns in the grid
const gridSize = 6;
// Array to store the generated objects
let objects = [];
// Flag to track game status
let isGameStarted = false;

// Generate random objects
function generateObjects() {
  const objectContainer = document.getElementById('objects');
  objectContainer.innerHTML = '';

  const colors = ['red', 'black'];
  const shapes = ['square', 'circle'];

  for (let i = 0; i < totalObjects; i++) {
    const object = document.createElement('div');
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];

    object.classList.add('object', randomShape);
    object.style.backgroundColor = randomColor;
    objectContainer.appendChild(object);
    objects.push(object);
  }
}

// Shuffle the objects array
function shuffleObjects() {
  for (let i = objects.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [objects[i], objects[j]] = [objects[j], objects[i]];
  }
}

// Show objects to the player
function showObjects(duration) {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';

  const availableCells = Array.from({ length: gridSize * gridSize }, (_, i) => i);
  shuffleObjects();

  for (let i = 0; i < totalObjects; i++) {
    const object = objects[i];
    const randomCellIndex = Math.floor(Math.random() * availableCells.length);
    const cellIndex = availableCells[randomCellIndex];

    const row = Math.floor(cellIndex / gridSize);
    const col = cellIndex % gridSize;

    object.style.top = `${row * 80}px`;
    object.style.left = `${col * 80}px`;

    grid.appendChild(object);

    availableCells.splice(randomCellIndex, 1);
  }

  setTimeout(function () {
    hideObjects();
    startTimer(duration);
  }, duration * 1000);
}

// Hide the objects from the player
function hideObjects() {
  for (let i = 0; i < objects.length; i++) {
    objects[i].style.display = 'none';
  }
}

// Timer countdown
function startTimer(duration) {
  let timer = duration;
  const timeDisplay = document.getElementById('time');
  timeDisplay.textContent = timer;

  let timerInterval = setInterval(function () {
    timer--;
    timeDisplay.textContent = timer;

    if (timer < 0) {
      clearInterval(timerInterval);
      timeDisplay.textContent = '0';
      endGame();
    }
  }, 1000);
}

// Validate the solution
function validateSolution() {
  let correctCount = 0;

  for (let i = 0; i < objects.length; i++) {
    const object = objects[i];
    const rect = object.getBoundingClientRect();

    // Check if the object is in the correct position
    if (rect.left === i % gridSize * 80 && rect.top === Math.floor(i / gridSize) * 80) {
      correctCount++;
    }
  }

  return correctCount === objects.length;
}

// End the game
function endGame() {
  const feedback = document.getElementById('feedback');
  const restartButton = document.getElementById('restartButton');

  if (validateSolution()) {
    feedback.textContent = 'Congratulations! You completed the game successfully.';
  } else {
    feedback.textContent = 'Oops! Time\'s up or the objects are not in the correct positions.';
  }

  restartButton.style.display = 'block';
  isGameStarted = false;
}

// Restart the game
function restartGame() {
  objects = [];
  isGameStarted = false;
  const feedback = document.getElementById('feedback');
  const restartButton = document.getElementById('restartButton');
  const timeDisplay = document.getElementById('time');

  feedback.textContent = '';
  restartButton.style.display = 'none';
  timeDisplay.textContent = '';

  initGame();
}

// Initialize the game
function initGame() {
  generateObjects();
  showObjects(5); // Show objects for 5 seconds

  isGameStarted = true;
}

// Start button click event
document.getElementById('startButton').addEventListener('click', function () {
  if (!isGameStarted) {
    initGame();
  }
});

// Restart button click event
document.getElementById('restartButton').addEventListener('click', function () {
  restartGame();
});

// Drag and drop functionality
interact('.object')
  .draggable({
    inertia: true,
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent',
        endOnly: true
      })
    ],
    autoScroll: true,
    listeners: {
      start(event) {
        event.target.classList.add('dragging');
      },
      move(event) {
        const target = event.target;
        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        target.style.transform = `translate(${x}px, ${y}px)`;
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      },
      end(event) {
        event.target.classList.remove('dragging');
      }
    }
  })
  .resizable({
    edges: {
      top: true,
      left: true,
      bottom: true,
      right: true
    },
    listeners: {
      move(event) {
        const target = event.target;
        const x = (parseFloat(target.getAttribute('data-x')) || 0);
        const y = (parseFloat(target.getAttribute('data-y')) || 0);

        target.style.width = `${event.rect.width}px`;
        target.style.height = `${event.rect.height}px`;
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      }
    }
  })
  .on('resizemove', function (event) {
    const target = event.target;
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.deltaRect.left;
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.deltaRect.top;

    target.style.transform = `translate(${x}px, ${y}px)`;
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  });

// Initialize the game when the DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  const restartButton = document.getElementById('restartButton');
  restartButton.addEventListener('click', restartGame);
});
