import { Point } from './point';
import { Vector } from './vector';
import { Size } from './size';

export enum LetterState {
    Floating = 0,
    MovedByUser = 1,
    BeingDropped = 2,
    Dropped = 3
}

export class Letter {
    state = LetterState.Floating;
    letter: string;
    opacity = 1;
    color = 'white';
    size: Size;
    rotation: number;
    pos: Point;
    vel: Vector;
    acc: Vector;
    mousePoint: Point;
    mouseDelta: Vector;
    isTarget = false;
    dropTime: number;
    dropPoint: Point;
    dropRotation: number;
    dropSize: Size;
    target: Letter;

    simulate(currentTime: number, dt: number) {
        if (this.isTarget || this.state === LetterState.Dropped) {
            return;
        }
        if (this.state === LetterState.BeingDropped) {
            // Morph into target
            const progress = (currentTime - this.dropTime) / 1; // morph in 1s
            if (progress > 1) {
                this.state = LetterState.Dropped;
                this.target.state = LetterState.Dropped;
                this.target.color = 'red';
                this.target = null;
                return;
            }

            this.pos = this.dropPoint.morph(this.target.pos, progress);
            this.rotation = progress * this.target.rotation + (1 - progress) * this.dropRotation;
            this.size = this.dropSize.morph(this.target.size, progress);
            this.opacity = (1 - progress);
            return;
        }
        if (this.state === LetterState.MovedByUser) {
            this.pos = this.mousePoint.subV(this.mouseDelta) as Point;
            return;
        }
        this.vel = this.vel.addV(this.acc.multiply(dt));
        this.pos = this.pos.addV(this.vel.multiply(dt));
        this.acc = new Vector((window.innerWidth / 2 - this.pos.x) * 0.005, (window.innerHeight / 2 - this.pos.y) * 0.005);
        this.rotation = Math.tanh(Math.abs(this.vel.y / this.vel.x));
        return;
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.state === LetterState.Dropped && !this.isTarget) {
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
        this.state = LetterState.BeingDropped;
        this.dropTime = new Date().getTime() / 1000;
        this.dropPoint = this.pos.clone();
        this.dropRotation = this.rotation;
        this.dropSize = this.size.clone();
    }

    getDistanceFrom(point: Point) {
        return this.pos.getDistanceFrom(point);
    }

    isInside(point: Point) {
        return this.getDistanceFrom(point) < this.size.y / 2;
    }
}
