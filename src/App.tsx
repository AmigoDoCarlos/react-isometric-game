import { useEffect, useRef } from "react";
import { Body, EscapeRoom, ScoreBoard } from "./App.style";
import { InteractiveObject } from "./classes/InteractiveObject";
import { useGlobalContext } from "./contexts";
import { Player } from "./classes/Player";
import { Sprite } from "./classes/Sprite";
import Button from "./components/Button";
import useLoop from "./hooks/useLoop";
import playerSprite from "./assets/player.png"; //importação normal do arquivo de imagem
import drawerSprite from "./assets/drawer.png";
import deskSprite from "./assets/desk.png";
import floorSprite from "./assets/floor.png";
import eKey from "./assets/icons/e-key.png";
import fKey from "./assets/icons/f-key.png";
import doorSound from "./assets/sounds/door.mp3";
import grabSound from "./assets/sounds/grab.mp3";
import paperSound from "./assets/sounds/paper.mp3";
import wooshSound from "./assets/sounds/woosh1.mp3";

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 700;
const PLAYER_SIZE = 100;
const DRAWER_SIZE = 200;
const DESK_SIZE = 220;
const PLAYER_SPEED = 0.4;
const ANIMATION_PERIOD = 100;

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
  const floor = useRef<Sprite>();

  useEffect(() => {
    objects.current = [
      new InteractiveObject(
        drawerSprite,
        DRAWER_SIZE,
        {
          x: 80,
          y: (CANVAS_HEIGHT - DRAWER_SIZE) / 3.4,
        },
        ANIMATION_PERIOD / 2,
        3,
        [
          {
            key: "e",
            icon: eKey,
            sound: doorSound,
            texts: ["abrir o armário", "fechar o armário"],
          },
          {
            key: "f",
            icon: fKey,
            sound: grabSound,
            texts: ["pegar o conteúdo"],
          },
        ]
      ),
      new InteractiveObject(
        deskSprite,
        DESK_SIZE,
        {
          x: CANVAS_WIDTH - (DRAWER_SIZE + 80),
          y: (CANVAS_HEIGHT - DRAWER_SIZE) / 3.4,
        },
        ANIMATION_PERIOD / 2,
        3,
        [
          {
            key: "e",
            icon: eKey,
            sound: wooshSound,
            texts: ["abrir o notebook", "fechar o notebook"],
          },
          { key: "f", icon: fKey, sound: paperSound, texts: ["pegar o papel"] },
        ]
      ),
    ];

    floor.current = new Sprite(floorSprite, CANVAS_WIDTH - 20, 1, 1, 0);
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
      floor.current.render(context, { x: 10, y: 100 });

      objects.current.forEach((o) => {
        //update e render do vetor de alvos
        o.update(key.current, players.current);
        o.render(context);
      });

      players.current.forEach((p) => {
        //update e render do vetor de players
        p.update(dt, key.current);
        p.render(context);
      });
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
