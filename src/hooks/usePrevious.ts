import { useRef } from "react";

export default function usePrevious(value: number){
    const currentRef = useRef(value);
    const previousRef = useRef(0);

    if(currentRef.current !== value){
        previousRef.current = currentRef.current;
        currentRef.current = value;
    }

    return previousRef.current;
}