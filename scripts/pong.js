let canvas = document.querySelector("canvas");
let context = canvas.getContext("2d");
const keys = {};

// Ensure the canvas can receive input
canvas.tabIndex = 1;

// Set the original Field.png dimensions
const ORIGINAL_CANVAS_WIDTH = 1500;
const ORIGINAL_CANVAS_HEIGHT = 750;

// Variables to track scaling factors
let scaleX, scaleY;

// Define limits for goals (aligned with paddle positions)
const LEFT_LIMIT = 286;
const RIGHT_LIMIT = ORIGINAL_CANVAS_WIDTH - 330;

// Paddle constants
const PADDLE_WIDTH = 70;
const PADDLE_HEIGHT = 70;

// Ball constants
const BALL_RADIUS = 20;

// Load character and game data from localStorage
const player1Character = JSON.parse(localStorage.getItem("player1Character"));
const player2Character = JSON.parse(localStorage.getItem("player2Character"));
const gameDuration = parseInt(localStorage.getItem("gameDuration"), 10);

// Validate character data
if (!player1Character || !player2Character) {
    alert("Character data is missing. Redirecting to character-selection page...");
    window.location.href = "../pages/character-selection.html";
}

// Paddle speeds based on character speed (increased by a factor of 20 for responsiveness)
const player1PaddleSpeed = (player1Character.speed + 10) * 20;
const player2PaddleSpeed = (player2Character.speed + 10) * 20;

// Health variables
let player1Health = player1Character.health;
let player2Health = player2Character.health;

// Load skins for paddles
const paddle1Image = new Image();
paddle1Image.src = `https://mc-heads.net/avatar/${player1Character.skin}/100`;

const paddle2Image = new Image();
paddle2Image.src = `https://mc-heads.net/avatar/${player2Character.skin}/100`;

// Ball image
const ballImage = new Image();
ballImage.src = "../public/SoccerBall.png";

// Timer variables
let timerInterval;
let remainingTime = gameDuration * 60;

// Health bar colors
let player1HealthColor = "blue";
let player2HealthColor = "red";

// Fetch colors from the CSS Colors API
function fetchHealthBarColors() {
    fetch("https://www.csscolorsapi.com/api/colors/green")
        .then((response) => response.json())
        .then((data) => {
            if (data.colors && data.colors.length > 0) {
                player1HealthColor = `#${data.colors[0].hex}`;
            }
        })
        .catch((error) => console.error("Error fetching color for Player 1:", error));

    fetch("https://www.csscolorsapi.com/api/colors/blue")
        .then((response) => response.json())
        .then((data) => {
            if (data.colors && data.colors.length > 0) {
                player2HealthColor = `#${data.colors[0].hex}`;
            }
        })
        .catch((error) => console.error("Error fetching color for Player 2:", error));
}

// Call the function to fetch colors
fetchHealthBarColors();

// Initial game element positions
let ballX = ORIGINAL_CANVAS_WIDTH / 2;
let ballY = ORIGINAL_CANVAS_HEIGHT / 2;
let ballSpeedX = 0; // Ball remains still until the game starts
let ballSpeedY = 0;

let player1Y = ORIGINAL_CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2;
let player2Y = ORIGINAL_CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2;

let startGame = false;

// Function to dynamically resize the canvas
function resizeCanvas() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    if (windowWidth / windowHeight > ORIGINAL_CANVAS_WIDTH / ORIGINAL_CANVAS_HEIGHT) {
        canvas.height = windowHeight;
        canvas.width = windowHeight * (ORIGINAL_CANVAS_WIDTH / ORIGINAL_CANVAS_HEIGHT);
    } else {
        canvas.width = windowWidth;
        canvas.height = windowWidth / (ORIGINAL_CANVAS_WIDTH / ORIGINAL_CANVAS_HEIGHT);
    }

    scaleX = canvas.width / ORIGINAL_CANVAS_WIDTH;
    scaleY = canvas.height / ORIGINAL_CANVAS_HEIGHT;

    player1Y = canvas.height / 2 - PADDLE_HEIGHT * scaleY / 2;
    player2Y = canvas.height / 2 - PADDLE_HEIGHT * scaleY / 2;

    render();
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Event listeners for controls
document.addEventListener("keydown", (event) => (keys[event.key] = true));
document.addEventListener("keyup", (event) => (keys[event.key] = false));
document.getElementById("startButton").addEventListener("click", () => {
    startGame = true;
    ballSpeedX = Math.random() > 0.5 ? 300 : -300;
    ballSpeedY = Math.random() > 0.5 ? 200 : -200;
    startTimer();
    GameLoop();
});

