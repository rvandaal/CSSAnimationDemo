import { Size } from './size';
import { Vector } from './vector';

export class Point {
    public x: number;
    public y: number;

    constructor(x: number = 0.0, y: number = 0.0) {
        this.x = x;
        this.y = y;
    }

    public clone() {
        return new Point(this.x, this.y);
    }

    public addP(t: Point): Point {
        return new Point(this.x + t.x, this.y + t.y);
    }

    public addV(t: Vector): Point {
        return new Point(this.x + t.x, this.y + t.y);
    }

    public subP(t: Point): Vector {
        return new Vector(this.x - t.x, this.y - t.y);
    }

    public subV(t: Vector): Point {
        return new Point(this.x - t.x, this.y - t.y);
    }

    public subS(t: Size): Point {
        return new Point(this.x - t.x, this.y - t.y);
    }

    public multiply(factor: number) {
        return new Point(this.x * factor, this.y * factor);
    }

    public morph(point: Point, factorForOther: number): Point {
        return this.multiply(1 - factorForOther).addP(point.multiply(factorForOther));
    }

    getDistanceFrom(point: Point): number {
        if (point) {
            return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2));
        }
        return Number.MAX_VALUE;
    }
}
