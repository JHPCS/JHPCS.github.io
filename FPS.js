let score = 0; // Initialize score variable
let timeLeft = 60; // Initialize time left in seconds

// Function to update the timer display
function updateTimer() {
    document.getElementById("timer").innerText = "Time Left: " + timeLeft + "s";
}

// Function to handle the timer countdown
function countdown() {
    if (timeLeft > 0) {
        timeLeft--;
        updateTimer();
    } else {
        clearInterval(timerInterval); // Stop the timer when time is up
        showGameOverScreen();
    }
}

// Start the timer countdown
const timerInterval = setInterval(countdown, 1000);

document.addEventListener("mousemove", function(event) {
    const crosshair = document.querySelector(".crosshair");
    crosshair.style.left = event.clientX + "px";
    crosshair.style.top = event.clientY + "px";
});

document.addEventListener("mousedown", function(event) {
    event.preventDefault(); // Prevent default selection behavior
});

document.addEventListener("click", function(event) {
    const crosshair = document.querySelector(".crosshair");

    // Get all target elements
    const targets = document.querySelectorAll('.target');

    targets.forEach(target => {
        const targetRect = target.getBoundingClientRect();
        const crosshairRect = crosshair.getBoundingClientRect();

        if (isColliding(targetRect, crosshairRect)) {
            if (target.style.backgroundColor !== "green") { // Check if the target is not already hit
                target.style.backgroundColor = "green";
                setTimeout(() => {
                    target.style.backgroundColor = "red"; // Reset color to red after some time
                }, 1000); // Adjust this time delay as needed

                // Increment score based on target position
                if (target.classList.contains("target-top")) {
                    score += 3; // Top target gives 3 points
                } else if (target.classList.contains("target-bottom")) {
                    score += 1; // Bottom target gives 1 point
                } else {
                    score += 2; // Normal target gives 2 points
                }
                document.getElementById("score").innerText = "Score: " + score;
            }
            // Reset target position
            target.style.left = "0";

            // Reset target shootable state
            target.shootable = true;
        }
    });
});

// Function to display game over screen with final score and play again button
function showGameOverScreen() {
    const gameContainer = document.querySelector(".game-container");
    gameContainer.innerHTML = ""; // Clear the game container

    const gameOverScreen = document.createElement("div");
    gameOverScreen.classList.add("game-over-screen");
    gameOverScreen.innerHTML = "<h1>Time's Up!</h1><p>Final Score: " + score + "</p><button onclick='window.location.href=\"https://arfg.space/FPS.html\"'>Play Again</button>";
    gameContainer.appendChild(gameOverScreen);
}

function isColliding(rect1, rect2) {
    return !(rect1.right < rect2.left || 
             rect1.left > rect2.right || 
             rect1.bottom < rect2.top || 
             rect1.top > rect2.bottom);
}

// Initialize and update the timer display
updateTimer();