// Timer logic
function startTimer() {
    const timerDisplay = document.getElementById("gameTimer");
    timerInterval = setInterval(() => {
        remainingTime--;
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        timerDisplay.textContent = `Time Left: ${minutes}:${seconds.toString().padStart(2, "0")}`;

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            alert("Time's up! Game Over!");
            stopGame("Time's up!");
        }
    }, 1000);
}

// Stop the game
function stopGame(message) {
    startGame = false;
    alert(message);
    clearInterval(timerInterval);
}

// Game loop
let lastTime = 0;
function GameLoop(currentTime = 0) {
    if (!startGame) return;
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    update(deltaTime);
    render();

    requestAnimationFrame(GameLoop);
}

function update(deltaTime) {
    // Player 1 movement
    if (keys.w) player1Y = Math.max(player1Y - player1PaddleSpeed * deltaTime, 0);
    if (keys.s) player1Y = Math.min(player1Y + player1PaddleSpeed * deltaTime, canvas.height - PADDLE_HEIGHT * scaleY);

    // Player 2 movement
    if (keys.ArrowUp) player2Y = Math.max(player2Y - player2PaddleSpeed * deltaTime, 0);
    if (keys.ArrowDown) player2Y = Math.min(player2Y + player2PaddleSpeed * deltaTime, canvas.height - PADDLE_HEIGHT * scaleY);

    // Ball movement
    ballX += ballSpeedX * deltaTime;
    ballY += ballSpeedY * deltaTime;

    // Ball collisions with walls
    if (ballY - BALL_RADIUS < 0 || ballY + BALL_RADIUS > canvas.height) ballSpeedY *= -1;

    // Ball collisions with paddles
    if (
        ballX - BALL_RADIUS < LEFT_LIMIT * scaleX + PADDLE_WIDTH * scaleX &&
        ballY > player1Y &&
        ballY < player1Y + PADDLE_HEIGHT * scaleY
    ) {
        ballSpeedX *= -1;
        ballX = LEFT_LIMIT * scaleX + PADDLE_WIDTH * scaleX + BALL_RADIUS;
    }

    if (
        ballX + BALL_RADIUS > RIGHT_LIMIT * scaleX - PADDLE_WIDTH * scaleX &&
        ballY > player2Y &&
        ballY < player2Y + PADDLE_HEIGHT * scaleY
    ) {
        ballSpeedX *= -1;
        ballX = RIGHT_LIMIT * scaleX - PADDLE_WIDTH * scaleX - BALL_RADIUS;
    }

    // Scoring conditions
    if (ballX - BALL_RADIUS < LEFT_LIMIT * scaleX) {
        player1Health -= 10; // Player 2 loses health
        resetBall("player2");
        checkGameOver();
    } else if (ballX + BALL_RADIUS > RIGHT_LIMIT * scaleX) {
        player2Health -= 10; // Player 1 loses health
        resetBall("player1");
        checkGameOver();
    }
}

function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Player 1 paddle
    context.drawImage(paddle1Image, LEFT_LIMIT * scaleX, player1Y, PADDLE_WIDTH * scaleX, PADDLE_HEIGHT * scaleY);

    // Draw Player 2 paddle
    context.drawImage(paddle2Image, RIGHT_LIMIT * scaleX - PADDLE_WIDTH * scaleX, player2Y, PADDLE_WIDTH * scaleX, PADDLE_HEIGHT * scaleY);

    // Draw the ball
    context.drawImage(ballImage, ballX - BALL_RADIUS, ballY - BALL_RADIUS, BALL_RADIUS * 2, BALL_RADIUS * 2);

    // Draw health bars
    const healthBarWidth = canvas.width / 4;
    const healthBarHeight = 20;

    context.fillStyle = player1HealthColor;
    context.fillRect(20, 20, (player1Health / player1Character.health) * healthBarWidth, healthBarHeight);

    context.fillStyle = player2HealthColor;
    context.fillRect(
        canvas.width - healthBarWidth - 20,
        20,
        (player2Health / player2Character.health) * healthBarWidth,
        healthBarHeight
    );

    // Draw health numbers
    context.fillStyle = "white";
    context.font = "20px Arial";
    context.fillText(`Health: ${player1Health}`, 20, 50);
    context.fillText(`Health: ${player2Health}`, canvas.width - healthBarWidth - 20, 50);
}

function resetBall(lastScorer) {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = lastScorer === "player1" ? -300 : 300;
    ballSpeedY = Math.random() > 0.5 ? 200 : -200;
}

function checkGameOver() {
    if (player1Health <= 0) stopGame("Player 2 Wins!");
    if (player2Health <= 0) stopGame("Player 1 Wins!");
}

GameLoop();