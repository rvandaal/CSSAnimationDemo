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

  constructor() { }

  ngOnInit() {
    this.canvas = document.querySelector('canvas');
    this.canvas.width = window.innerWidth; // blijkbaar is width en height op 100% zetten via CSS niet genoeg!
    this.canvas.height = window.innerHeight;
    const ctx = this.canvas.getContext('2d');

    const fontsize = 60;

    this.initializeLetters();

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

      this.drawWord(this.topWord, 'top', fontsize, ctx);
      this.drawWord(this.bottomWord, 'bottom', fontsize, ctx);
      this.drawWord(this.leftWord, 'left', fontsize, ctx);
      this.drawWord(this.rightWord, 'right', fontsize, ctx);

      this.drawLetters(fontsize + 20, ctx);
    }

    animate.apply(this);
  }

  initializeLetters() {
    this.letters = [];
    const allLetters = (this.topWord + this.bottomWord + this.leftWord + this.rightWord).split('');
    allLetters.forEach(c => {
      const letter = new Letter();
      letter.letter = c;
      letter.x = Math.random() * window.innerWidth;
      letter.y = Math.random() * window.innerHeight;
      const mul = 10;
      letter.vx = Math.random() * 2 * mul - mul;
      letter.vy = Math.random() * 2 * mul - mul;
      letter.ax = (Math.random() * 2 * mul - mul) * 2;
      letter.ay = (Math.random() * 2 * mul - mul) * 2;
      letter.rotation = Math.random() * Math.PI * 2;
      this.letters.push(letter);
    });
  }

  simulateLetters(dt: number) {
    this.letters.forEach(l => {
      l.simulate(dt);
    });
  }

  drawLetters(fontsize: number, ctx: CanvasRenderingContext2D) {
    this.letters.forEach(l => {
      this.drawLetter(l.letter, fontsize, l.x, l.y, l.rotation, ctx);
    });
  }

  drawWord(word: string, position: string, fontsize: number, ctx: CanvasRenderingContext2D) {
    const canvasWidth = window.innerWidth; // this.canvas.width;
    const canvasHeight = window.innerHeight; // this.canvas.height;
    const wordWidth = word.length * fontsize;
    const wordContainerMargin = 20;
    const wordContainerHalfheight = 50;

    for (let i = 0; i < word.length; i++) {
      const letter = word.charAt(i);
      if (position === 'top') {
        this.drawLetter(
          letter,
          fontsize,
          (canvasWidth + wordWidth) / 2 - (i + 1) * fontsize,
          wordContainerMargin + wordContainerHalfheight - fontsize / 2,
          Math.PI,
          ctx
        );
      } else if (position === 'bottom') {
        this.drawLetter(
          letter,
          fontsize,
          (canvasWidth - wordWidth) / 2 + i * fontsize,
          canvasHeight - wordContainerMargin - wordContainerHalfheight - fontsize / 2,
          0,
          ctx
        );
      } else if (position === 'left') {
        this.drawLetter(
          letter,
          fontsize,
          wordContainerMargin + wordContainerHalfheight - fontsize / 2,
          (canvasHeight - wordWidth) / 2 + i * fontsize,
          Math.PI / 2,
          ctx
        );
      } else if (position === 'right') {
        this.drawLetter(
          letter,
          fontsize,
          canvasWidth - wordContainerMargin - wordContainerHalfheight - fontsize / 2,
          (canvasHeight + wordWidth) / 2 - (i + 1) * fontsize,
          -Math.PI / 2,
          ctx
        );
      }
    }
  }

  drawLetter(letter: string, fontsize: number, x: number, y: number, rotation: number, ctx: CanvasRenderingContext2D) {
    // Rotate the canvas and draw the text
    ctx.save();
    ctx.font = fontsize + 'px Verdana, sans-serif';
    ctx.fillStyle = 'white';
    ctx.textBaseline = 'bottom';
    // Translate the context to the middle of the letter
    ctx.translate(x + fontsize / 2, y + fontsize / 2);
    // Rotate around origin of context (= now center of letter)
    ctx.rotate(rotation);
    // Watch out: when writing a letter at y = 0, its middle is at -height / 2.
    // So translate 'height' pixels extra in the y, because we assumed the center was at y = height / 2
    ctx.fillText(letter, -fontsize / 2, fontsize / 2);
    ctx.restore();
  }
}
