export class Renderer {

    constructor(canvas) {

        this.canvas = canvas;

        this.ctx =
            canvas.getContext("2d");

    }


    clear() {

        const width =
            this.canvas.clientWidth;

        const height =
            this.canvas.clientHeight;


        this.ctx.clearRect(
            0,
            0,
            width,
            height
        );

    }


    drawCircle(
        x,
        y,
        radius = 8
    ) {

        const ctx =
            this.ctx;


        ctx.beginPath();

        ctx.arc(
            x,
            y,
            radius,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }


    drawLine(
        x1,
        y1,
        x2,
        y2
    ) {

        const ctx =
            this.ctx;


        ctx.beginPath();

        ctx.moveTo(
            x1,
            y1
        );

        ctx.lineTo(
            x2,
            y2
        );

        ctx.stroke();

    }

}