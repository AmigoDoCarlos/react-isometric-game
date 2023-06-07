import { ISOMETRIC_ANGLE } from "../constants";
import { getDistance } from "../functions/Metrics";
import { position } from "../types";
import { Sprite } from "./Sprite";

export class Floor {
    sprite: Sprite;
    position: position;
    topCornerCoordinates: position;

    constructor(spriteSrc: string, position: position, size: number){
        this.sprite = new Sprite(spriteSrc, size, 1, 1, 0);
        this.position = position;
        this.topCornerCoordinates = {
            x: position.x + size / 2,
            y: position.y,
        }
    }

    setSprite(newSprite: string){
        this.sprite.setSource(newSprite);
    }

    setPosition(newPosition: position){
        this.position = newPosition;
        this.topCornerCoordinates = {
            x: newPosition.x + this.sprite.getSize() / 2,
            y: newPosition.y,
        }
    }

    setSize(newSize: number){
        this.sprite.setSize(newSize);
    }

    getTopCornerCoordinates(){
        return this.topCornerCoordinates;
    }

    getBottomCornerCoordinates(){
        return {
            x: this.topCornerCoordinates.x,
            y: this.topCornerCoordinates.y + this.sprite.getSize() * Math.tan(ISOMETRIC_ANGLE),
        }
    }

    getDistanceToBottomCorner(origin: position){
        const destiny = this.getBottomCornerCoordinates();
        return getDistance(origin, destiny);
    }

    ////////////////////////////////////////////////////////////////////

    update(){
        //nothing to see here, folks
    }

    render(canvas: CanvasRenderingContext2D){
        this.sprite.render(canvas, this.position);
    }
}