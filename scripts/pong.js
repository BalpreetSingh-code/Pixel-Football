let canvas = document.querySelector("canvas");
let context = canvas.getContext("2d");
const keys = {};

// Ensure the canvas can receive input
canvas.tabIndex = 1;

// Set the original Field.png dimensions
const ORIGINAL_CANVAS_WIDTH = 1500; // Exact width of Field.png
const ORIGINAL_CANVAS_HEIGHT = 750; // Exact height of Field.png

// Variables to track scaling factors
let scaleX, scaleY;

// Define new left and right limits (closer to the goals)
const LEFT_LIMIT = 286; // Distance from the left goal
const RIGHT_LIMIT = ORIGINAL_CANVAS_WIDTH - 330; // Distance from the right goal

// Paddle constants (relative to the original canvas size)
const PADDLE_WIDTH = 70;
const PADDLE_HEIGHT = 70;
const PADDLE_SPEED = 500;

// Ball constants (relative to the original canvas size)
const BALL_RADIUS = 20;

// Load player character data from localStorage
const player1Character = localStorage.getItem('player1Character');
const player2Character = localStorage.getItem('player2Character');
const gameDuration = parseInt(localStorage.getItem('gameDuration'), 10);

// Load skins for paddles
const paddle1Image = new Image();
paddle1Image.src = `https://mc-heads.net/avatar/${player1Character}/100`;

const paddle2Image = new Image();
paddle2Image.src = `https://mc-heads.net/avatar/${player2Character}/100`;

// Timer variables
let timerInterval;
let remainingTime = gameDuration * 60; // Convert minutes to seconds
const durationDisplay = document.createElement("div");
durationDisplay.id = "gameDurationDisplay";
document.body.appendChild(durationDisplay);

// Initial game element positions
let ballX, ballY;
let ballSpeedX = 400; // Pixels per second
let ballSpeedY = 400;

let player1Y = ORIGINAL_CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2; // Centered vertically
let player2Y = ORIGINAL_CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2; // Centered vertically

let player1Score = 0;
let player2Score = 0;

let startGame = false;

// Load the ball image
const ballImage = new Image();
ballImage.src = "../public/SoccerBall.png"; // Path to your ball image

// Function to dynamically resize the canvas and recalculate scaling factors
function resizeCanvas() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Calculate canvas dimensions while maintaining aspect ratio
    if (windowWidth / windowHeight > ORIGINAL_CANVAS_WIDTH / ORIGINAL_CANVAS_HEIGHT) {
        canvas.height = windowHeight;
        canvas.width = windowHeight * (ORIGINAL_CANVAS_WIDTH / ORIGINAL_CANVAS_HEIGHT);
    } else {
        canvas.width = windowWidth;
        canvas.height = windowWidth / (ORIGINAL_CANVAS_WIDTH / ORIGINAL_CANVAS_HEIGHT);
    }

    // Update scaling factors
    scaleX = canvas.width / ORIGINAL_CANVAS_WIDTH;
    scaleY = canvas.height / ORIGINAL_CANVAS_HEIGHT;

    // Reset ball and paddle positions
    resetBall();
    player1Y = canvas.height / 2 - PADDLE_HEIGHT * scaleY / 2;
    player2Y = canvas.height / 2 - PADDLE_HEIGHT * scaleY / 2;

    context.clearRect(0, 0, canvas.width, canvas.height);
    render();
}

// Add event listener for resizing the window
window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // Set initial canvas size

// Add event listeners for controls
document.addEventListener("keydown", handleKeyPressDown);
document.addEventListener("keyup", handleKeyPressUp);
document.getElementById("startButton").addEventListener("click", () => {
    resetGame();
    startGame = true;
    updateScoreboard();
    startTimer(); // Start the game timer
});

function handleKeyPressDown(event) {
    keys[event.key] = true;
}

function handleKeyPressUp(event) {
    keys[event.key] = false;
}

let lastTime = 0;
// Function called every frame
function GameLoop(currentTime = 0) {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    if (startGame) {
        update(deltaTime);
    }
    render();

    requestAnimationFrame(GameLoop);
}

