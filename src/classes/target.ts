import { player } from "./player";

type position = {
    x: number,
    y: number
}

export class target {
    sprite: HTMLImageElement;
    quad: number[];
    size: number;
    moveCount: number;
    maxMoveCount: number;
    position: position;

    constructor (sprite: string, size: number, initialPos: position) {
        this.sprite = new Image();
        this.sprite.src = sprite;
        this.quad = [0 , 0];
        this.size = size;
        this.moveCount = 0;
        this.maxMoveCount = 200;
        this.position = initialPos;
    }

    setSize(newSize: number){
        this.size = newSize;
    }

    setSprite(newSprite: string){
        this.sprite.src = newSprite;
    }

    setPosition(newPos: position){
        this.position = newPos;
    }

    setQuad(newQuad: number[]){
        this.quad = newQuad;
    }

    getPositionAndSize(){
        const sizeRatio = (this.sprite.width / 2) / this.sprite.height;

        return ({
            x: this.position.x,
            y: this.position.y,
            width: this.size * sizeRatio,
            height: this.size,
        })
    }

    private move(dt: number, n: number){
        if(this.moveCount < this.maxMoveCount){
            this.moveCount += dt;
            return n;
        }
        this.moveCount = 0;
        if(n > 0){
            return 0;
        }
        return 1;
    }

    private hasCollided(invaderX: number, invaderY: number, invaderW: number, invaderH: number){
        const {x, y, width, height} = this.getPositionAndSize();

        if((invaderX < (x + width)) && (invaderX + invaderW > (x))
            && (invaderY < (y + height)) && (invaderY + invaderH > (y))
        ){
            return true;
        }
        return false;
    }

    ////////////////////////////////////////////////////////////////////////////////


    update(dt: number, players: player[], canvasW: number, canvasH: number, scorePoints: () => void){
        players.forEach(player => {
            const {x, y, width, height} = player.getPositionAndSize();
            if(this.hasCollided(x, y, width, height)){
                scorePoints();
                this.setPosition({
                    x: 20 + (canvasW - (20 + width)) * Math.random(),
                    y: 20 + (canvasH - (20 + height)) * Math.random(),
                });
            }
        });
        this.quad = [this.move(dt, this.quad[0]), 0];
    }

    render(canvas: CanvasRenderingContext2D){
        const w = this.sprite.width;
        const h = this.sprite.height;
        const ratio = 2 * h / w;

        canvas.drawImage(
            this.sprite,                                        // src da imagem a ser desenhada
            this.quad[0] * (w/2), 0,                            // coordenadas X e Y, relativos à própria imagem, do início do quadrante
            (w / 2), (h),                                       // tamanho do quadrante (width, height)
            this.position.x, this.position.y,                   // coordenadas X e Y do início do desenho (canto superior esquerdo)
            this.size, ratio * this.size,                           // tamanho final da imagem (width, height)
        );
    }
}