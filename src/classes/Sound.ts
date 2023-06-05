export default class Sound {
  source: string;
  audio: HTMLAudioElement;

  constructor(source: string) {
    this.source = source;
    this.audio = new Audio(source);
  }

  play() {
    this.audio.play();
  }

  pause() {
    this.audio.pause();
  }

  setSource(newSource: string) {
    this.source = newSource;
    this.audio = new Audio(newSource);
  }
}
