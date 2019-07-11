import { Size } from './size';

export class Vector {
    public x: number;
    public y: number;

    constructor(x: number = 0.0, y: number = 0.0) {
        this.x = x;
        this.y = y;
    }

    public clone() {
        return new Vector(this.x, this.y);
    }

    public addV(t: Vector): Vector {
        return new Vector(this.x + t.x, this.y + t.y);
    }

    public addS(t: Size): Vector {
        return new Vector(this.x + t.x, this.y + t.y);
    }

    public subV(t: Vector): Vector {
        return new Vector(this.x - t.x, this.y - t.y);
    }

    public subS(t: Size): Vector {
        return new Vector(this.x - t.x, this.y - t.y);
    }

    public multiply(factor: number) {
        return new Vector(this.x * factor, this.y * factor);
    }

    public morph(t: Vector, factorForOther: number): Vector {
        return this.multiply(1 - factorForOther).addV(t.multiply(factorForOther));
    }

    public negate() {
        return new Vector(-this.x, -this.y);
    }
}
