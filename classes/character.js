import { Player } from './player.js';

export class Character extends Player {
    constructor(name, age, characterName, characterSkin) {
        super(name, age);
        this.characterName = characterName;
        this.characterSkin = characterSkin;
        this.health = 100;
        this.speed = 10;
    }
}