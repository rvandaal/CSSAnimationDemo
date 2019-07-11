export class Size {
    public x: number;
    public y: number;

    constructor(x: number = 0.0, y: number = 0.0) {
        this.x = x;
        this.y = y;
    }

    public clone() {
        return new Size(this.x, this.y);
    }

    public addS(t: Size): Size {
        return new Size(this.x + t.x, this.y + t.y);
    }

    public multiply(factor: number) {
        return new Size(this.x * factor, this.y * factor);
    }

    public morph(t: Size, factorForOther: number): Size {
        return this.multiply(1 - factorForOther).addS(t.multiply(factorForOther));
    }
}
