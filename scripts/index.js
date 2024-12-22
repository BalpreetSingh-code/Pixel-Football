import { Player } from '../classes/player.js';

document.getElementById('playerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const player1Name = document.getElementById('player1Name').value.trim();
    const player1Age = parseInt(document.getElementById('player1Age').value, 10);
    const player2Name = document.getElementById('player2Name').value.trim();
    const player2Age = parseInt(document.getElementById('player2Age').value, 10);

    if (!player1Name || isNaN(player1Age) || !player2Name || isNaN(player2Age)) {
        alert('Please enter valid names and ages for both players.');
        return;
    }

    const player1 = new Player(player1Name, player1Age);
    const player2 = new Player(player2Name, player2Age);

    sessionStorage.setItem('player1', JSON.stringify(player1));
    sessionStorage.setItem('player2', JSON.stringify(player2));

    window.location.href = './pages/character-selection.html';
});