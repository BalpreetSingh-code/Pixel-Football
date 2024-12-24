import { Player } from './player.js';

export class Character extends Player {
    constructor(name, age, characterName, characterSkin, health, speed) {
        super(name, age);
        this.characterName = characterName; // Name of the character
        this.characterSkin = characterSkin; // Skin of the character
        this.health = health; // Unique health value
        this.speed = speed; // Unique speed value
    }

    // Factory method to create characters with unique attributes
    static createCharacter(playerName, playerAge, baseSkin) {
        const uniqueAttributes = {
            Steve: { health: 120, speed: 8 },
            Alex: { health: 110, speed: 10 },
            Creeper: { health: 150, speed: 6 },
            Zombie: { health: 140, speed: 7 },
            Enderman: { health: 130, speed: 9 },
            Skeleton: { health: 100, speed: 12 },
            Herobrine: { health: 160, speed: 5 },
            Villager: { health: 90, speed: 11 },
        };

        const attributes = uniqueAttributes[baseSkin] || { health: 100, speed: 10 };
        return new Character(playerName, playerAge, baseSkin, `${baseSkin} Skin`, attributes.health, attributes.speed);
    }

    // Method to describe the character
    getDescription() {
        return `${this.characterName} (${this.characterSkin}) with these POWERS: ${this.health} HP and ${this.speed} speed.`;
    }
}