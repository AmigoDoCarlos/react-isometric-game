import { position } from "../types";
import { Sprite } from "./Sprite";
import Sound from "./Sound";

export class DraggableObject {
    name: string;
    size: number;
    sprite: Sprite;
    sound: Sound;

    constructor(spriteSrc: string, size: number, name: string, sound: string){
        this.size = size;
        this.sound = new Sound(sound);
        this.sprite = new Sprite(spriteSrc, size, 1, 1, 0);
        this.name = name;
    }

    playSound(){
        this.sound.play();
    };

    getSize() {
        return this.size;
    }

    setSize(newSize: number) {
        this.size = newSize;
        this.sprite.setSize(newSize);
    }

    render(canvas: CanvasRenderingContext2D, position: position){
        this.sprite.render(canvas, {x: position.x - (this.size/2), y: position.y});
    }
}