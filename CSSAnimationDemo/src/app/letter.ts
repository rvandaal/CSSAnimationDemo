export class Letter {

    margin = 200;
    letter: string;
    rotation: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    ax: number;
    ay: number;
    isMovedByUser: boolean;

    simulate(dt: number) {
        // this.ax = fx; // mass = 1
        // this.ay = fy;
        this.vx += this.ax * dt;
        this.vy += this.ay * dt;
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        if (this.x < -this.margin || this.x > window.innerWidth + this.margin) {
            this.vx = -this.vx;
        }

        if (this.y < -this.margin || this.y > window.innerHeight + this.margin) {
            this.vy = -this.vy;
        }

        this.rotation = Math.tanh(this.vy / this.vx);
    }
}
