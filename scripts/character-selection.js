import { Character } from '../classes/character.js';

const characterGrid = document.getElementById('characterGrid');
const startBattleButton = document.getElementById('startBattle');

// Fetch Minecraft character avatars
async function fetchCharacters() {
    const skins = [
        'Steve', 'Alex', 'Creeper', 'Zombie', 'Enderman', 'Skeleton', 'Herobrine', 'Villager'
    ];

    skins.forEach((skin) => {
        const div = document.createElement('div');
        div.className = 'character';
        div.innerHTML = `
            <img data-src="https://mc-heads.net/avatar/${skin}/100" alt="${skin}">
            <p>${skin}</p>
        `;
        div.addEventListener('click', () => selectCharacter(skin));
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

function selectCharacter(character) {
    console.log(`Character Selected: ${character}`);
}

fetchCharacters();