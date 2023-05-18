import { createContext, ReactNode, useContext, useEffect, useState, useRef } from 'react';
  
interface GlobalContextValue {
  animationFrame: number,
  keyPressed: string | undefined;
}
  
interface GlobalProviderProps {
  children: ReactNode;
}
  
const initialValues: GlobalContextValue = {
  animationFrame: 0,
  keyPressed: undefined,
};
  
const GlobalContext = createContext<GlobalContextValue>(initialValues);
  
export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (typeof context !== 'undefined') {
      return context;
  }
  throw new Error(`useGlobalContext must be used within a GlobalContext`);
}

const mapKeys = (key: string) => {
  switch(key){
    case 'w':
    case 'ArrowUp':
      return 'up';
    case 'a':
    case 'ArrowLeft':
      return 'left';
    case 's':
    case 'ArrowDown':
      return 'down';
    case 'd':
    case 'ArrowRight':
      return 'right';
    default:
      return undefined;
  }
}

export default function GlobalProvider(props: GlobalProviderProps) {
  const [keyPressed, setKeyPressed] = useState<string | undefined>(undefined);
  const [animationFrame, setAnimationFrame] = useState<number>(0);

  const loop = (ts: number) => {
      setAnimationFrame(ts);
      requestAnimationFrame(loop);
  }

  useEffect(() => {
    window.addEventListener('keydown', (e) => setKeyPressed(mapKeys(e.key)));
    window.addEventListener('keyup', () => setKeyPressed(undefined));
    requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('keydown', (e) => setKeyPressed(mapKeys(e.key)));
      window.removeEventListener('keyup', () => setKeyPressed(undefined));
    }
  }, []);

  const { children } = props;

  const value: GlobalContextValue = {
    animationFrame,
    keyPressed,
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
}