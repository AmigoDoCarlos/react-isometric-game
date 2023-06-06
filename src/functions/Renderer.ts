import Floor from "../classes/Floor";
import Player from "../classes/Player";
import InteractiveObject from "../classes/InteractiveObject";
import { OBJECTS_HITBOX, PLAYER_HITBOX, SHOW_DISTANCE_TO_BOTTOM_CORNER } from "../constants";
import { position } from "../types";

interface RendererProps {
    context: CanvasRenderingContext2D,
    players: React.MutableRefObject<Player[]>;
    objects: React.MutableRefObject<InteractiveObject[]>;
    floor: React.MutableRefObject<Floor | undefined>;
}

type ObjectAndDistance = {
    object: Player | InteractiveObject;
    origin: position;
    distance: number; 
}

const renderDistance = (canvas: CanvasRenderingContext2D, origin: position, floor: Floor) => {
    const destination = floor.getBottomCornerCoordinates();
    canvas.strokeStyle = "red";
    canvas.lineWidth = 5;
    canvas.beginPath();
    canvas.moveTo(origin.x, origin.y);
    canvas.lineTo(destination.x, destination.y);
    canvas.stroke();
    canvas.closePath();
}

export default function RenderAll({context, players, objects, floor} : RendererProps) {   
    const ground = floor.current;
    if(!ground) return;
    const renderables: ObjectAndDistance[] = [];

    players.current && players.current.forEach(p => {
        const { x, y, width, height } = p.getPositionAndSize(PLAYER_HITBOX);
        const origin = {x: x + width / 2, y: y + height};
        renderables.push({
            object: p,
            origin: origin,
            distance: ground.getDistanceToBottomCorner({
                x: origin.x,
                y: origin.y,
            }),
        });
    });

    objects.current.forEach(o => {
        const { x, y, width, height } = o.getPositionAndSize(OBJECTS_HITBOX);
        const origin = {x: x + width / 2, y: y + height};
        renderables.push({
            object: o,
            origin: origin,
            distance: ground.getDistanceToBottomCorner({
                x: origin.x,
                y: origin.y,
            }),
        });
    });

    ground.render(context);
    renderables.sort((a, b) => b.distance - a.distance);
    renderables.forEach(r => {
        r.object.render(context);
        SHOW_DISTANCE_TO_BOTTOM_CORNER && renderDistance(context, r.origin, ground);
    });
}