import { useRef } from 'react';

export default function useLoop(callback: (dt: number) => void){
    const lastTS = useRef(0);

    const loop = (ts: number) => {
        const dt = ts - lastTS.current;
        lastTS.current = ts;
        callback(dt);
        requestAnimationFrame(loop);
    }

    if(lastTS.current === 0){
        requestAnimationFrame(loop);
    }
}