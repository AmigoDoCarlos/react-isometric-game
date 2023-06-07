import { InteractiveObject } from "../classes/InteractiveObject";
import { DraggableObject } from "../classes/DraggableObject";
import { Floor } from "../classes/Floor";
import floorSprite from "../assets/floor.png";
import drawerSprite from "../assets/drawer.png";
import deskSprite from "../assets/desk.png";
import vDeskSprite from "../assets/v-desk.png";
import bottleSprite from "../assets/bottle.png";
import paperSprite from "../assets/paper.png";
import doorSound from "../assets/sounds/door.mp3";
import wooshSound from "../assets/sounds/woosh1.mp3";
import glassSound from "../assets/sounds/glass.mp3";
import paperSound from "../assets/sounds/paper.mp3";


import { CANVAS_WIDTH, CANVAS_HEIGHT, DRAWER_SIZE, DESK_SIZE, FLOOR_TOP_Y, FLOOR_PADDING, OBJECTS_HITBOX, V_DESK_SIZE } from "../constants";
import { Slot } from "../classes/Slot";

interface SceneBuilderProps {
    objects: React.MutableRefObject<InteractiveObject[]>,
    floor: React.MutableRefObject<Floor | undefined>,
}

export default function BuildScene({objects, floor}: SceneBuilderProps){
    objects.current = [

      //ARMÁRIO///////////////////////////////////////////////////////////////////////////
      new InteractiveObject(
        drawerSprite,
        DRAWER_SIZE,
        {
          x: 120,
          y: (CANVAS_HEIGHT - DRAWER_SIZE) / 5,
        }, [
          {
            offset: {
              x: 90,
              y: 155,
            },
            size: DRAWER_SIZE * OBJECTS_HITBOX,
          },
          {
            offset: {
              x: 135,
              y: 135,
            },
            size: DRAWER_SIZE * OBJECTS_HITBOX,
          },
        ], 
        [
          new Slot(
            {x: DRAWER_SIZE / 2, y: DRAWER_SIZE / 2 - 10},
            new DraggableObject(bottleSprite, 18, 'garrafa', glassSound),
          )
        ],
        false,
        {
          sound: doorSound,
          texts: ["abrir o armário", "fechar o armário"],
        },
      ),

      //MESA COM COMPUTADOR///////////////////////////////////////////////////////////////////////////
      new InteractiveObject(
        deskSprite,
        DESK_SIZE,
        {
          x: CANVAS_WIDTH - (DESK_SIZE + 170),
          y: (CANVAS_HEIGHT - DESK_SIZE) / 6,
        }, [
          {
            offset: {
              x: 10,
              y: 85,
            },
            size: DESK_SIZE * OBJECTS_HITBOX,
          },
          {
            offset: {
              x: 37,
              y: 105,
            },
            size: DESK_SIZE * OBJECTS_HITBOX,
          },
          {
            offset: {
              x: 65,
              y: 125,
            },
            size: DESK_SIZE * OBJECTS_HITBOX,
          },
        ], [
          new Slot(
            {x: DESK_SIZE * 0.55, y: DESK_SIZE * 0.4 },
            new DraggableObject(paperSprite, 70, 'papel', paperSound),
          )
        ],
        false,
        {
          sound: wooshSound,
          texts: ["abrir o notebook", "fechar o notebook"],
        }
      ),

      //MESA EM L///////////////////////////////////////////////////////////////////////////
      new InteractiveObject(
        vDeskSprite,
        V_DESK_SIZE,
        {
          x: (CANVAS_WIDTH - V_DESK_SIZE) / 2,
          y: (CANVAS_HEIGHT) - 275,
        }, [
          {
            offset: {
              x: 60,
              y: 10,
            },
            size: V_DESK_SIZE * OBJECTS_HITBOX,
          },
          {
            offset: {
              x: 200,
              y: 10,
            },
            size: V_DESK_SIZE * OBJECTS_HITBOX,
          },
        ], [
            new Slot(
              { x: V_DESK_SIZE * 0.18, y: V_DESK_SIZE * 0.04 },
              undefined,
            ),
            new Slot(
              { x: V_DESK_SIZE * 0.5, y: V_DESK_SIZE * 0.2 },
              undefined,
            ),
            new Slot(
              {x: V_DESK_SIZE * 0.8, y: V_DESK_SIZE * 0.04 },
              undefined,
            )
        ],
        true,
      ),
    ];
  
    floor.current = new Floor(floorSprite, { x: FLOOR_PADDING, y: FLOOR_TOP_Y}, CANVAS_WIDTH - 2 * FLOOR_PADDING);
}