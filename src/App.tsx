import { useEffect, useRef } from "react";
import { Body, EscapeRoom, ScoreBoard } from "./App.style";
import { useGlobalContext } from "./contexts";
import InteractiveObject from "./classes/InteractiveObject";
import Player from "./classes/Player";
import Floor from "./classes/Floor";
import Button from "./components/Button";
import useLoop from "./hooks/useLoop";
import playerSprite from "./assets/player.png"; //importação normal do arquivo de imagem
import RenderAll from "./functions/Renderer";
import UpdateAll from "./functions/Updater";
import { CANVAS_WIDTH, CANVAS_HEIGHT, PLAYER_SIZE, PLAYER_SPEED, ANIMATION_PERIOD } from "./constants";
import BuildScene from "./functions/SceneBuilder";

const spawnPlayer = (players: React.MutableRefObject<Player[]>) => {
  players.current = [
    ...players.current,
    new Player(
      "Alex Topiroze",
      playerSprite,
      {
        x: (CANVAS_WIDTH - PLAYER_SIZE) / 2,
        y: 30,
      },
      PLAYER_SPEED,
      PLAYER_SIZE,
      ANIMATION_PERIOD
    ),
  ];
};

export default function App() {
  const { keyPressed } = useGlobalContext();

  const canvasRef = useRef<HTMLCanvasElement | null>(null); //ref do canvas
  const ctx = useRef<CanvasRenderingContext2D | null>(null); //ref do contexto do canvas
  const key = useRef<string | undefined>(keyPressed);
  const players = useRef<Player[]>([]);
  const objects = useRef<InteractiveObject[]>([]);
  const floor = useRef<Floor>();

  useEffect(() => {
    BuildScene({objects, floor});
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      // se o canvas já está definido,
      ctx.current = canvasRef.current.getContext("2d"); // então associa o context a ele
    }
  }, [canvasRef]);

  useEffect(() => {
    key.current = keyPressed;
  }, [keyPressed]);

  useLoop((dt) => {
    if (floor.current && ctx.current) {
      const context = ctx.current;
      context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); //limpeza do canvas
      UpdateAll({dt, key, floor, objects, players});
      RenderAll({context, floor, objects, players});
    }
  });

  return (
    <Body>
      <ScoreBoard>
        <EscapeRoom // EscapeRoom é um canvas styled component
          width={`${CANVAS_WIDTH}px`}
          height={`${CANVAS_HEIGHT}px`}
          ref={canvasRef}
        />
      </ScoreBoard>
      <Button onClick={() => spawnPlayer(players)}>Começar</Button>
    </Body>
  );
}
