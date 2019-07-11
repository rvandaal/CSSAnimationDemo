import { Point } from './point';
import { Vector } from './vector';
import { Size } from './size';

export class Letter {

    margin = 200;
    letter: string;
    opacity = 1;
    color = 'white';
    size: Size;
    rotation: number;
    pos: Point;
    vel: Vector;
    acc: Vector;
    isMovedByUser = false;
    mousePoint: Point;
    mouseDelta: Vector;
    isTarget = false;
    dropTime: number;
    dropPoint: Point;
    dropRotation: number;
    dropSize: Size;
    target: Letter;
    isDropped = false;

    simulate(currentTime: number, dt: number) {
        if (this.isTarget || this.isDropped) {
            return;
        }
        if (this.target) {
            // letter is being dropped, morph into target
            const progress = (currentTime - this.dropTime) / 1; // morph in 1s
            if (progress > 1) {
                this.isDropped = true;
                this.target.color = 'red';
                this.target.isDropped = true;
                this.target = null;
                return;
            }

            this.pos = this.dropPoint.morph(this.target.pos, progress);
            this.rotation = progress * this.target.rotation + (1 - progress) * this.dropRotation;
            this.size = this.dropSize.morph(this.target.size, progress);
            this.opacity = (1 - progress);
            return;
        }
        if (this.isMovedByUser) {
            this.pos = this.mousePoint.subV(this.mouseDelta) as Point;
            return;
        }
        this.vel = this.vel.addV(this.acc.multiply(dt));
        this.pos = this.pos.addV(this.vel.multiply(dt));

        if (
            this.pos.x < -this.margin || this.pos.x > window.innerWidth + this.margin ||
            this.pos.y < -this.margin || this.pos.y > window.innerHeight + this.margin
        ) {
            this.vel.negate();
        }

        this.rotation = Math.tanh(this.vel.y / this.vel.x);
        return;
    }

    drawLetter(ctx: CanvasRenderingContext2D) {
        if (this.isDropped && !this.isTarget) {
            return;
        }
        // Rotate the canvas and draw the text
        ctx.save();
        ctx.font = this.size.y + 'px Verdana, sans-serif';
        ctx.fillStyle = this.color;
        ctx.textBaseline = 'bottom';
        ctx.globalAlpha = this.opacity;
        // Translate the context to the middle of the this
        ctx.translate(this.pos.x, this.pos.y);
        // Rotate around origin of context (= now center of this)
        ctx.rotate(this.rotation);
        // Watch out: when writing a this at y = 0, its middle is at -height / 2.
        // So translate 'height' pixels extra in the y, because we assumed the center was at y = height / 2
        ctx.fillText(this.letter, -this.size.x / 2, this.size.y / 2);
        ctx.restore();
    }

    drop(target: Letter) {
        this.target = target;
        this.dropTime = new Date().getTime() / 1000;
        this.dropPoint = this.pos.clone();
        this.dropRotation = this.rotation;
        this.dropSize = this.size.clone();
    }

    getDistanceFrom(point: Point) {
        return Math.sqrt(Math.pow(this.pos.x - point.x, 2) + Math.pow(this.pos.y - point.y, 2));
    }

    isInside(point: Point) {
        return this.getDistanceFrom(point) < this.size.y / 2;
    }
}
