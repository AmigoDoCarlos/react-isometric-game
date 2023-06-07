import { InteractiveObject } from "../classes/InteractiveObject";
import { Player } from "../classes/Player";
import { Floor}  from "../classes/Floor";

interface UpdaterProps {
    dt: number,
    key: React.MutableRefObject<string | undefined>,
    players: React.MutableRefObject<Player[]>;
    objects: React.MutableRefObject<InteractiveObject[]>;
    floor: React.MutableRefObject<Floor | undefined>;
}

export default function UpdateAll({dt, key, players, objects, floor}: UpdaterProps){
    floor.current && floor.current.update();

    objects.current.forEach((o) => {
        o.update(key.current);
    });

    players.current.forEach((p) => {
        p.update(dt, objects.current, key.current);
    });    
}