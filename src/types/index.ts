export type position = {
  x: number;
  y: number;
};

export type size = {
  w: number;
  h: number;
};

export type quad = [
  number,
  number
];

export type keyAndIcon = {
  key: string,
  icon: string,
}

export type textAndSound = {
  sound: string;
  texts: string[];
};

export type hitbox = {
  offset: position,
  size: number,
}