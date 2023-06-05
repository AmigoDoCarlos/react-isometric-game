import { iconKeyAndTexts } from "../types";
import FloatingText from "./FloatingText";
import { Player } from "./Player";
import Sound from "./Sound";
import { Sprite } from "./Sprite";

type position = {
  x: number;
  y: number;
};

export class InteractiveObject {
  size: number;
  position: position;
  sprite: Sprite;
  isHighlighted: boolean;
  states: number;
  currentState: number;
  lastKeyPressed: string | undefined;
  actionTarget: number;
  actions: {
    key: string;
    sound: Sound;
    object: FloatingText;
    options: string[];
  }[];

  constructor(
    spriteSrc: string,
    size: number,
    initialPos: position,
    animationPeriod: number,
    states: number,
    actions: iconKeyAndTexts[]
  ) {
    this.sprite = new Sprite(spriteSrc, size, 2, states, animationPeriod);
    this.size = size;
    this.position = initialPos;
    this.isHighlighted = false;
    this.states = states;
    this.currentState = 0;
    this.lastKeyPressed = undefined;
    this.actions = [];
    this.actionTarget = 1;
    actions.forEach((action) => {
      this.actions = [
        ...this.actions,
        {
          key: action.key,
          options: action.texts,
          sound: new Sound(action.sound),
          object: new FloatingText(action.texts[0], action.icon),
        },
      ];
    });
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

  getPositionAndSize(hitbox?: number) {
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
    const { x, y, width, height } = this.getPositionAndSize(0.2);
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

  private checkForCollisions(players: Player[], callback?: () => void) {
    players.forEach((player) => {
      const { x, y, width, height } = player.getPositionAndSize();
      if (this.hasCollided(x, y, width, height)) {
        callback && callback();
        this.isHighlighted = true;
      } else {
        this.isHighlighted = false;
      }
    });
  }

  private toggleState(key: string | undefined) {
    const index = this.actions.findIndex((action) => action.key === key);

    switch (index) {
      case -1:
        return;
      case 0:
        this.actions[index].sound.play();
        if (this.currentState === 0) {
          this.actions[index].sound.play();
          return (this.currentState = this.actionTarget);
        }
        this.currentState = 0;
        break;
      default:
        if (this.currentState > 0 && this.currentState < this.states - 1) {
          this.actionTarget += 1;
          this.actions[index].sound.play();
          this.currentState = this.actionTarget;
        }
        break;
    }
  }

  private renderTexts(canvas: CanvasRenderingContext2D) {
    if (!this.isHighlighted) return;

    const pos = {
      x: this.position.x + this.size / 2,
      y: this.position.y,
    };

    const action =
      this.currentState === 0
        ? this.actions[0].options[0]
        : this.actions[0].options[1];
    this.actions[0].object.setText(action);

    this.actions.forEach((action, i) => {
      if (
        i === 0 ||
        (this.currentState > 0 && this.currentState < this.states - 1)
      ) {
        action.object.render(canvas, {
          x: pos.x,
          y: pos.y - i * 30,
        });
      }
    });
  }

  ////////////////////////////////////////////////////////////////////////////////

  update(
    keyPressed: string | undefined,
    players: Player[],
    callback?: () => void
  ) {
    this.checkForCollisions(players, callback);
    if (!this.lastKeyPressed && this.isHighlighted) {
      this.toggleState(keyPressed);
    }
    this.sprite.setQuad([this.currentState, this.isHighlighted ? 1 : 0]);
    this.lastKeyPressed = keyPressed;
  }

  render(canvas: CanvasRenderingContext2D) {
    this.sprite.render(canvas, this.position);
    this.renderTexts(canvas);
  }
}
