import { InteractiveObject } from "../classes/InteractiveObject";
import { Floor } from "../classes/Floor";
import drawerSprite from "../assets/drawer.png";
import deskSprite from "../assets/desk.png";
import floorSprite from "../assets/floor.png";
import doorSound from "../assets/sounds/door.mp3";
import grabSound from "../assets/sounds/grab.mp3";
import paperSound from "../assets/sounds/paper.mp3";
import wooshSound from "../assets/sounds/woosh1.mp3";
import { CANVAS_WIDTH, CANVAS_HEIGHT, DRAWER_SIZE, DESK_SIZE, FLOOR_TOP_Y, FLOOR_PADDING } from "../constants";

interface SceneBuilderProps {
    objects: React.MutableRefObject<InteractiveObject[]>,
    floor: React.MutableRefObject<Floor | undefined>,
}

export default function BuildScene({objects, floor}: SceneBuilderProps){
    objects.current = [
        new InteractiveObject(
          drawerSprite,
          DRAWER_SIZE,
          3,
          {
            x: 80,
            y: (CANVAS_HEIGHT - DRAWER_SIZE) / 3.4,
          },
          [
            {
              sound: doorSound,
              texts: ["abrir o armário", "fechar o armário"],
            },
            {
              sound: grabSound,
              texts: ["pegar o conteúdo"],
            },
          ]
        ),
        new InteractiveObject(
          deskSprite,
          DESK_SIZE,
          3,
          {
            x: CANVAS_WIDTH - (DRAWER_SIZE + 80),
            y: (CANVAS_HEIGHT - DRAWER_SIZE) / 3.4,
          },
          [
            {
              sound: wooshSound,
              texts: ["abrir o notebook", "fechar o notebook"],
            },
            {
              sound: paperSound,
              texts: ["pegar o papel"],
            },
          ]
        ),
    ];
  
    floor.current = new Floor(floorSprite, { x: FLOOR_PADDING, y: FLOOR_TOP_Y}, CANVAS_WIDTH - 2 * FLOOR_PADDING);
}