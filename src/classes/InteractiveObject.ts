import { textAndSound } from "../types";
import { Sprite } from "./Sprite";
import { ACTION_KEYS, OBJECTS_HITBOX, SHOW_HITBOX } from "../constants";
import FloatingText from "./FloatingText";
import Sound from "./Sound";

type position = {
  x: number;
  y: number;
};

export class InteractiveObject {          //clase para representar os objetos que o usuário pode interagir
  size: number;                           //tamanho (largura, pra ser mais exato. O comprimento é calculado automaticamente a partir dela)
  position: position;                     //coordenadas [x,y] da quina superior esquerda do sprite
  sprite: Sprite;                         
  isHighlighted: boolean;
  states: number;                         //quantos estados o objeto pode ter (= quantos quads horizontais o sprite do objeto tem)
  currentState: number;                   
  lastKeyPressed: string | undefined;     
  actionTarget: number;                   
  actions: {                              //conjunto de ações que o objeto pode responder 
    sound: Sound;                         //qual som é feito quando a ação dispara
    object: FloatingText;                 //objeto de texto a ser exibido
    options: string[];                    //opções de texto a serem exibidas no objeto
  }[];

  constructor(
    spriteSrc: string,
    size: number,
    states: number,
    position: position,
    actions: textAndSound[],
  ) {
    this.sprite = new Sprite(spriteSrc, size, 2, states, 0);
    this.size = size;
    this.position = position;
    this.isHighlighted = false;
    this.states = states;
    this.currentState = 0;
    this.lastKeyPressed = undefined;
    this.actions = [];
    this.actionTarget = 1;
    actions.forEach((action, index) => {
      if(index < ACTION_KEYS.length){
        this.actions = [
          ...this.actions,
          {
            options: action.texts,
            sound: new Sound(action.sound),
            object: new FloatingText(action.texts[0], ACTION_KEYS[index].icon),
          },
        ];
      }
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

  setHighlight(high: boolean){
    this.isHighlighted = high;
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

  private hitbox(canvas: CanvasRenderingContext2D){
    const { x, y, width, height } = this.getPositionAndSize(OBJECTS_HITBOX);
    canvas.fillStyle = "lime";
    canvas.fillRect(x, y, width, height);
  }

  private toggleState(key: string | undefined) {                            //função relativamente problemática por ser difícil de escalar.
    const index = ACTION_KEYS.findIndex((action) => action.key === key);   //atualmente só funciona bem com 3 estados.

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

  update(keyPressed: string | undefined) {
    if (!this.lastKeyPressed && this.isHighlighted) {
      this.toggleState(keyPressed);
    }
    this.sprite.setQuad([this.currentState, this.isHighlighted ? 1 : 0]);
    this.lastKeyPressed = keyPressed;
  }

  render(canvas: CanvasRenderingContext2D) {
    this.sprite.render(canvas, this.position);
    this.renderTexts(canvas);

    SHOW_HITBOX && this.hitbox(canvas);
  }
}
