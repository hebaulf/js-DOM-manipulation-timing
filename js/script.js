'Use strict';


// CODE FOR PAGE LOADER
setTimeout(() => { // set timeout for changing styles of .loader element
    document.querySelector('.loader').style.visibility = 'hidden'; // Change visibility from visible o hidden
    document.querySelector('.loader').style.opacity = '0'; // Change opacity from 1 to 0
}, 1000); // 1000ms (or 1 sec) timeout


// CODE FOR THE COUNTDOWN TIMER FOR GAME
let countdown; // Create a variable for countdown
const timerDisplay = document.querySelector('.display__time-left');

// Function for timer (how many seconds the timer is)
function timer(seconds) {
    
    const now = Date.now(); // Get current time in milliseconds
    const then = now + (seconds * 1000); // Get seconds to count down in milliseconds
    console.log({now, then}); // Shows in console the time now vs. time to count down in milliseconds
    displayTimeLeft(seconds); // display seconds left immediately 

    // Countdown function
    countdown = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000); // Get seconds left rounded to full second using Math.round
        
        // Check if/when we should stop the counter
        if (secondsLeft < 0) { // If seconds left are less than 0,
            clearInterval(countdown); // stop the countdown
            return;
        }

        displayTimeLeft(secondsLeft); // Display seconds left for each second elapsed
    }, 1000); // 
}

// Function for display time
function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60); // (Not used now) Get whole minutes by getting lower bound of the number with Math.floor()
    const remainderSeconds = seconds % 60; // Get remainder of seconds left from minute, using modulus(%) of 60.
    const display = `${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`; // Get seconds left to display on website
    
    // This below changes the title of website displayed in the tab to be the countdown timer
    document.title = display; // Title of webpage becomes display variable
    timerDisplay.textContent = display; // Variable display becomes the time left of game
    // console.log({minutes, remainderSeconds});
}



// CODE FOR THE WHACK-A-MOLE GAME
const toggleGame = document.querySelector('.toggle__game'); // Get Start/End game button from DOM
const holes = document.querySelectorAll('.hole'); // Get all "hole" elements from DOM
const scoreBoard = document.querySelector('.score'); // Get "score" element from DOM
const moles = document.querySelectorAll('.mole'); // Get all "mole" elements from DOM

let lastHole; // Create variable for last hole
let timeUp = false; // Set time up variable to false
let score = 0; // set score variable to 0


// Function to get random time with min and max time set using Math.random
function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min); // also using Math.round to round to whole number
}

// Function for random hole(that mole pops out of)
function randomHole(holes) {
    const idx = Math.floor(Math.random() * holes.length); // Get number of randomized hole using Math.random
    const hole = holes[idx]; // New hole variable with number for each randomized hole

    if(hole === lastHole) { // If randomized hole is the same as the one before, it will get another hole
        console.log('Thats the same hole, dude!'); // Log in console if same hole has occured
        return randomHole(holes); // Call function again to get another random hole
    }

    lastHole = hole; // Saves the reference to the last hole that came up, so that if it comes up again it calls another
    return hole; // Returns hole to the DOM
}

// Function for mole to pop up out of hole
function peep() {
    const time = randomTime(300, 1000); // Get a random time between .3sec to 1sec
    const hole = randomHole(holes); // Get random hole

    hole.classList.add('up'); // Add a class "up" to the "hole" element in DOM

    // Set a timeout for the duration of moles popping up
    setTimeout(() => { 
        hole.classList.remove('up'); // Remove class "up" from the "hole" element in DOM
        if(!timeUp) peep(); // If time is not done keep moles popping up
    }, time);
}

// Function for the click or bonk on the head of the moles
function bonk(e) {
    // console.log(e);
    if(!e.isTrusted) return; // 
    score ++; // Add 1 point to the score
    this.classList.remove('up'); // Remove class "up" from mole element in DOM when mole is clicked 
    scoreBoard.textContent = score; // Add the score to the DOM element for scoreboard.
}

// Add the "bonk" function for each mole that is clicked(or bonked).
moles.forEach(mole => mole.addEventListener('click', bonk));


let timeout; // Create a variable for timeout

// Start game function
function startGame() {
    scoreBoard.textContent = 0; // scoreboard text set to 0
    timeUp = false; // Start countdown
    score = 0; // Score set to 0
    peep(); // Call peep() function
    clearInterval(timeout); // Clear timeout for countdown
    timeout = setTimeout(() => {timeUp = true}, 20000); // Set timeout for game to 20sec
    timer(20); // set 20 sec on timer
}

// End game function
function endGame() { 
    timeUp = true; // Stop countdown
    clearInterval(countdown); // Clear countdown timer
    peep() = null; // Deactivate peep() function
}

// Toggle start/end game
toggleGame.addEventListener('click', function () { // Listen for click of button to start/end game
    function gameFunction() {
        if (toggleGame.textContent === "Start Game") { // If text of button is "Start Game", 
            toggleGame.textContent = "End Game"; // change text to "End Game"
            startGame(); // and call startGame() function
        } else if (toggleGame.textContent === "End Game") { // If text of button is "End Game", 
            toggleGame.textContent = "Start Game"; // change text to "Start Game"
            endGame(); // and call endGame() function
        }
    }
    gameFunction(); // Call gameFunction() function when button is clicked
});