function update(dt) {
    // Player 1 movement
    if (keys.w) {
        player1Y -= PADDLE_SPEED * dt * scaleY;
        if (player1Y < 0) player1Y = 0;
    } else if (keys.s) {
        player1Y += PADDLE_SPEED * dt * scaleY;
        if (player1Y > canvas.height - PADDLE_HEIGHT * scaleY)
            player1Y = canvas.height - PADDLE_HEIGHT * scaleY;
    }

    // Player 2 movement
    if (keys.ArrowUp) {
        player2Y -= PADDLE_SPEED * dt * scaleY;
        if (player2Y < 0) player2Y = 0;
    } else if (keys.ArrowDown) {
        player2Y += PADDLE_SPEED * dt * scaleY;
        if (player2Y > canvas.height - PADDLE_HEIGHT * scaleY)
            player2Y = canvas.height - PADDLE_HEIGHT * scaleY;
    }

    // Ball movement
    ballX += ballSpeedX * dt * scaleX;
    ballY += ballSpeedY * dt * scaleY;

    // Ball collision with top and bottom walls
    if (ballY - BALL_RADIUS * scaleY < 0 || ballY + BALL_RADIUS * scaleY > canvas.height) {
        ballSpeedY *= -1;
    }

    // Ball collision with paddles
    if (
        ballX - BALL_RADIUS * scaleX < LEFT_LIMIT * scaleX + PADDLE_WIDTH * scaleX &&
        ballY > player1Y &&
        ballY < player1Y + PADDLE_HEIGHT * scaleY
    ) {
        ballSpeedX *= -1;
        ballX = LEFT_LIMIT * scaleX + PADDLE_WIDTH * scaleX + BALL_RADIUS * scaleX; // Prevent sticking
    } else if (
        ballX + BALL_RADIUS * scaleX > RIGHT_LIMIT * scaleX - PADDLE_WIDTH * scaleX &&
        ballY > player2Y &&
        ballY < player2Y + PADDLE_HEIGHT * scaleY
    ) {
        ballSpeedX *= -1;
        ballX = RIGHT_LIMIT * scaleX - PADDLE_WIDTH * scaleX - BALL_RADIUS * scaleX; // Prevent sticking
    }

    // Check if ball touches left or right barriers
    if (ballX - BALL_RADIUS * scaleX < LEFT_LIMIT * scaleX) {
        // Player 2 scores
        player2Score++;
        resetBall("player2");
    } else if (ballX + BALL_RADIUS * scaleX > RIGHT_LIMIT * scaleX) {
        // Player 1 scores
        player1Score++;
        resetBall("player1");
    }
}

function render() {
    // Clear the screen
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the paddles
    context.drawImage(paddle1Image, LEFT_LIMIT * scaleX, player1Y, PADDLE_WIDTH * scaleX, PADDLE_HEIGHT * scaleY);
    context.drawImage(paddle2Image, RIGHT_LIMIT * scaleX - PADDLE_WIDTH * scaleX, player2Y, PADDLE_WIDTH * scaleX, PADDLE_HEIGHT * scaleY);

    // Draw the ball image
    const ballSizeX = BALL_RADIUS * 2 * scaleX;
    const ballSizeY = BALL_RADIUS * 2 * scaleY;
    context.drawImage(ballImage, ballX - BALL_RADIUS * scaleX, ballY - BALL_RADIUS * scaleY, ballSizeX, ballSizeY);

    // Draw scores
    context.fillStyle = "white";
    context.font = `${20 * scaleY}px Arial`;
    context.fillText(`Player 1: ${player1Score}`, 20 * scaleX, 30 * scaleY);
    context.fillText(`Player 2: ${player2Score}`, canvas.width - 120 * scaleX, 30 * scaleY);
}

function resetGame() {
    resetBall();
    player1Y = canvas.height / 2 - PADDLE_HEIGHT * scaleY / 2;
    player2Y = canvas.height / 2 - PADDLE_HEIGHT * scaleY / 2;
    player1Score = 0;
    player2Score = 0;
    updateScoreboard();
    startTimer(); // Restart the timer
}

function resetBall(lastScorer) {
    if (player1Score === 0 && player2Score === 0) {
        // Spawn ball in the center for the first serve
        ballX = canvas.width / 2.07;
        ballY = canvas.height / 1.95;

        // Randomize initial direction
        ballSpeedX = 300 * (Math.random() > 0.5 ? 1 : -1); // Random X direction
        ballSpeedY = 300 * (Math.random() > 0.5 ? 1 : -1); // Random Y direction
    } else {
        // Spawn ball on the side of the player who got scored on
        if (lastScorer === "player1") {
            // Ball spawns on Player 2's side
            ballX = Math.random() * (RIGHT_LIMIT - canvas.width / 2) + canvas.width / 2;
            ballSpeedX = -Math.abs(300 * (1 + (Math.random() - 0.5) * 0.2)); // Move towards Player 1
        } else {
            // Ball spawns on Player 1's side
            ballX = Math.random() * (canvas.width / 2 - LEFT_LIMIT) + LEFT_LIMIT;
            ballSpeedX = Math.abs(300 * (1 + (Math.random() - 0.5) * 0.2)); // Move towards Player 2
        }

        // Random vertical position for the ball
        ballY = Math.random() * (canvas.height - 2 * BALL_RADIUS) + BALL_RADIUS;

        // Random vertical direction and speed
        ballSpeedY = 300 * (Math.random() > 0.5 ? 1 : -1) * (1 + (Math.random() - 0.5) * 0.4);
    }

    updateScoreboard();
}

function updateScoreboard() {
    document.getElementById("player1Score").textContent = player1Score;
    document.getElementById("player2Score").textContent = player2Score;
}

function startTimer() {
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        remainingTime--;
        updateTimerDisplay();
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            alert("Time's up! Game over!");
            resetGame();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function updateTimerDisplay() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    const durationDisplay = document.getElementById("gameDurationDisplay");
    durationDisplay.textContent = `Time Left: ${minutes}:${seconds.toString().padStart(2, "0")}`;
}

GameLoop();