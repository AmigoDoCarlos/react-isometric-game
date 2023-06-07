import { keyAndIcon } from "../types";
import eKey from "../assets/icons/e-key.png";
import fKey from "../assets/icons/f-key.png";

export const ACTION_KEYS: keyAndIcon[] = [      //todo objeto iterável deve obedecer essa sequência de teclas (não necessariamente todas)
    {
        key: 'e',               //ação primária
        icon: eKey,
    },{
        key: 'f',               //ação secundária
        icon: fKey,
    },

    //demais ações...
];

export const CANVAS_WIDTH = 1000;
export const CANVAS_HEIGHT = 700;
export const FLOOR_PADDING = 10;
export const FLOOR_TOP_Y = 100;
export const PLAYER_SIZE = 100;
export const DRAWER_SIZE = 225;
export const DESK_SIZE = 220;
export const V_DESK_SIZE = 400;
export const PLAYER_SPEED = 0.4;
export const ANIMATION_PERIOD = 100;

export const PLAYER_HITBOX = 0.25;
export const OBJECTS_HITBOX = 0.35;

export const SHOW_HITBOX = false;
export const SHOW_DISTANCE_TO_BOTTOM_CORNER = false;

export const ISOMETRIC_ANGLE = Math.PI / 6;
export const ISOMETRIC_RATIO = Math.cos(Math.PI / 4) * Math.cos(ISOMETRIC_ANGLE); //o ângulo de visualização do mapa é de 30° de inclinação, por isso esta constante