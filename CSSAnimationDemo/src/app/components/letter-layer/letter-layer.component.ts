import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Letter, LetterState } from '../../models/letter';
import { Point } from 'src/app/models/point';
import { Vector } from 'src/app/models/vector';
import { Size } from 'src/app/models/size';

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

  @Output()
  gedropt = new EventEmitter<number>();

  canvas: HTMLCanvasElement;
  letters: Letter[];
  wordContainerTextOpacity = 0.7;
  letterOpacity = 0.9;
  isMouseDown = false;
  currentMovedLetter: Letter;
  mousePoint: Point;
  aantalGedropt = 0;

  constructor() { }

  ngOnInit() {
    this.canvas = document.querySelector('canvas');
    this.canvas.width = window.innerWidth; // blijkbaar is width en height op 100% zetten via CSS niet genoeg!
    this.canvas.height = window.innerHeight;
    const ctx = this.canvas.getContext('2d');

    this.canvas.onmousedown = (function (e) {
      this.mousePoint = new Point(e.x, e.y);
      this.isMouseDown = true;
    }).bind(this);

    this.canvas.onmouseup = (function (e) {
      this.mousePoint = new Point(e.x, e.y);
      this.isMouseDown = false;
    }).bind(this);

    this.canvas.onmousemove = (function (e) {
      this.mousePoint = new Point(e.x, e.y);
    }).bind(this);

    const fontsize = 60;
    this.initializeLetters(fontsize);
    const time0 = this.getCurrentTime();

    let previousTime = -1;

    function animate() {
      const first = previousTime === -1;
      requestAnimationFrame(animate.bind(this));
      const currentTime = this.getCurrentTime();
      const dt = currentTime - previousTime;
      previousTime = currentTime;

      if (first) {
        return;
      }

      this.checkInteractionLetters();

      this.simulateLetters(currentTime, dt);

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      this.drawLetters(ctx, currentTime - time0);
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
      letter.size = new Size(fontsize + 20, fontsize + 20);
      letter.opacity = 0.3;
      letter.pos = new Point(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
      const mul = 30;
      letter.vel = new Vector(Math.random() * 2 * mul - mul, Math.random() * 2 * mul - mul);
      letter.acc = new Vector(0, 0);
      this.letters.push(letter);
    });
  }

  initializeTargetWord(word: string, position: string, fontsize: number) {
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    const wordWidth = word.length * fontsize;
    const wordContainerMargin = 10;
    const wordContainerHalfheight = 50;

    for (let i = 0; i < word.length; i++) {
      const character = word.charAt(i);
      const letter = new Letter();
      letter.isTarget = true;
      letter.letter = character;
      letter.size = new Size(fontsize, fontsize);
      if (position === 'top') {
        letter.pos = new Point(
          (canvasWidth + wordWidth) / 2 - (i + 0.5) * fontsize,
          wordContainerMargin + wordContainerHalfheight
        );
        letter.rotation = Math.PI;
      } else if (position === 'bottom') {
        letter.pos = new Point(
          (canvasWidth - wordWidth) / 2 + (i + 0.5) * fontsize,
          canvasHeight - wordContainerMargin - wordContainerHalfheight
        );
        letter.rotation = 0;
      } else if (position === 'left') {
        letter.pos = new Point(
          wordContainerMargin + wordContainerHalfheight,
          (canvasHeight - wordWidth) / 2 + (i + 0.5) * fontsize
        );
        letter.rotation = Math.PI / 2;
      } else if (position === 'right') {
        letter.pos = new Point(
          canvasWidth - wordContainerMargin - wordContainerHalfheight,
          (canvasHeight + wordWidth) / 2 - (i + 0.5) * fontsize
        );
        letter.rotation = -Math.PI / 2;
      }
      this.letters.push(letter);
    }
  }

  checkInteractionLetters() {
    if (!this.currentMovedLetter) {
      this.letters.forEach(l => {
        if (!l.isTarget) {
          l.color = 'white';
        }
        if (!l.isTarget && l.state < LetterState.BeingDropped && l.isInside(this.mousePoint)) {
          l.color = 'orange';
          if (this.isMouseDown) {
            this.currentMovedLetter = l;
            l.state = LetterState.MovedByUser;
            l.mousePoint = this.mousePoint.clone();
            l.mouseDelta = l.mousePoint.subP(l.pos);
          }
        }
      });
    } else {
      this.currentMovedLetter.mousePoint = this.mousePoint.clone();
      if (!this.isMouseDown) {
        // letter is dropped, check target
        const targetLetters = this.letters.filter(le => le.isTarget && le.state !== LetterState.Dropped);
        // tslint:disable-next-line:prefer-const
        for (let tl of targetLetters) {
          if (
            tl.isInside(this.currentMovedLetter.mousePoint) &&
            tl.letter === this.currentMovedLetter.letter
          ) {
            // Losgelaten boven juiste target
            this.currentMovedLetter.drop(tl);
            this.currentMovedLetter = null;
            this.aantalGedropt += 1;
            this.gedropt.emit(this.aantalGedropt);
            return;
          }
        }
        this.currentMovedLetter.state = LetterState.Floating;
        this.currentMovedLetter = null;
      }
    }
  }

  simulateLetters(currentTime: number, dt: number) {
    this.letters.forEach(l => {
      l.simulate(currentTime, dt);
    });
  }

  drawLetters(ctx: CanvasRenderingContext2D, time: number) {
    this.letters.forEach(l => {
      l.opacity = Math.min(2, time) / 2 * this.letterOpacity;
      l.draw(ctx);
    });
  }

  getCurrentTime() {
    return new Date().getTime() / 1000;
  }
}
