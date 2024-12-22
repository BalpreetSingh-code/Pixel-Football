import { Player } from './player.js';

export class Character extends Player {
    constructor(name, age, characterName, characterSkin) {
        super(name, age);
        this.characterName = characterName; // Name of the character
        this.characterSkin = characterSkin; // Skin of the character
        this.health = 100; // Default health
        this.speed = 10; // Default speed
        this.mana = 50; // Default mana (optional)
    }

    // Example method: Character description
    getDescription() {
        return `${this.characterName} (${this.characterSkin}) with ${this.health} HP and ${this.speed} speed.`;
    }
}