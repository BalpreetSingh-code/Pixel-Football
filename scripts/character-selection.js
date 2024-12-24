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
const startBattleButton = document.getElementById('startBattle');
const player1Slot = document.getElementById('player1Slot');
const player2Slot = document.getElementById('player2Slot');
const skins = ['Steve', 'Alex', 'Creeper', 'Zombie', 'Enderman', 'Skeleton', 'Herobrine', 'Villager'];

let selectedCharacters = {
    player1: null,
    player2: null
};

// Generate characters dynamically using the Character class
skins.forEach((skin) => {
    const character = Character.createCharacter('Default Player', 20, skin);

    const characterDiv = document.createElement('div');
    characterDiv.className = 'character';
    characterDiv.innerHTML = `
        <img data-src="https://mc-heads.net/avatar/${skin}/100" alt="${character.characterName}">
        <p>${character.getDescription()}</p>
        <div class="skin-options">
            <button data-skin="${skin}">Default</button>
            <button data-skin="${skin}-Alt">Alt Skin</button>
        </div>
    `;

    characterDiv.querySelectorAll('button').forEach((button) => {
        button.addEventListener('click', () => selectCharacter(character, button.dataset.skin));
    });

    characterGrid.appendChild(characterDiv);
});

// Lazy load character images
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

// Function to select character
function selectCharacter(character, skin) {
    if (!selectedCharacters.player1) {
        selectedCharacters.player1 = { ...character, skin };
        player1Slot.innerHTML = `<img src="https://mc-heads.net/avatar/${skin}/100" alt="${character.characterName}">`;
    } else if (!selectedCharacters.player2) {
        selectedCharacters.player2 = { ...character, skin };
        player2Slot.innerHTML = `<img src="https://mc-heads.net/avatar/${skin}/100" alt="${character.characterName}">`;
    }

    if (selectedCharacters.player1 && selectedCharacters.player2) {
        startBattleButton.disabled = false;
    }
}

// Handle game duration slider
const gameDurationInput = document.getElementById('gameDuration');
const durationValue = document.getElementById('durationValue');
gameDurationInput.addEventListener('input', () => {
    durationValue.textContent = gameDurationInput.value;
});

// Start battle
startBattleButton.addEventListener('click', () => {
    localStorage.setItem('player1Character', JSON.stringify(selectedCharacters.player1));
    localStorage.setItem('player2Character', JSON.stringify(selectedCharacters.player2));
    localStorage.setItem('gameDuration', gameDurationInput.value);
    window.location.href = '../pages/pong.html';
});