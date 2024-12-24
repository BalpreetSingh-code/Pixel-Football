import { Character } from '../classes/character.js';

// Retrieve player data from sessionStorage
const player1 = JSON.parse(sessionStorage.getItem('player1'));
const player2 = JSON.parse(sessionStorage.getItem('player2'));

// Update Player 1 and Player 2 display names
if (player1 && player1.name) {
    document.getElementById('player1NameDisplay').textContent = `${player1.name} (Player 1)`;
}

if (player2 && player2.name) {
    document.getElementById('player2NameDisplay').textContent = `${player2.name} (Player 2)`;
}

// Populate the character grid
const characterGrid = document.getElementById('characterGrid');

async function fetchCharacters() {
    const skins = ['Steve', 'Alex', 'Creeper', 'Zombie', 'Enderman', 'Skeleton', 'Herobrine', 'Villager'];

    skins.forEach((skin) => {
        const character = new Character('Default Name', 20, skin, `${skin} Skin`);
        const div = document.createElement('div');
        div.className = 'character';
        div.innerHTML = `
            <img data-src="https://mc-heads.net/avatar/${skin}/100" alt="${skin}">
            <p>${character.getDescription()}</p>
        `;
        div.addEventListener('click', () => selectCharacter(skin, character));
        characterGrid.appendChild(div);
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach((img) => observer.observe(img));
}

let selectedPlayer1Character = null;
let selectedPlayer2Character = null;

function selectCharacter(skin, character) {
    if (!selectedPlayer1Character) {
        selectedPlayer1Character = skin;
        alert(`Player 1 selected: ${skin}`);
    } else if (!selectedPlayer2Character) {
        selectedPlayer2Character = skin;
        alert(`Player 2 selected: ${skin}`);
    }

    // Enable Start Battle button when both players have selected characters
    if (selectedPlayer1Character && selectedPlayer2Character) {
        document.getElementById('startBattle').disabled = false;
    }
}

// Save data and navigate to pong.html
document.getElementById('startBattle').addEventListener('click', () => {
    const gameDuration = document.getElementById('gameDuration').value;

    // Save to localStorage
    localStorage.setItem('player1Character', selectedPlayer1Character);
    localStorage.setItem('player2Character', selectedPlayer2Character);
    localStorage.setItem('gameDuration', gameDuration);

    // Redirect to pong.html
    window.location.href = '../pages/pong.html';
});

fetchCharacters();