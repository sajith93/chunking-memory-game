document.addEventListener('DOMContentLoaded', function () {
  const grid = document.querySelector('.grid'); // Get the grid element
  const timerContainer = document.querySelector('.timer-container'); // Get the timer container element
  const timer = document.querySelector('.timer'); // Get the timer element
  const palette = document.querySelector('.palette'); // Get the palette element
  const startButton = document.querySelector('.start-button'); // Get the start button element
  const submitButton = document.querySelector('.submit-button'); // Get the submit button element
  const message = document.querySelector('.message'); // Get the message element

  const objects = [
    { shape: 'square', color: 'red' },
    { shape: 'square', color: 'black' },
    { shape: 'circle', color: 'red' },
    { shape: 'circle', color: 'black' }
  ];

  let sequence = []; // Store the sequence of object positions
  let playerSelection = []; // Store the player's object selection
  let isPlaying = false; // Flag to check if the game is currently being played

  // Generate random positions for the objects
  function generateRandomPositions() {
    const positions = [];

    while (positions.length < 16) {
      const randomPosition = Math.floor(Math.random() * 64); // Generate a random position between 0 and 63
      if (!positions.includes(randomPosition)) {
        positions.push(randomPosition); // Add the unique random position to the array
      }
    }

    return positions; // Return the array of random positions
  }

  // Display the objects on the grid
  function displayObjects() {
    grid.innerHTML = ''; // Clear the grid

    const positions = generateRandomPositions(); // Generate random positions

    for (let i = 0; i < 64; i++) {
      const cell = document.createElement('div'); // Create a div element for each grid cell
      cell.classList.add('cell'); // Add the 'cell' class to the cell element
      cell.dataset.position = i; // Set the custom 'position' attribute to store the position

      const objectIndex = positions.indexOf(i); // Get the object index for the current position
      if (objectIndex !== -1) {
        const { shape, color } = objects[objectIndex % 4]; // Get the object's shape and color based on the object index
        cell.textContent = shape === 'square' ? '■' : '●'; // Display the shape as a square or circle
        cell.style.color = color; // Set the color of the shape
      }

      grid.appendChild(cell); // Add the cell element to the grid
    }
  }

  // Start the game by displaying the sequence
  function startGame() {
    if (!isPlaying) {
      isPlaying = true;
      sequence = generateRandomPositions(); // Generate random positions for the sequence
      displaySequence(); // Display the sequence of objects

      // Start the timer
      let timeLeft = 30; // Set the initial time to 30 seconds
      let timerWidth = 100; // Set the initial timer width to 100%
      const timerInterval = setInterval(() => {
        timeLeft--;
        timerWidth = (timeLeft / 30) * 100;
        timer.style.width = timerWidth + '%';

        if (timeLeft === 0) {
          clearInterval(timerInterval);
          hideSequence(); // Hide the sequence after 30 seconds
        }
      }, 1000);
    }
  }

  // Display the sequence of object positions
  function displaySequence() {
    sequence.forEach((position, index) => {
      setTimeout(() => {
        const cell = document.querySelector(`.cell[data-position="${position}"]`); // Get the cell element for the current position
        cell.classList.add('highlight'); // Add the 'highlight' class to the cell to visually indicate the object
        setTimeout(() => {
          cell.classList.remove('highlight'); // Remove the 'highlight' class after 500 milliseconds
        }, 500);
      }, 1000 * index); // Delay the highlighting of each object in the sequence
    });
  }

  // Hide the sequence after displaying it
  function hideSequence() {
    grid.querySelectorAll('.cell').forEach(cell => {
      cell.textContent = '';
    });
    startPlayerInteraction(); // Start player interaction after hiding the sequence
  }

  // Start player interaction by enabling drag and drop
  function startPlayerInteraction() {
    palette.querySelectorAll('.object').forEach(object => {
      object.addEventListener('dragstart', dragStart);
    });
    grid.addEventListener('dragover', dragOver);
    grid.addEventListener('drop', drop);
  }

  // Handle drag start event for objects
  function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.dataset.shape + '-' + event.target.dataset.color);
  }

  // Handle drag over event for the grid
  function dragOver(event) {
    event.preventDefault();
  }

  // Handle drop event on the grid
  function drop(event) {
    event.preventDefault();
    const cell = event.target.closest('.cell'); // Get the closest parent cell element of the drop target
    if (cell && cell.textContent === '') {
      const data = event.dataTransfer.getData('text/plain').split('-');
      const shape = data[0];
      const color = data[1];
      const position = parseInt(cell.dataset.position);
      cell.textContent = shape === 'square' ? '■' : '●';
      cell.style.color = color;
      playerSelection[position] = { shape, color }; // Store the player's selection in the playerSelection array
    }
  }

  // Submit the player's answer
  function submitAnswer() {
    if (isPlaying) {
      isPlaying = false;

      // Compare the player's answer with the correct objects' position, shape, and color
      const isCorrect = sequence.every((position, index) => {
        const cell = document.querySelector(`.cell[data-position="${position}"]`);
        const shape = cell.textContent === '■' ? 'square' : 'circle';
        const color = cell.style.color;
        const playerObject = playerSelection[position];
        return (
          playerObject &&
          playerObject.shape === shape &&
          playerObject.color === color
        );
      });

      // Provide feedback to the player
      message.textContent = isCorrect ? 'Correct answer!' : 'Incorrect answer!';
      message.style.color = isCorrect ? 'green' : 'red';

      // Clear player's selection after a delay
      setTimeout(() => {
        grid.querySelectorAll('.cell').forEach(cell => {
          cell.textContent = '';
          cell.style.color = '';
        });
        playerSelection = []; // Clear the player's selection array
        message.textContent = ''; // Clear the feedback message
      }, 1500);
    }
  }

  // Event listeners
  startButton.addEventListener('click', startGame); // Call startGame function when the start button is clicked
  submitButton.addEventListener('click', submitAnswer); // Call submitAnswer function when the submit button is clicked

  // Initialize the game
  displayObjects(); // Display the initial objects on the grid
});
