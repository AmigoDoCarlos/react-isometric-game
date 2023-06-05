import { Butt } from "./Button.style";

interface ButtonProps {
  children: string | JSX.Element;
  onClick: () => void;
}

export default function Button({ children, onClick }: ButtonProps) {
  return <Butt onClick={onClick}>{children}</Butt>;
}
