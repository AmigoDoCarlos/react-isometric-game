import { position } from '../types';
import FloatingText from './FloatingText';
import { Sprite } from './Sprite';

const ISOMETRIC_RATIO = Math.cos(Math.PI / 4) * Math.cos(Math.PI / 6);      //o ângulo de visualização do mapa é de 30° de inclinação, por isso precisamos desta constante

export class Player {
    name: FloatingText;
    sprite: Sprite;
    speed: number;
    size: number;
    position: position;
    dp: position;
    direction: string;
    allowedDirections = ['right', 'down', 'up', 'left'];
    isWalking: boolean;

    constructor (name: string, spriteSrc: string, initialPos: position, speed: number, size: number, animationPeriod: number) {       
        this.name = new FloatingText(name, null);
        this.isWalking = false;
        this.speed = speed;
        this.size = size;
        this.position = initialPos;
        this.dp = {x: 0, y: 0};
        this.direction = 'left';
        this.sprite = new Sprite(spriteSrc, size, 4, 2, animationPeriod);
    }

    private updateDirection(dt: number, direction: string){
        const dir = this.allowedDirections.indexOf(direction);
        if(dir < 0) return;

        switch(direction){
            case 'up':
                this.dp = {x: this.speed * dt, y: -this.speed * ISOMETRIC_RATIO * dt};
            break;
            case 'down': 
                this.dp = {x: -this.speed * dt, y: this.speed * ISOMETRIC_RATIO * dt};
            break;
            case 'left':
                this.dp = {x: -this.speed * dt, y: -this.speed * ISOMETRIC_RATIO * dt};
            break;
            case 'right':
                this.dp = {x: this.speed * dt, y: this.speed * ISOMETRIC_RATIO * dt}; 
            break;
        }

        this.direction = direction;
        this.sprite.update(dt, dir);
        this.setWalking(true);
    }

    private updatePosition(){
        this.position = {
            x: this.position.x + (this.dp.x),
            y: this.position.y + (this.dp.y), 
        }
    }

    private reset(){
        this.dp = {x: 0, y: 0};
        this.sprite.reset();
        this.setWalking(false);
    };

    getSize(){
        return this.size;
    }

    setSize(newSize: number){
        this.size = newSize;
        this.sprite.setSize(newSize);
    }

    setWalking(state: boolean){
        this.isWalking = state;
    }

    setSpeed(amount: number){
        this.speed = amount;
    }

    setPosition(pos: position){
        this.position = pos;
    }

    getPositionAndSize(hitbox?: number){
        const h = this.sprite.source.height;
        const w = this.sprite.source.width;
        const ratio = (h / this.sprite.rows) / (w / this.sprite.columns);
        
        const margin = (hitbox && (hitbox > 0) && (hitbox <= 1))
        ? ((1 - hitbox) / 2) * this.size
        : 0;

        return {
            x: this.position.x,
            y: this.position.y,
            width: this.size - margin,
            height: (this.size * ratio) - margin,
        }
    }

    ////////////////////////////////////////////////////////////////////////////////

    update(dt: number, walkDirection: string | undefined){
        if(walkDirection){
            this.updatePosition();
            this.updateDirection(dt, walkDirection);
        } else {
            this.reset();
        }
    }

    render(canvas: CanvasRenderingContext2D){
        this.sprite.render(canvas, this.position);
        this.name.render(canvas, {x: this.position.x + (this.size/2), y: this.position.y - 5});
    }
}