import { Component, OnInit, Input } from '@angular/core';
import { Letter } from '../letter';

@Component({
  selector: 'app-letter-layer',
  templateUrl: './letter-layer.component.html',
  styleUrls: ['./letter-layer.component.scss']
})
export class LetterLayerComponent implements OnInit {

  @Input()
  topWord: string;

  @Input()
  bottomWord: string;

  @Input()
  leftWord: string;

  @Input()
  rightWord: string;

  canvas: HTMLCanvasElement;
  letters: Letter[];
  fontsize = 60;
  wordContainerTextOpacity = 0.7;

  constructor() { }

  ngOnInit() {
    this.canvas = document.querySelector('canvas');
    this.canvas.width = window.innerWidth; // blijkbaar is width en height op 100% zetten via CSS niet genoeg!
    this.canvas.height = window.innerHeight;
    const ctx = this.canvas.getContext('2d');

    const fontsize = 60;

    this.initializeLetters(fontsize);
    const time0 = new Date().getTime() / 1000;

    let previousTime = -1;

    function animate() {
      const first = previousTime === -1;
      requestAnimationFrame(animate.bind(this));
      const currentTime = new Date().getTime() / 1000;
      const dt = currentTime - previousTime;
      previousTime = currentTime;

      if (first) {
        return;
      }

      this.simulateLetters(dt);

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      this.drawLetters(fontsize, ctx, currentTime - time0);
    }

    animate.apply(this);
  }

  initializeLetters(fontsize: number) {
    this.letters = [];

    this.initializeTargetWord(this.topWord, 'top', fontsize);
    this.initializeTargetWord(this.bottomWord, 'bottom', fontsize);
    this.initializeTargetWord(this.leftWord, 'left', fontsize);
    this.initializeTargetWord(this.rightWord, 'right', fontsize);

    const allLetters = (this.topWord + this.bottomWord + this.leftWord + this.rightWord).split('');
    allLetters.forEach(c => {
      const letter = new Letter();
      letter.letter = c;
      letter.fontsizeX = fontsize + 20;
      letter.fontsizeY = fontsize + 20;
      letter.x = Math.random() * window.innerWidth;
      letter.y = Math.random() * window.innerHeight;
      const mul = 50;
      letter.vx = Math.random() * 2 * mul - mul;
      letter.vy = Math.random() * 2 * mul - mul;
      letter.ax = (Math.random() * 2 * mul - mul) * 0;
      letter.ay = (Math.random() * 2 * mul - mul) * 0;
      this.letters.push(letter);
    });
  }

  initializeTargetWord(word: string, position: string, fontsize: number) {
    const canvasWidth = window.innerWidth; // this.canvas.width;
    const canvasHeight = window.innerHeight; // this.canvas.height;
    const wordWidth = word.length * fontsize;
    const wordContainerMargin = 20;
    const wordContainerHalfheight = 50;

    for (let i = 0; i < word.length; i++) {
      const character = word.charAt(i);
      const letter = new Letter();
      letter.isTarget = true;
      letter.letter = character;
      letter.fontsizeX = fontsize;
      letter.fontsizeY = fontsize;
      if (position === 'top') {
        letter.x = (canvasWidth + wordWidth) / 2 - (i + 1) * fontsize;
        letter.y = wordContainerMargin + wordContainerHalfheight - fontsize / 2;
        letter.rotation = Math.PI;
      } else if (position === 'bottom') {
        letter.x = (canvasWidth - wordWidth) / 2 + i * fontsize;
        letter.y = canvasHeight - wordContainerMargin - wordContainerHalfheight - fontsize / 2;
        letter.rotation = 0;
      } else if (position === 'left') {
        letter.x = wordContainerMargin + wordContainerHalfheight - fontsize / 2;
        letter.y = (canvasHeight - wordWidth) / 2 + i * fontsize;
        letter.rotation = Math.PI / 2;
      } else if (position === 'right') {
        letter.x = canvasWidth - wordContainerMargin - wordContainerHalfheight - fontsize / 2;
        letter.y = (canvasHeight + wordWidth) / 2 - (i + 1) * fontsize;
        letter.rotation = -Math.PI / 2;
      }
      this.letters.push(letter);
    }
  }

  simulateLetters(dt: number) {
    this.letters.forEach(l => {
      l.simulate(dt);
    });
  }

  drawLetters(fontsize: number, ctx: CanvasRenderingContext2D, time: number) {
    this.letters.forEach(l => {
      this.drawLetter(l, Math.min(2, time) / 2, ctx);
    });
  }

  drawLetter(letter: Letter, opacity: number, ctx: CanvasRenderingContext2D) {
    // Rotate the canvas and draw the text
    ctx.save();
    ctx.font = letter.fontsizeY + 'px Verdana, sans-serif';
    ctx.fillStyle = 'white';
    ctx.textBaseline = 'bottom';
    ctx.globalAlpha = opacity;
    // Translate the context to the middle of the letter
    ctx.translate(letter.x + letter.fontsizeX / 2, letter.y + letter.fontsizeY / 2);
    // Rotate around origin of context (= now center of letter)
    ctx.rotate(letter.rotation);
    // Watch out: when writing a letter at y = 0, its middle is at -height / 2.
    // So translate 'height' pixels extra in the y, because we assumed the center was at y = height / 2
    ctx.fillText(letter.letter, -letter.fontsizeX / 2, letter.fontsizeY / 2);
    ctx.restore();
  }
}
