document.onreadystatechange = function () {
  if (document.readyState == "complete") {
    var grid =  [[0,0,false],[100,0,false],[200,0,false],[300,0,false],
                  [0,100,false],[100,100,false],[200,100,false],[300,100,false],
                  [0,200,false],[100,200,false],[200,200,false],[300,200,false],
                  [0,300,false],[100,300,false],[200,300,false],[300,300,true]];

    var puzzleAreaContents = document.getElementById("puzzlearea").children;
    var shuffleTracker = 0;
    var numberOfMoves = 0;
    // insert counter html
    document.getElementById("overall").insertAdjacentHTML('beforeend', "number of moves: <span id='numberOfMoves'>0</span>");

    var timer;
      var ele = document.getElementById('timer');

      (function (){
          var sec = 0;
          timer = setInterval(()=>{
          ele.innerHTML = 'Seconds: '+sec;
          sec++;
      }, 1000)
      
      })()

      function pause(){
        // Stops calling `tick` and toggles buttons
        clearInterval(timer);
        disable(pauseButton); enable(unpauseButton);
      }

      // Defines functions to disable and re-enable HTML elements
      function disable(element){ element.setAttribute("disabled",""); }
      function enable(element){ element.removeAttribute("disabled"); }
      

    function checkIfComplete() {
      var check = ""
      var arr = document.getElementById("puzzlearea").children;
      for (i = 0; i < arr.length; i++) {
        check = check + arr[i].innerHTML 
      };
      if (check == "123456789101112131415" && numberOfMoves > 5) {
        celebrate()
        return true;
      }
    }

    function reload() {
      alert("hey") 
    }

    function celebrate() {
      
      document.getElementById("puzzlearea").innerHTML = "<div><img onclick='location.reload();' src='https://www.dreamstime.com/stock-illustration-congratulations-paper-banner-color-confetti-vector-illustration-image91321515'/></div><br /><h1 onclick='location.reload();'>Good Job</h1>";
      document.getElementById("submitbutton").outerHTML = ""
      pause();
      play();
      
    }

    function play(){
      var audio = new Audio("applause.mp3");
      audio.play();
    }
    

    function shuffle(shuffleTracker) {
      var rand = getRandomElement();
      shiftPuzzlePiece.call(puzzleAreaContents[rand]);
      if (shuffleTracker < 199) 
        { 
          shuffleTracker = shuffleTracker + 1;
          // recusively shuffle 99 times 
          shuffle(shuffleTracker) 
        }
        else {
          // reset
          shuffleTracker = 0;
          numberOfMoves = 0; 
          document.getElementById("numberOfMoves").innerHTML = numberOfMoves;          
        }
    }

    function getRandomElement() {
      var movables = getArrayOfMovableCells();
      return movables[Math.floor(Math.random() * movables.length)];
    }

    function openBlock() {
      // find open block in grid[]
      for (i = 0; i < grid.length; i++) {
        if (grid[i][2] == true){return i;}
      }
    }

    function getArrayOfMovableCells() {
      var open = openBlock()
      var movables = [open-4, open-1, open+1, open+4]
      // purge out of bounds indexes
      var count = movables.length;
      for (i = 0; i < count; i++) {
        // check down
        if (movables[i] < 0) {movables[i] = null}            
        // check up
        if (movables[i] > 15) {movables[i] = null}
        // check right
        if (open == 3 || open == 7 || open == 11 ) { movables[movables.indexOf(open+1)] = null }
        // check left
        if (open == 4 || open == 8 || open == 12 ) { movables[movables.indexOf(open-1)] = null }
      }
      movables = movables.filter(
        function(val) { 
        return val !== null; 
      })
      return movables;
    }

    function addPuzzlePieceHover() {
      this.className = this.className + " puzzlepiecehover";
    }

    function removePuzzlePieceHover() {
      this.className = "puzzlepiece";
    }
    
    function shiftPuzzlePiece() {
      // increment moves
      numberOfMoves = numberOfMoves + 1;
      document.getElementById("numberOfMoves").innerHTML = numberOfMoves; 

      // move touched piece
      this.style.left = grid[openBlock()][0]+"px";
      this.style.top = grid[openBlock()][1]+"px";
      // reset hover state, because mouseout event never actually happened after click event
      this.className = "puzzlepiece";

      // convert the htmlCollection to a real array, and then back into html
      var collection = Array.prototype.slice.call( puzzleAreaContents )
      var movedBlock = collection.indexOf(this)
      var openBlockIndex = collection.indexOf(puzzleAreaContents[openBlock()])
      
      var switchVariable = collection[movedBlock];
      collection[movedBlock] = collection[openBlockIndex];
      collection[openBlockIndex] = switchVariable;

      document.getElementById("puzzlearea").innerHTML = ""
      for (i = 0; i < collection.length; i++) {
        document.getElementById("puzzlearea").innerHTML = document.getElementById("puzzlearea").innerHTML + collection[i].outerHTML;
      }

      // set current unit to false, unit.open? #=> false
      grid[openBlock()][2] = false;
      // set touched unit to true, unit.open? #=> true
      grid[movedBlock][2] = true;

      // var movables = getArrayOfMovableCells();
      // remove old listeners
      removeEventListeners(getArrayOfMovableCells());
      // if complete, break out of everything
      if (checkIfComplete() == true) {return} 
      // add new listeners to new set of movables
      addEventListeners(getArrayOfMovableCells());
    }

    function addEventListeners(movables) {
      for (i = 0; i < movables.length; i++) {
        puzzleAreaContents[movables[i]].addEventListener("mouseover", addPuzzlePieceHover, false);
        puzzleAreaContents[movables[i]].addEventListener("mouseout", removePuzzlePieceHover, false);
        puzzleAreaContents[movables[i]].addEventListener("click", shiftPuzzlePiece);
      }
    }

    function removeEventListeners(movables) {
      for (i = 0; i < movables.length; i++) {
        puzzleAreaContents[movables[i]].removeEventListener("mouseover", addPuzzlePieceHover, false);
        puzzleAreaContents[movables[i]].removeEventListener("mouseout", removePuzzlePieceHover, false);
        puzzleAreaContents[movables[i]].removeEventListener("click", shiftPuzzlePiece, false);
      }
    }

    function initializePuzzleArea() {
      // set initial configuration
      var x = 0;
      var y = 0;
      for (i = 0; i < puzzleAreaContents.length; i++) {
        puzzleAreaContents[i].setAttribute("class", "puzzlepiece");
        // set top and left
        puzzleAreaContents[i].style.top = y+"px" ;
        puzzleAreaContents[i].style.left = x+"px" ;
        // set backgroundPosition - use negative numbers 
        // because I don't know why, but it magically works 
        puzzleAreaContents[i].style.backgroundPosition = "-"+x+"px "+"-"+y+"px" ;
        // increment x by 100 until each 4th columm, then increment y and reset x to 0
        if (x==300)
        {var y = y + 100; 
          var x = 0; }
        else{var x = x + 100;}
      }
      // add 16th "empty" element, makes the whole thing a lot easier to troubleshoot
      // it moves around the htmlCollection just like the other elements
      document.getElementById("puzzlearea").innerHTML = document.getElementById("puzzlearea").innerHTML + "<div class='empty'></div>"
      addEventListeners(getArrayOfMovableCells());
    }
    
    document.getElementById("shufflebutton").onclick = function(){shuffle(shuffleTracker);}
    initializePuzzleArea();
    
  }
}

