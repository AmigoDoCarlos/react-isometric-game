import { useEffect, useRef, useState } from "react";
import { Body, EscapeRoom, Score, ScoreBoard } from "./App.style";
import { useGlobalContext } from "./contexts";
import { player } from "./classes/player";
import { target } from "./classes/target";
import Button from "./components/Button";
import playerSprite from './assets/sprite.png';   //importação normal do arquivo de imagem
import targetSprite from './assets/target.png';
import floorSprite from './assets/floor.png';

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 600;
const TARGET_SIZE = 50;
const SPEED = 0.5;

const floor = new Image();
floor.src = floorSprite;

export default function App() {

  const { keyPressed, animationFrame } = useGlobalContext();
  const [score, setScore] = useState<number>(0);
  const lastAnimationFrame = useRef(0);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);   //ref do canvas
  const ctx = useRef<CanvasRenderingContext2D | null>(null);  //ref do contexto do canvas

  const players = useRef<player[]>([]);
  const targets = useRef<target[]>([]);
  
  const spawnPlayer = () => {
    players.current = [...players.current, new player(
      'kevin',
      playerSprite,
      {
        x: 0,
        y: 0
      },
      SPEED,
    )];

    targets.current = [...targets.current, new target(
      targetSprite,
      TARGET_SIZE,
      {
        x: (CANVAS_WIDTH - TARGET_SIZE)/2, 
        y: (CANVAS_HEIGHT - TARGET_SIZE)/2,
      }
    )];
  }

  const drawFloor = (context: CanvasRenderingContext2D) => {    
    context.drawImage(floor, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  useEffect(() => {
    if(canvasRef.current){                                // se o canvas já está definido,
      ctx.current = canvasRef.current.getContext('2d');   // então associa o context a ele
    }
  }, [canvasRef]);


  useEffect(() => {
    console.log(keyPressed);
    if(ctx.current && (animationFrame !== lastAnimationFrame.current)){
      const context = ctx.current;
      const pl = [...players.current];
      const tg = [...targets.current];
      const dt = (animationFrame - lastAnimationFrame.current);           //diferença de tempo, em milisegundos, entre o frame atual e o último
      
      context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);               //limpeza do canvas
      drawFloor(context);

      pl.forEach(p => {                                                   //update e render do vetor de players
        p.update(dt, keyPressed);
        p.render(context);
      });

      tg.forEach(t => {                                                   //update e render do vetor de alvos
        t.update(dt, pl, CANVAS_WIDTH, CANVAS_HEIGHT, () => setScore(previous => previous + 1));
        t.render(context);
      });

      players.current = pl;
      targets.current = tg;
      lastAnimationFrame.current = animationFrame;
    }
  }, [ctx.current, players.current, keyPressed, animationFrame, lastAnimationFrame]);

  
  return (
    <Body>
      <ScoreBoard>
        <Score>
          Pontos: {score}
        </Score>

        <EscapeRoom                         // EscapeRoom é um canvas styled component
          width={`${CANVAS_WIDTH}px`}
          height={`${CANVAS_HEIGHT}px`}
          ref={canvasRef}
        />

      </ScoreBoard>
      <Button onClick={spawnPlayer}>
        Começar
      </Button>
    </Body>
  )
}