import { hitbox, textAndSound, position } from "../types";
import { Sprite } from "./Sprite";
import { ACTION_KEYS, SHOW_HITBOX } from "../constants";
import { FloatingText } from "./FloatingText";
import { Player } from "./Player";
import { Slot } from "./Slot";
import Sound from "./Sound";
import { DraggableObject } from "./DraggableObject";

export class InteractiveObject {          //clase para representar os objetos que o usuário pode interagir
  size: number;                           //tamanho (largura, pra ser mais exato. O comprimento é calculado automaticamente a partir dela)
  position: position;                     //coordenadas [x,y] da quina superior esquerda do sprite
  sprite: Sprite;                         
  isHighlighted: boolean;
  canBeOpened: boolean;
  isOpen: boolean;                
  lastKeyPressed: string | undefined;     
  actionTarget: number;    
  hitboxes: hitbox[];                
  action: {                              //ação que o objeto pode responder 
    sound: Sound;                         //qual som é feito quando a ação dispara
    object: FloatingText;                 //objeto de texto a ser exibido
    options: string[];                    //opções de texto a serem exibidas no objeto
  } | undefined;
  slots?: Slot[];
  slotsAlwaysVisible: boolean;

  constructor(
    spriteSrc: string,
    size: number,
    position: position,
    hitboxes: hitbox[],
    slots: Slot[],
    slotsAlwaysVisible: boolean,
    action?: textAndSound,
  ) {
    this.canBeOpened = (action)? true : false;
    this.sprite = new Sprite(spriteSrc, size, 2, (action)? 2 : 1, 0);
    this.size = size;
    this.position = position;
    this.isHighlighted = false;
    this.actionTarget = 1;
    this.hitboxes = hitboxes;
    this.isOpen = false;
    this.action = (action)? {
        options: action.texts,
        sound: new Sound(action.sound),
        object: new FloatingText(action.texts[0], ACTION_KEYS[0].icon),
      } : undefined;
    this.slotsAlwaysVisible = slotsAlwaysVisible;
    slots.forEach(slot => {
      const relativePos = slot.getPosition();
      slot.setPosition({x: position.x + relativePos.x, y: position.y + relativePos.y});   //passando de coordenadas relativas para absolutas
    });
    this.slots = slots;
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

  setHitboxes(newHitboxes: hitbox[]){
    this.hitboxes = newHitboxes;
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

  private toggleState(key: string | undefined) {
    if(key !== ACTION_KEYS[0].key || !this.action) return;

    this.action.sound.play();
    this.isOpen = !this.isOpen;
  }

  getNearestItem(){
    if(!this.slots || this.slots.length === 0) return undefined;
    return this.slots[0].object;
  }

  takeItem(){
    if(!this.slots || this.slots.length === 0) return;
    this.slots[0].object = undefined;
  }

  putItem(item: DraggableObject){
    if(!this.slots || this.slots.length === 0) return;
    this.slots[0].object = item;
  }

  orderSlotsAccordingToDistance(player: Player){
    if(!this.slots) return;
    const {x, y, width, height} = player.getAllDimensions();
    const p = {x: x + width/2, y: y + height}; 
    this.slots.sort((a, b) => (a.getDistanceTo(p) - b.getDistanceTo(p)));   
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

  private renderTexts(canvas: CanvasRenderingContext2D) {
    if (!this.isHighlighted || !this.action) return;

    const pos = {
      x: this.position.x + this.size / 2,
      y: this.position.y,
    };

    const action =
      this.isOpen
        ? this.action.options[1]
        : this.action.options[0];
    this.action.object.setText(action);

    this.action.object.render(canvas, {
      x: pos.x,
      y: pos.y,
    });
  } 

  private renderSlots(canvas: CanvasRenderingContext2D){
    if(this.slots && (this.slotsAlwaysVisible || this.isOpen)){
      this.slots.forEach((slot, i) => {
        (i === 0) && slot.setText((slot.object)? `pegar ${slot.object.name}` : 'vazio');
        slot.render(canvas, this.isHighlighted && (i === 0));
      })
    }
  }

  ////////////////////////////////////////////////////////////////////////////////

  update(keyPressed: string | undefined) {
    if (!this.lastKeyPressed && this.isHighlighted) {
      this.toggleState(keyPressed);
    }
    this.sprite.setQuad([this.isOpen ? 1 : 0, this.isHighlighted ? 1 : 0]);
    this.lastKeyPressed = keyPressed;
  }

  render(canvas: CanvasRenderingContext2D) {
    this.sprite.render(canvas, this.position);
    this.renderTexts(canvas);
    this.renderSlots(canvas);

    SHOW_HITBOX && this.renderHitboxes(canvas);
  }
}
