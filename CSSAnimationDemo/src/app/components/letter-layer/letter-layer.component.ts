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
  aantalTePlaatsenLetters = 0;

  constructor() { }

  ngOnInit() {
    this.aantalTePlaatsenLetters = (this.topWord + this.bottomWord + this.leftWord + this.rightWord).length;
    this.gedropt.emit(this.aantalTePlaatsenLetters);

    this.canvas = document.querySelector('canvas');
    this.canvas.width = window.innerWidth; // blijkbaar is width en height op 100% zetten via CSS niet genoeg!
    this.canvas.height = window.innerHeight;
    const ctx = this.canvas.getContext('2d');

    this.canvas.onmousedown = (function (e) {
      //
      // Strange behavior that might have to do with the top=-20px of the body
      // The mouse corresponds with the dimensions of the canvas, but the word containers are placed with an offset of 20px
      // Meaning that the mouse will still hover a targetletter when it's 20px below it, in the bottom row
      // In the top row this is only 3px or so.
      // So we could correct the mouse position to account for the 20px difference.
      // The correction below works for now, even if the mouse is not the guilty one.
      // For example: the bottom border of a targetletter is at y = 666, but at this border, the mouse is 646.
      // So we need to multiply the mouse position with 666 / (666 - 20), so the transition will happen at 666 iso 646.
      //
      const correction = this.canvas.height / (this.canvas.height - 20);
      this.mousePoint = new Point(e.x, e.y * correction);
      this.isMouseDown = true;
    }).bind(this);

    this.canvas.onmouseup = (function (e) {
      const correction = this.canvas.height / (this.canvas.height - 20);
      this.mousePoint = new Point(e.x, e.y * correction);
      this.isMouseDown = false;
    }).bind(this);

    this.canvas.onmousemove = (function (e) {
      const correction = this.canvas.height / (this.canvas.height - 20);
      this.mousePoint = new Point(e.x, e.y * correction);
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
    const wordWidth = Letter.getNormalizedWordWidth(word) * fontsize;
    const wordContainerMargin = 20;
    const wordContainerHalfheight = 40;

    let currentPosition;
    switch (position) {
      case 'top':
        currentPosition = (canvasWidth + wordWidth) / 2;
        break;
      case 'bottom':
        currentPosition = (canvasWidth - wordWidth) / 2;
        break;
      case 'left':
        currentPosition = (canvasHeight - wordWidth) / 2;
        break;
      case 'right':
        currentPosition = (canvasHeight + wordWidth) / 2;
        break;
    }

    for (let i = 0; i < word.length; i++) {
      const character = word.charAt(i);
      const letter = new Letter();
      letter.isTarget = true;
      letter.letter = character;
      letter.size = new Size(fontsize, fontsize);
      if (position === 'top') {
        letter.pos = new Point(
          currentPosition - 0.5 * letter.width,
          wordContainerMargin + wordContainerHalfheight
        );
        letter.rotation = Math.PI;
        currentPosition -= letter.width;
      } else if (position === 'bottom') {
        letter.pos = new Point(
          currentPosition + 0.5 * letter.width,
          canvasHeight - wordContainerMargin - wordContainerHalfheight
        );
        letter.rotation = 0;
        currentPosition += letter.width;
      } else if (position === 'left') {
        letter.pos = new Point(
          wordContainerMargin + wordContainerHalfheight,
          currentPosition + 0.5 * letter.width
        );
        letter.rotation = Math.PI / 2;
        currentPosition += letter.width;
      } else if (position === 'right') {
        letter.pos = new Point(
          canvasWidth - wordContainerMargin - wordContainerHalfheight,
          currentPosition - 0.5 * letter.width
        );
        letter.rotation = -Math.PI / 2;
        currentPosition -= letter.width;
      }
      this.letters.push(letter);
    }
  }

  checkInteractionLetters() {
    if (!this.currentMovedLetter) {
      this.letters.filter(l => !l.isTarget).forEach(l => l.color = 'white');
      // tslint:disable-next-line:prefer-const
      for (let l of this.letters) {
        if (!l.isTarget && l.state < LetterState.BeingDropped && l.contains(this.mousePoint)) {
          l.color = 'orange';
          if (this.isMouseDown) {
            this.currentMovedLetter = l;
            l.state = LetterState.MovedByUser;
            l.mousePoint = this.mousePoint.clone();
            l.mouseDelta = l.mousePoint.subP(l.pos);
          }
          return;
        }
      }
    } else {
      this.currentMovedLetter.mousePoint = this.mousePoint.clone();
      const targetLetters = this.letters.filter(le => le.isTarget && le.state !== LetterState.Dropped);
      let hasLetterBeHovered = false;
      // tslint:disable-next-line:prefer-const
      for (let tl of targetLetters) {
        if (this.isLetterHovered(tl)) {
          if (!hasLetterBeHovered) {
            tl.color = 'lightgreen';
            hasLetterBeHovered = true;
          } else {
            tl.color = 'white';
          }
          if (!this.isMouseDown && tl.letter === this.currentMovedLetter.letter) {
            // Losgelaten boven juiste target
            this.currentMovedLetter.drop(tl);
            this.currentMovedLetter = null;
            this.aantalTePlaatsenLetters -= 1;
            this.gedropt.emit(this.aantalTePlaatsenLetters);
            return;
          }
        } else {
          tl.color = 'white';
        }
      }
      if (!this.isMouseDown) {
        this.currentMovedLetter.state = LetterState.Floating;
        this.currentMovedLetter = null;
      }
    }
  }

  simulateLetters(currentTime: number, dt: number) {
    this.letters.forEach(l => {
      l.simulate(currentTime, dt * Math.max(1, (5 - this.aantalTePlaatsenLetters / 8)));
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

  isLetterHovered(letter: Letter) {
    return letter.contains(this.mousePoint);
  }
}
