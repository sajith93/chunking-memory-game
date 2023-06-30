document.addEventListener('DOMContentLoaded', function () {
  const grid = document.querySelector('.grid'); // Get the grid element
  const solutionGrid = document.querySelector('.solution-grid'); // Get the grid element
  const timerContainer = document.querySelector('.timer-container'); // Get the timer container element
  const timer = document.querySelector('.timer'); // Get the timer element
  const palette = document.querySelector('.palette'); // Get the palette element
  const startButton = document.querySelector('.start-button'); // Get the start button element
  const submitButton = document.querySelector('.submit-button'); // Get the submit button element
  const message = document.querySelector('.message'); // Get the message element
  const timerSetting = document.querySelector('#timer-count');
  const correctSolutionH3 = document.querySelector('.solution-grid-text');

 // Prevent scrolling when touching the container div
    grid.addEventListener('touchmove', function(event) {
      event.preventDefault();
    }, { passive: false });
     // Prevent scrolling when touching the container div
     palette.addEventListener('touchmove', function(event) {
      event.preventDefault();
    }, { passive: false });


  const objects = [
    { shape: 'square', color: 'red' },
    { shape: 'square', color: 'black' },
    { shape: 'circle', color: 'red' },
    { shape: 'circle', color: 'black' }
  ];

  grid_width = 700;
  grid_cell_dim = 700/6;
  palette.style.width = (grid_cell_dim*8) +'px';
  palette.style.height = (grid_cell_dim * 2) +'px';
  grid.style.width = grid_width +'px';
  grid.style.height = grid_width +'px';
  solutionGrid.style.width = grid_width +'px';
  solutionGrid.style.height = grid_width +'px';

  submitButton.classList.add('hidden');
  palette.classList.add('hidden');
  solutionGrid.classList.add('hidden');
  timerContainer.classList.add('hidden');
  timer.classList.add('hidden');

  var element = document.querySelector('.no-select');
  var longPressDuration = 5; // Set the duration for a long press in milliseconds

  var pressTimer;

  element.addEventListener('touchstart', function(event) {
    pressTimer = setTimeout(function() {
      event.preventDefault();
      element.style.webkitUserSelect = 'none';
      element.style.userSelect = 'none';
    }, longPressDuration);
  });

  element.addEventListener('touchend', function() {
    clearTimeout(pressTimer);
    element.style.webkitUserSelect = 'text';
    element.style.userSelect = 'text';
  });

  element.addEventListener('touchmove', function() {
    clearTimeout(pressTimer);
    element.style.webkitUserSelect = 'text';
    element.style.userSelect = 'text';
  });


  let playerSelection = []; // Store the player's object selection
  let isPlaying = false; // Flag to check if the game is currently being played
  let draggingObject = null; // Store the currently dragging object
  let positions = [];
  const grid_len = 6;
  const grid_size = grid_len**2;

  // Generate random positions for the objects
  function generateRandomPositions() {
    positions = [];
    while (positions.length < 16) {
      const randomPosition = Math.floor(Math.random() * (grid_size)); // Generate a random position between 0 and 63
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

    for (let i = 0; i < (grid_size); i++) {
      const cell = document.createElement('div'); // Create a div element for each grid cell
      cell.classList.add('cell'); // Add the 'cell' class to the cell element
      cell.dataset.position = i; // Set the custom 'position' attribute to store the position

      const objectIndex = positions.indexOf(i); // Get the object index for the current position
        //cell.textContent = shape === 'square' ? '■' : '●'; // Display the shape as a square or circle
        //cell.style.color = color; // Set the color of the shape
        
        
        const cellObj = document.createElement('div');
        cellObj.setAttribute('id', i)
        cellObj.classList.add("cell-obj");   
        cellObj.classList.add("grid-cell-obj");   

        if (objectIndex !== -1) {
          const { shape, color } = objects[objectIndex % 4]; // Get the object's shape and color based on the object index
  
        let classObjName= color+'-'+shape;
        cellObj.dataset.objName = classObjName;
        cellObj.classList.add(classObjName);     
        //cellObj.textContent = shape === 'square' ? '■' : '●'; // Display the shape as a square or circle
        }
        else {
          cellObj.dataset.objName = '';
        }

        cellObj.addEventListener("dragstart", dragStart);
        cellObj.addEventListener("touchstart", touchStart);
        cellObj.addEventListener("dragend", dragEnd);

        cellObj.classList.add('hidden');
        
        cell.appendChild(cellObj);

        cell.addEventListener("dragover", dragOver);
        cell.addEventListener("drop", drop);
      

      grid.appendChild(cell); // Add the cell element to the grid
    }
    // getSequence();
  }

  function getSequence(){
    let cellObjs = document.querySelectorAll(".grid > .cell > .cell-obj");
    let currentSequence = [];
    cellObjs.forEach(cellObj => {
      currentSequence.push(cellObj.dataset.objName);    
    });
    console.log(currentSequence);
    return currentSequence;
  }

  function touchStart(event) {
    event.dataTransfer.setData("draggedCellObjId", event.target.id);
    setTimeout(() => {
      event.preventDefault();
      element.style.webkitUserSelect = 'none';
      element.style.userSelect = 'none';
      event.target.classList.toggle("hidden");
    }
      );
  }

  function dragStart(event) {
    event.dataTransfer.setData("draggedCellObjId", event.target.id);
    setTimeout(() => {
      event.preventDefault();
      element.style.webkitUserSelect = 'none';
      element.style.userSelect = 'none';
      event.target.classList.toggle("hidden");
    }
      );
  }

  function dragEnd(event) {
    event.target.classList.toggle("hidden");
    
  }

  function dragOver(event) {
    event.preventDefault();
  }

  function drop(event) {
    const draggedCellObjId = event.dataTransfer.getData("draggedCellObjId");
    const draggedCellObj = document.getElementById(draggedCellObjId);
    const fromCell = draggedCellObj.parentNode;
    const toCell = event.currentTarget;

    if (toCell !== fromCell) {
      fromCell.appendChild(toCell.firstElementChild);
      toCell.appendChild(draggedCellObj);
      getSequence();
      calcScore();
    }
    
  }

  let originSequence = []
  let timerInterval=0;
  let timeLeft = 0;

  // Start the game by displaying the sequence
  function startGame() {

    if (!isPlaying) {
    grid.innerHTML = ''; // Clear the grid
    palette.innerHTML = ''; // Clear the grid
    solutionGrid.innerHTML = '';// Clear the solution grid
    correctSolutionH3.textContent = '';
    message.textContent = '';
    originSequence = []

    solutionGrid.classList.add('hidden');
    timerContainer.classList.remove('hidden');
    timer.classList.remove('hidden');
    
    startButton.classList.add('hidden')
    submitButton.classList.add('hidden');

    try{
      clearInterval(timerInterval);
      console.log('reset interval;');
      }
      catch {}

    displayObjects()

    
      isPlaying = true;

      let cellObjs = document.querySelectorAll(".cell-obj");
      
      cellObjs.forEach(cellObj => {
        cellObj.classList.remove('hidden');
        originSequence.push(cellObj.dataset.objName);    
      });

      // Start the timer
      let timerSettingInt = parseInt(timerSetting.textContent);
      let totalTime = timerSettingInt*100; // Set the initial time to 30 seconds
      timeLeft = totalTime;
      let timerWidth = 100; // Set the initial timer width to 100%
      timer.style.width = timerWidth + '%';
      timerInterval = setInterval(() => {
        timeLeft--;
        timerWidth = (timeLeft / totalTime) * 100;
        timer.style.height = timerWidth + '%';
        if (timeLeft>= 0){
          timer.textContent = Math.ceil(timeLeft/100);
          }else{
            clearInterval(timerInterval);
            console.log('reset interval;');

            cellObjs.forEach(cellObj => {
              cellObj.dataset.objName = '';
              cellObj.className = 'cell-obj grid-cell-obj'
              cellObj.setAttribute('draggable', true);
              // cellObj.classList.add('hidden');
              
              timerContainer.classList.add('hidden');
              timer.classList.add('hidden');

              startButton.classList.add('hidden');

              submitButton.classList.remove('hidden');
              palette.classList.remove('hidden');
 
            });
            console.log("originSequence:", originSequence);
            addElementstoPallete();
          }
        }, 10);

  
          timer.textContent = 0;
          // clearInterval(timerInterval);
          // hideSequence(); // Hide the sequence after 30 seconds

          
          
        
      
    }
  }

  function calcScore(){
    let score=0;
    userSequence = getSequence();
    for(let i=0; i<grid_size; i++){
      if(originSequence[i] != ''){
      if(originSequence[i] == userSequence[i])
      {
        score++;
      }
    }
    }
    console.log(score);
    return score;
  }

  function addElementstoPallete(){
    palette.innerHTML = ''; // Clear the palette
    for (let i = 0; i < 16; i++){
      const cell = document.createElement('div'); 
      cell.classList.add('cell'); // Add the 'cell' class to the cell element
      cell.dataset.position = i; // Set the custom 'position' attribute to store the position

      const cellObj = document.createElement('div');
      cellObj.setAttribute('id', grid_size+i)
      cellObj.classList.add("cell-obj"); 
      
      let classObjName = originSequence[positions[i]];
      cellObj.classList.add(classObjName); 
      cellObj.dataset.objName = classObjName;
      cellObj.setAttribute('draggable', true);

      cellObj.addEventListener("dragstart", dragStart);
      cellObj.addEventListener("touchstart", touchStart);
      cellObj.addEventListener("dragend", dragEnd);

        
      cell.appendChild(cellObj);

      cell.addEventListener("dragover", dragOver);
      cell.addEventListener("drop", drop);
    

      palette.appendChild(cell); // Add the cell element to the grid

    }
      
  }

  function populateSolutionGrid(){
    correctSolutionH3.textContent = 'Below is the Solution!';
    solutionGrid.innerHTML = ''; // Clear the palette
    console.log("originSequence: ",originSequence);
    for (let i = 0; i < grid_size; i++){
      let cell = document.createElement('div'); 
      cell.classList.add('cell'); // Add the 'cell' class to the cell element
      cell.dataset.position = i; // Set the custom 'position' attribute to store the position

      let cellObj = document.createElement('div');
      cellObj.setAttribute('id', grid_size*100+i);
      cellObj.classList.add("cell-obj"); 
      console.log('i',i);
      console.log('originSequence[i]',originSequence[i]);
      let classObjName =''
      if(originSequence[i]){
        classObjName = originSequence[i];
        cellObj.classList.add(classObjName); 
      } 
      cellObj.dataset.objName = classObjName;        
      
      cell.appendChild(cellObj);    
      solutionGrid.appendChild(cell); // Add the cell element to the grid
    }
      
  }


  // Submit the player's answer
  function submitAnswer() {

    if (isPlaying && (timeLeft <=0)) {
      isPlaying = false;

      let cellObjs = document.querySelectorAll('.cell-obj');
      cellObjs.forEach(cellObj => {
        cellObj.setAttribute('draggable', false);
        cellObj.removeEventListener("dragstart", dragStart);
        cellObj.removeEventListener("touchstart", touchStart);
        cellObj.removeEventListener("dragend", dragEnd);  
        
        palette.classList.add('hidden'); 
        timerContainer.classList.add('hidden');
        timer.classList.add('hidden');
        startButton.textContent = "Play Again";
        submitButton.classList.add('hidden');

        startButton.classList.remove('hidden');
        solutionGrid.classList.remove('hidden');

        
      });

      playerScore = calcScore();

      message.textContent = 'You got '+playerScore+' correct!\
      Your score: '+Math.floor(playerScore*100/16)+'%';

      populateSolutionGrid();
     
    }
  }

  // Event listeners
  startButton.addEventListener('click', startGame); // Call startGame function when the start button is clicked
  submitButton.addEventListener('click', submitAnswer); // Call submitAnswer function when the submit button is clicked

  // Initialize the game
  displayObjects(); // Display the initial objects on the grid
});
