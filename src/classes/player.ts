type position = {
    x: number,
    y: number
}

const ISOMETRIC_RATIO = Math.cos(Math.PI / 4) * Math.cos(Math.PI / 6);      //o ângulo de visualização do mapa é de 30° de inclinação, por isso precisamos desta constante

export class player {
    name: string;
    sprite: HTMLImageElement;
    quad: number[];
    speed: number;
    isWalking: boolean;
    maxWalkCount: number;            //número de renders chamados para cada mudança de sprite
    walkCount: number;               //iterador entre 0 e walkCount
    position: position;
    dp: position;
    direction: string;
    lastFrame: number;
    allowedDirections = ['up', 'down', 'left', 'right'];
    keyPressed: string | undefined;

    constructor (name: string, sprite: string, initialPos: position, speed: number) {
        this.name = name;
        this.isWalking = false;
        this.speed = speed;
        this.position = initialPos;
        this.dp = {x: 0, y: 0};
        this.direction = 'right';

        this.sprite = new Image();
        this.sprite.src = sprite;
        this.lastFrame = 0;
        this.quad = [0, 0];
        this.walkCount = 0;
        this.maxWalkCount = 100;

        window.addEventListener('keydown', (e) => this.keyPressed = e.key);
        window.addEventListener('keyup', () => this.keyPressed = undefined);
    }

    

    private updateDirection(dt: number, direction: string){
        if(!this.allowedDirections.includes(direction)) return;
        this.direction = direction;
        switch(direction){
            case 'up':
                this.dp = {x: this.speed * dt, y: -this.speed * ISOMETRIC_RATIO * dt};
                this.quad = [this.walk(dt, this.quad[0]), 2];
            break;
            case 'down': 
                this.dp = {x: -this.speed * dt, y: this.speed * ISOMETRIC_RATIO * dt};
                this.quad = [this.walk(dt, this.quad[0]), 1];
            break;
            case 'left':
                this.dp = {x: -this.speed * dt, y: -this.speed * ISOMETRIC_RATIO * dt};
                this.quad = [this.walk(dt, this.quad[0]), 3];
            break;
            case 'right':
                this.dp = {x: this.speed * dt, y: this.speed * ISOMETRIC_RATIO * dt};
                this.quad = [this.walk(dt, this.quad[0]), 0];    
            break;
        }
    }

    private updatePosition(){
        this.position = {
            x: this.position.x + (this.dp.x),
            y: this.position.y + (this.dp.y), 
        }
    }

    private walk(dt: number, n: number){
        if(this.walkCount < this.maxWalkCount){
            this.walkCount += dt;
            return n;
        }
        this.walkCount = 0;
        if(n > 0){
            return 0;
        }
        return 1;
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

    getAnimation(){
        if(this.isWalking) return `${this.direction}Walking`;
        return this.direction;
    }

    getPositionAndSize(){
        const sizeRatio = (this.sprite.width / 2) / (this.sprite.height / 4);

        return {
            x: this.position.x,
            y: this.position.y,
            width: 200 * sizeRatio,
            height: 200,
        }
    }

    ////////////////////////////////////////////////////////////////////////////////

    update(dt: number, walkDirection: string | undefined){
        if(walkDirection){
            this.setWalking(true);
            this.updateDirection(dt, walkDirection);
            this.updatePosition();
        } else {
            this.setWalking(false);
            this.dp = {x: 0, y: 0};
            this.quad = [0, this.quad[1]];
        }
    }

    render(canvas: CanvasRenderingContext2D){
        const w = this.sprite.width;
        const h = this.sprite.height;

        canvas.drawImage(
            this.sprite,                                        // src da imagem a ser desenhada
            this.quad[0] * (w/2), this.quad[1] * (h/4),         // coordenadas X e Y, relativos à própria imagem, do início do quadrante
            (w / 2), (h / 4),                                   // tamanho do quadrante (width, height)
            this.position.x, this.position.y,                   // coordenadas X e Y do início do desenho (canto superior esquerdo)
            200, 200,                                           // tamanho final da imagem (width, height)
        );
    }
}