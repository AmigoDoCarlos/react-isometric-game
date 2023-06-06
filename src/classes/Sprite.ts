import { position, quad } from "../types";

export class Sprite {
  source: HTMLImageElement;
  rows: number;
  columns: number;
  quad: quad;
  maxCount: number;
  count: number;
  lastFrame: number;
  size: number;

  constructor(
    sprite: string,
    size: number,
    rows: number,
    columns: number,
    maxCount: number
  ) {
    this.source = new Image();
    this.source.src = sprite;
    this.size = size;
    this.quad = [0, 0];
    this.count = 0;
    this.maxCount = maxCount;
    this.columns = columns;
    this.rows = rows;
    this.lastFrame = 0;
  }

  setSource(newSource: string) {
    this.source.src = newSource;
  }

  reset() {
    this.quad[0] = 0;
  }

  getSize() {
    return this.size;
  }

  getQuad() {
    return this.quad;
  }

  setSize(newSize: number) {
    this.size = newSize;
  }

  setQuad(newQuad: quad) {
    this.quad = newQuad;
  }

  nextSprite() {
    const next = this.quad[0] + 1;
    return next < this.columns ? next : 0;
  }

  ////////////////////////////////////////////////////////////////////////////////

  update(dt: number, direction?: number) {
    if (this.count < this.maxCount) {
      return (this.count += dt);
    }
    this.count = 0;
    this.setQuad([this.nextSprite(), direction ? direction : 0]);
  }

  render(canvas: CanvasRenderingContext2D, position: position) {
    const h = this.source.height;
    const w = this.source.width;
    const ratio = h / this.rows / (w / this.columns);

    canvas.drawImage(
      this.source, // src da imagem a ser desenhada
      this.quad[0] * (w / this.columns),
      this.quad[1] * (h / this.rows), // coordenadas X e Y, relativos à própria imagem, do início do quadrante
      w / this.columns,
      h / this.rows, // tamanho do quadrante (width, height)
      position.x,
      position.y, // coordenadas X e Y do início do desenho (canto superior esquerdo)
      this.size,
      this.size * ratio // tamanho final da imagem (width, height)
    );
  }
}
