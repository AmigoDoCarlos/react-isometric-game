import { position } from "../types";

export function getDistance(origin: position, destination: position){
    return Math.hypot(origin.x - destination.x, origin.y - destination.y);
}