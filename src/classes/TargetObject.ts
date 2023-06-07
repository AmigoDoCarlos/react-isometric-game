import { Player } from "./Player";
import { Sprite } from "./Sprite";

type position = {
  x: number;
  y: number;
};

export class TargetObject {
  size: number;
  position: position;
  sprite: Sprite;

  constructor(
    spriteSrc: string,
    size: number,
    initialPos: position,
    animationPeriod: number
  ) {
    this.sprite = new Sprite(spriteSrc, size, 1, 2, animationPeriod);
    this.size = size;
    this.position = initialPos;
  }

  getSize() {
    return this.size;
  }

  setSize(newSize: number) {
    this.size = newSize;
    this.sprite.setSize(newSize);
  }

  setPosition(pos: position) {
    this.position = pos;
  }

  getAllDimensions(hitbox?: number) {
    const h = this.sprite.source.height;
    const w = this.sprite.source.width;
    const ratio = h / this.sprite.rows / (w / this.sprite.columns);

    const margin =
      hitbox && hitbox > 0 && hitbox <= 1 ? ((1 - hitbox) / 2) * this.size : 0;

    return {
      x: this.position.x,
      y: this.position.y,
      width: this.size - margin,
      height: this.size * ratio - margin,
    };
  }

  private hasCollided(
    invaderX: number,
    invaderY: number,
    invaderW: number,
    invaderH: number
  ) {
    const { x, y, width, height } = this.getAllDimensions(0.5);

    if (
      invaderX < x + width &&
      invaderX + invaderW > x &&
      invaderY < y + height &&
      invaderY + invaderH > y
    ) {
      return true;
    }
    return false;
  }

  private checkForCollisions(
    players: Player[],
    canvasW: number,
    canvasH: number,
    scorePoints: () => void
  ) {
    players.forEach((player) => {
      const { x, y, width, height } = player.getAllDimensions();
      if (this.hasCollided(x, y, width, height)) {
        scorePoints();
        this.setPosition({
          x: 20 + (canvasW - (20 + width)) * Math.random(),
          y: 20 + (canvasH - (20 + height)) * Math.random(),
        });
      }
    });
  }

  ////////////////////////////////////////////////////////////////////////////////

  update(
    dt: number,
    players: Player[],
    canvasW: number,
    canvasH: number,
    scorePoints: () => void
  ) {
    this.checkForCollisions(players, canvasW, canvasH, scorePoints);
    this.sprite.update(dt);
  }

  render(canvas: CanvasRenderingContext2D) {
    this.sprite.render(canvas, this.position);
  }
}
