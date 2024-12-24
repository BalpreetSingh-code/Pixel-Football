import { Player } from '../classes/player.js';

// Add event listeners for live validation
document.getElementById('player1Age').addEventListener('input', function () {
    validateAge('player1Age', 'Player 1 age must be greater than 10.');
});

document.getElementById('player2Age').addEventListener('input', function () {
    validateAge('player2Age', 'Player 2 age must be greater than 10.');
});

function validateAge(inputId, errorMessage) {
    const input = document.getElementById(inputId);
    const value = parseInt(input.value, 10);

    if (isNaN(value) || value <= 10) {
        input.setCustomValidity(errorMessage);
        input.reportValidity(); // Display the validation message
    } else {
        input.setCustomValidity(''); // Clear validation message
    }
}

// Handle form submission
document.getElementById('playerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const player1Name = document.getElementById('player1Name').value.trim();
    const player1Age = parseInt(document.getElementById('player1Age').value, 10);
    const player2Name = document.getElementById('player2Name').value.trim();
    const player2Age = parseInt(document.getElementById('player2Age').value, 10);

    // Validate final inputs before submission
    if (!player1Name || player1Age < 10 || player1Age > 100 || isNaN(player1Age)) {
        alert('Player 1 must enter a valid name and a age between 10-100.');
        return;
    }

    if (!player2Name || player2Age < 10 || player2Age > 100 || isNaN(player2Age)) {
        alert('Player 2 must enter a valid name and an age between 10-100');
        return;
    }

    // Create Player objects
    const player1 = new Player(player1Name, player1Age);
    const player2 = new Player(player2Name, player2Age);

    // Store player data in sessionStorage
    sessionStorage.setItem('player1', JSON.stringify(player1));
    sessionStorage.setItem('player2', JSON.stringify(player2));

    // Redirect to character selection page
    window.location.href = './pages/character-selection.html';
});