import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-letter-layer',
  templateUrl: './letter-layer.component.html',
  styleUrls: ['./letter-layer.component.scss']
})
export class LetterLayerComponent implements OnInit {

  canvas: HTMLCanvasElement;

  constructor() { }

  ngOnInit() {
    this.canvas = document.querySelector('canvas');
    this.canvas.width = window.innerWidth; // blijkbaar is width en height op 100% zetten via CSS niet genoeg!
    this.canvas.height = window.innerHeight;
    const ctx = this.canvas.getContext('2d');

    const angle = -Math.PI / 1;
    const fontsize = 60;

    this.drawWord('SNELWANDELEN', 'top', fontsize, ctx);
    this.drawWord('GOLF', 'bottom', fontsize, ctx);
    this.drawWord('KICKBOKSEN', 'left', fontsize, ctx);
    this.drawWord('SPEERWERPEN', 'right', fontsize, ctx);

    function animate() {
      requestAnimationFrame(animate);
    }

    animate();
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
    ctx.font = fontsize + 'px Verdana, sans-serif';
    ctx.fillStyle = 'white';
    ctx.textBaseline = 'bottom';
    // Rotate the canvas and draw the text
    ctx.save();
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
