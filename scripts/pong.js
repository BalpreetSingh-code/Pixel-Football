let canvas = document.querySelector("canvas");
let context = canvas.getContext("2d");
const keys = {};

// Ensure the canvas can receive input
canvas.tabIndex = 1;

// Create the canvas constants and set the dimensions
const CANVAS_WIDTH = 1246; // Matches width in CSS
const CANVAS_HEIGHT = 1035; // Matches height in CSS
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

// Create the paddle constants
const PADDLE_WIDTH = 70;
const PADDLE_HEIGHT = 70;
const PADDLE_SPEED = 500;

// Ball constants
const BALL_RADIUS = 25;
let ballX = CANVAS_WIDTH / 2.0;
let ballY = CANVAS_HEIGHT / 2.0;
let ballSpeedX = 400; // Pixels per second
let ballSpeedY = 400;

// Load the ball image (handled via CSS for display)
const ballImage = new Image();
ballImage.src = "../public/SoccerBall.png"; // Path to your ball image

// Store paddle positions
let player1Y = 0;
let player2Y = CANVAS_HEIGHT - PADDLE_HEIGHT;

// Scoring system
let player1Score = 0;
let player2Score = 0;

// Game state
let startGame = false;

// Add event listeners
document.addEventListener("keydown", handleKeyPressDown);
document.addEventListener("keyup", handleKeyPressUp);
document.getElementById("startButton").addEventListener("click", () => {
    resetGame();
    startGame = true;
    updateScoreboard();
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
        player1Y -= PADDLE_SPEED * dt;
        if (player1Y < 0) {
            player1Y = 0;
        }
    } else if (keys.s) {
        player1Y += PADDLE_SPEED * dt;
        if (player1Y > CANVAS_HEIGHT - PADDLE_HEIGHT) {
            player1Y = CANVAS_HEIGHT - PADDLE_HEIGHT;
        }
    }

    // Player 2 movement
    if (keys.ArrowUp) {
        player2Y -= PADDLE_SPEED * dt;
        if (player2Y < 0) {
            player2Y = 0;
        }
    } else if (keys.ArrowDown) {
        player2Y += PADDLE_SPEED * dt;
        if (player2Y > CANVAS_HEIGHT - PADDLE_HEIGHT) {
            player2Y = CANVAS_HEIGHT - PADDLE_HEIGHT;
        }
    }

    // Ball movement
    ballX += ballSpeedX * dt;
    ballY += ballSpeedY * dt;

    // Ball collision with top and bottom walls
    if (ballY - BALL_RADIUS < 0 || ballY + BALL_RADIUS > CANVAS_HEIGHT) {
        ballSpeedY *= -1;
    }

    // Ball collision with paddles
    if (
        ballX - BALL_RADIUS < PADDLE_WIDTH &&
        ballY > player1Y &&
        ballY < player1Y + PADDLE_HEIGHT
    ) {
        ballSpeedX *= -1;
        ballX = PADDLE_WIDTH + BALL_RADIUS; // Prevent sticking
    } else if (
        ballX + BALL_RADIUS > CANVAS_WIDTH - PADDLE_WIDTH &&
        ballY > player2Y &&
        ballY < player2Y + PADDLE_HEIGHT
    ) {
        ballSpeedX *= -1;
        ballX = CANVAS_WIDTH - PADDLE_WIDTH - BALL_RADIUS; // Prevent sticking
    }

    // Check if ball goes out of bounds
    if (ballX - BALL_RADIUS < 0) {
        player2Score++;
        resetBall();
    } else if (ballX + BALL_RADIUS > CANVAS_WIDTH) {
        player1Score++;
        resetBall();
    }
}

function render() {
    // Clear the screen
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw the paddles
    context.fillStyle = "white";
    context.fillRect(0, player1Y, PADDLE_WIDTH, PADDLE_HEIGHT);
    context.fillRect(CANVAS_WIDTH - PADDLE_WIDTH, player2Y, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw the ball image
    const ballSize = BALL_RADIUS * 2; // Diameter of the ball
    context.drawImage(ballImage, ballX - BALL_RADIUS, ballY - BALL_RADIUS, ballSize, ballSize);
}

function resetGame() {
    resetBall();
    player1Y = 0;
    player2Y = CANVAS_HEIGHT - PADDLE_HEIGHT;
    player1Score = 0;
    player2Score = 0;
    updateScoreboard();
}

function resetBall() {
    ballX = CANVAS_WIDTH / 2;
    ballY = CANVAS_HEIGHT / 2;
    ballSpeedX = 300 * (Math.random() > 0.5 ? 1 : -1); // Randomize direction
    ballSpeedY = 300 * (Math.random() > 0.5 ? 1 : -1);
    updateScoreboard();
}

function updateScoreboard() {
    document.getElementById("player1Score").textContent = player1Score;
    document.getElementById("player2Score").textContent = player2Score;
}

GameLoop();