export class Letter {

    margin = 200;
    letter: string;
    fontsizeX: number;
    fontsizeY: number;
    opacity = 1;
    rotation: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    ax: number;
    ay: number;
    isMovedByUser = false;
    mouseX: number;
    mouseY: number;
    mouseDeltaX: number;
    mouseDeltaY: number;
    isTarget = false;
    dropTime: number;
    dropX: number;
    dropY: number;
    dropRotation: number;
    dropSizeX: number;
    dropSizeY: number;
    target: Letter;
    isDropped = false;

    simulate(currentTime: number, dt: number): boolean {
        if (this.isTarget || this.isDropped) {
            return;
        }
        if (this.target) {
            // letter is being dropped, morph into target
            const progress = (currentTime - this.dropTime) / 1; // morph in 1s
            if (progress > 1) {
                this.isDropped = true;
                this.target = null;
                return true;
            }

            this.x = progress * this.target.x + (1 - progress) * this.dropX;
            this.y = progress * this.target.y + (1 - progress) * this.dropY;
            this.rotation = progress * this.target.rotation + (1 - progress) * this.dropRotation;
            this.fontsizeX = progress * this.target.fontsizeX + (1 - progress) * this.dropSizeX;
            this.fontsizeY = progress * this.target.fontsizeY + (1 - progress) * this.dropSizeY;
            this.opacity = (1 - progress);
            return;
        }
        if (this.isMovedByUser) {
            this.x = this.mouseX - this.fontsizeX / 2 - this.mouseDeltaX;
            this.y = this.mouseY - this.fontsizeY / 2 - this.mouseDeltaY;
            return;
        }
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
        return false;
    }

    drawLetter(ctx: CanvasRenderingContext2D) {
        if (this.isDropped) {
            return;
        }
        // Rotate the canvas and draw the text
        ctx.save();
        ctx.font = this.fontsizeY + 'px Verdana, sans-serif';
        ctx.fillStyle = 'white';
        ctx.textBaseline = 'bottom';
        ctx.globalAlpha = this.opacity;
        // Translate the context to the middle of the this
        ctx.translate(this.x + this.fontsizeX / 2, this.y + this.fontsizeY / 2);
        // Rotate around origin of context (= now center of this)
        ctx.rotate(this.rotation);
        // Watch out: when writing a this at y = 0, its middle is at -height / 2.
        // So translate 'height' pixels extra in the y, because we assumed the center was at y = height / 2
        ctx.fillText(this.letter, -this.fontsizeX / 2, this.fontsizeY / 2);
        ctx.restore();
    }

    drop(target: Letter) {
        this.target = target;
        this.dropTime = new Date().getTime() / 1000;
        this.dropX = this.x;
        this.dropY = this.y;
        this.dropRotation = this.rotation;
        this.dropSizeX = this.fontsizeX;
        this.dropSizeY = this.fontsizeY;
    }

    getDistanceFrom(otherX: number, otherY: number) {
        return Math.sqrt(Math.pow(this.x + this.fontsizeX / 2 - otherX, 2) + Math.pow(this.y + this.fontsizeY / 2 - otherY, 2));
    }

    isInside(otherX: number, otherY: number) {
        return this.getDistanceFrom(otherX, otherY) < this.fontsizeY / 2;
    }
}
