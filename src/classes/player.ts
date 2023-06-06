import { position } from "../types";
import InteractiveObject from "./InteractiveObject";
import FloatingText from "./FloatingText";
import Sprite from "./Sprite";
import { ISOMETRIC_RATIO, OBJECTS_HITBOX, PLAYER_HITBOX, SHOW_HITBOX } from "../constants";

export default class Player {
  name: FloatingText;
  sprite: Sprite;
  speed: number;
  size: number;
  position: position;
  dp: position;
  direction: string;
  allowedDirections = ["right", "down", "up", "left"];
  isWalking: boolean;

  constructor(
    name: string,
    spriteSrc: string,
    position: position,
    speed: number,
    size: number,
    animationPeriod: number
  ) {
    this.name = new FloatingText(name, null);
    this.isWalking = false;
    this.speed = speed;
    this.size = size;
    this.position = position;
    this.dp = { x: 0, y: 0 };
    this.direction = "left";
    this.sprite = new Sprite(spriteSrc, size, 4, 2, animationPeriod);
  }

  private updateDirection(dt: number, direction: string) {
    const dir = this.allowedDirections.indexOf(direction);
    if (dir < 0) return;

    switch (direction) {
      case "up":
        this.dp = { x: this.speed * dt, y: -this.speed * ISOMETRIC_RATIO * dt };
        break;
      case "down":
        this.dp = { x: -this.speed * dt, y: this.speed * ISOMETRIC_RATIO * dt };
        break;
      case "left":
        this.dp = {
          x: -this.speed * dt,
          y: -this.speed * ISOMETRIC_RATIO * dt,
        };
        break;
      case "right":
        this.dp = { x: this.speed * dt, y: this.speed * ISOMETRIC_RATIO * dt };
        break;
    }

    this.direction = direction;
    this.sprite.update(dt, dir);
    this.setWalking(true);
  }

  private updatePosition() {
    this.position = {
      x: this.position.x + this.dp.x,
      y: this.position.y + this.dp.y,
    };
  }

  private reset() {
    this.dp = { x: 0, y: 0 };
    this.sprite.reset();
    this.setWalking(false);
  }

  getSize() {
    return this.size;
  }

  setSize(newSize: number) {
    this.size = newSize;
    this.sprite.setSize(newSize);
  }

  setWalking(state: boolean) {
    this.isWalking = state;
  }

  setSpeed(amount: number) {
    this.speed = amount;
  }

  setPosition(pos: position) {
    this.position = pos;
  }

  getPositionAndSize(hitbox?: number) {
    const h = this.sprite.source.height;
    const w = this.sprite.source.width;
    const ratio = h / this.sprite.rows / (w / this.sprite.columns);

    const margin = hitbox && (hitbox > 0 && hitbox <= 1)
    ? ((1 - hitbox) * this.size) / 2
    : 0;

    return {
      x: this.position.x + margin,
      y: this.position.y + margin,
      width: (this.size - 2 * margin),
      height: (this.size * ratio - 2 * margin),
    };
  }

  private hasCollided(
    invaderX: number,
    invaderY: number,
    invaderW: number,
    invaderH: number
  ) {
    const { x, y, width, height } = this.getPositionAndSize(PLAYER_HITBOX);
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

  private checkForCollisions(objects: InteractiveObject[]) {
    objects.forEach((object) => {
      let highlight = false;
      const { x, y, width, height } = object.getPositionAndSize(OBJECTS_HITBOX);
      if (this.hasCollided(x, y, width, height)) {
        highlight = true;
      } 
      object.setHighlight(highlight);
    });
  }

  private hitbox(canvas: CanvasRenderingContext2D){
    const { x, y, width, height } = this.getPositionAndSize(PLAYER_HITBOX);
    canvas.fillStyle = "lime";
    canvas.fillRect(x, y, width, height);
  }

  ////////////////////////////////////////////////////////////////////////////////

  update(dt: number, objects: InteractiveObject[], walkDirection: string | undefined) {
    this.checkForCollisions(objects);
    if (walkDirection) {
      this.updateDirection(dt, walkDirection);
      this.updatePosition();
    } else {
      this.reset();
    }
  }

  render(canvas: CanvasRenderingContext2D) {
    this.sprite.render(canvas, this.position);
    this.name.render(canvas, {
      x: this.position.x + this.size / 2,
      y: this.position.y - 5,
    });

    SHOW_HITBOX && this.hitbox(canvas);
  }
}
