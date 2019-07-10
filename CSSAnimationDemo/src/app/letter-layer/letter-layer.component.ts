import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-letter-layer',
  templateUrl: './letter-layer.component.html',
  styleUrls: ['./letter-layer.component.scss']
})
export class LetterLayerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const canvas = document.querySelector('canvas');
    canvas.width = window.innerWidth; // blijkbaar is width en height op 100% zetten via CSS niet genoeg!
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    const angle = -Math.PI / 4;
    const fontsize = 100;
    this.drawBox(fontsize, 400, 400, angle, ctx);
    this.drawLetter('WEFZB', fontsize, 400, 400, angle, ctx);
  }

  drawBox(fontsize: number, x: number, y: number, rotation: number, ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = 'black';
    ctx.save();
    ctx.translate(x + fontsize / 2, y + fontsize / 2);
    ctx.rotate(rotation);
    ctx.strokeRect(-fontsize / 2, -fontsize / 2, fontsize, fontsize);
    ctx.restore();
  }

  drawLetter(letter: string, fontsize: number, x: number, y: number, rotation: number, ctx: CanvasRenderingContext2D) {
    //ctx.font = 'bold ' + fontsize + 'px Tahoma, sans-serif';
    ctx.font = fontsize + 'px Verdana, sans-serif';
    //ctx.font = fontsize + 'px Consolas, sans-serif';
    
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
