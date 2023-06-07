import { hitbox, position } from "../types";
import { InteractiveObject } from "./InteractiveObject";
import { FloatingText } from "./FloatingText";
import { Sprite } from "./Sprite";
import { ACTION_KEYS, ISOMETRIC_RATIO, SHOW_HITBOX } from "../constants";
import { DraggableObject } from "./DraggableObject";

export class Player {
  name: FloatingText;
  sprite: Sprite;
  speed: number;
  size: number;
  position: position;
  dp: position;
  direction: string;
  allowedDirections = ["right", "down", "up", "left"];
  isWalking: boolean;
  hitboxes: hitbox[]; 
  items: DraggableObject[];
  lastKeyPressed: string | undefined;  

  constructor(
    name: string,
    spriteSrc: string,
    position: position,
    speed: number,
    size: number,
    animationPeriod: number,
    hitboxes: hitbox[],
  ) {
    this.name = new FloatingText(name, null);
    this.isWalking = false;
    this.speed = speed;
    this.size = size;
    this.position = position;
    this.dp = { x: 0, y: 0 };
    this.direction = "left";
    this.sprite = new Sprite(spriteSrc, size, 4, 2, animationPeriod);
    this.hitboxes = hitboxes;
    this.items = [];
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

  getAllDimensions() {
    const h = this.sprite.source.height;
    const w = this.sprite.source.width;
    const ratio = h / this.sprite.rows / (w / this.sprite.columns);

    return {
      x: this.position.x,
      y: this.position.y,                                                                                                                   
      width: (this.size),
      height: (this.size * ratio),
      hitboxes: this.hitboxes,
    };
  }

  private hasCollided(
    invaderX: number,
    invaderY: number,
    invaderHitboxes: hitbox[],
  ) {
    let hit = false;
    const { x, y, hitboxes } = this.getAllDimensions();
    hitboxes && hitboxes.forEach(myHitbox => { 
      invaderHitboxes.forEach(hitbox => {
        if (
          invaderX + hitbox.offset.x < x + myHitbox.offset.x + myHitbox.size &&
          invaderX + hitbox.offset.x + hitbox.size > x + myHitbox.offset.x &&
          invaderY + hitbox.offset.y < y + myHitbox.offset.y + myHitbox.size &&
          invaderY + hitbox.offset.y + hitbox.size > y + myHitbox.offset.y
        ) {
          hit = true;
          return true;
        }
      });
    });
    return hit;
  }

  private checkForCollisions(objects: InteractiveObject[]) {
    objects.forEach((object) => {
      let highlight = false;
      const { x, y, hitboxes } = object.getAllDimensions();
      if (this.hasCollided(x, y, hitboxes)) {
        object.orderSlotsAccordingToDistance(this);
        highlight = true;
      } 
      object.setHighlight(highlight);
    });
  }

  private renderHitboxes(canvas: CanvasRenderingContext2D){
    canvas.fillStyle = "lime";
    this.hitboxes.forEach(hit => {
      canvas.fillRect(
        this.position.x + hit.offset.x,
        this.position.y + hit.offset.y,
        hit.size,
        hit.size,
      );
    });
  }

  getNearestItem(){
    if(!this.items || this.items.length === 0) return null;
    return this.items[0];
  }

  takeItem(){
    if(!this.items || this.items.length === 0) return;
    this.items.splice(0, 1);
  }

  putItem(item: DraggableObject){
    this.items.unshift(item);
  }

  handleItems(objects: InteractiveObject[], key: string){
    if(key !== ACTION_KEYS[1].key || this.lastKeyPressed) return;

    const index = objects.findIndex(o => o.isHighlighted);
    if (index < 0) return;

    const nearestObject = objects[index];
    if(!nearestObject.isOpen && !nearestObject.slotsAlwaysVisible) return;
    const item = nearestObject.getNearestItem();
    if(item){
      nearestObject.takeItem();
      this.putItem(item);
      return item.playSound();
    }
    const myItem = this.getNearestItem();
    console.log(myItem);
    if(!myItem) return;
    this.takeItem();
    nearestObject.putItem(myItem);
    myItem.playSound();
  }

  ////////////////////////////////////////////////////////////////////////////////

  update(dt: number, objects: InteractiveObject[], keyPressed: string | undefined) {
    this.checkForCollisions(objects);
    if (keyPressed) {
      this.handleItems(objects, keyPressed);
      this.updateDirection(dt, keyPressed);
      this.updatePosition();
    } else {
      this.reset();
    }
    this.lastKeyPressed = keyPressed;
  }

  render(canvas: CanvasRenderingContext2D) {
    this.sprite.render(canvas, this.position);
    this.name.render(canvas, {
      x: this.position.x + this.size / 2,
      y: this.position.y - 5,
    });

    SHOW_HITBOX && this.renderHitboxes(canvas);
  }
}
