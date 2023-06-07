import { ACTION_KEYS } from "../constants";
import { getDistance } from "../functions/Metrics";
import { position } from "../types";
import { DraggableObject } from "./DraggableObject";
import { FloatingText } from "./FloatingText";

export class Slot {
    position: position;
    object: DraggableObject | undefined;
    text: FloatingText;

    constructor(position: position, object: DraggableObject | undefined){
        this.position = position;
        this.object = object;
        this.text = new FloatingText((object)? object.name : 'vazio', ACTION_KEYS[1].icon);
    }

    getDistanceTo(location: position){
        return getDistance(this.position, location);
    };

    getPosition(){
        return this.position;
    }

    setPosition(newPos: position){
        this.position = newPos;
    }

    setText(newText: string){
        this.text.setText(newText);
    }

    render(canvas: CanvasRenderingContext2D, showText: boolean){
        this.object && this.object.render(canvas, this.position);
        showText && this.text.render(canvas, {x: this.position.x, y: this.position.y - 10});
    }
}