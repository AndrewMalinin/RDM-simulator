import CanvasModel from './CanvasModel';
import { ICoords, IPosition } from './IPlaygroundObject';

export default class GridCanvasModel extends CanvasModel {
    //Сколько пикселей в одной единице сетки
    private _x0: number;
    private _y0: number;
    public px_per_unit = 20;

    public config = {
        AXIS_COLOR: 'rgba(90,120,250, 0.9)',
        GRID_COLOR: 'rgba(90,120,250, 0.1)',
        BACKGROUND_COLOR: 'rgba(250,250,255,0.1)'
    };

    constructor(container: HTMLElement, x0: number, y0: number, px_per_unit: number) {
        const canvas = document.createElement('canvas');
        canvas.className = 'canvas_grid';
        container.appendChild(canvas);
        super(canvas);
        this._x0 = x0;
        this._y0 = y0;
        this.px_per_unit = px_per_unit;
    }

    init() {
        window.addEventListener('resize', this.handleCanvasResize.bind(this));
        this.handleCanvasResize();
    }

    public handleCanvasResize() {
        const containerBound = this.canvas.parentElement!.getBoundingClientRect();
        this.canvas.width = containerBound.width;
        this.ctxWidth = containerBound.width;
        this.canvas.height = containerBound.height;
        this.ctxHeight = containerBound.height;

        this.ctx.translate(this._x0, this._y0);
        this.ctx.rotate(Math.PI);
        requestAnimationFrame(() => {
            //console.time('grid render time')
            this.draw();
            //console.timeEnd('grid render time')
        });
    }

    private _drawAxis() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.config.AXIS_COLOR;
        this.ctx.moveTo(-this.ctxWidth / 2, 0);
        this.ctx.lineTo(this.ctxWidth / 2, 0);
        this.ctx.moveTo(0, -this.ctxHeight / 2);
        this.ctx.lineTo(0, this.ctxHeight / 2);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    private _drawGrid() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.config.GRID_COLOR;
        // //draw vertical
        for (let i = this.px_per_unit; i <= this.ctxWidth / 2; i += this.px_per_unit) {
            this.ctx.moveTo(i, -this.ctxHeight / 2);
            this.ctx.lineTo(i, this.ctxHeight / 2);
        }
        for (let i = -this.px_per_unit; i >= -this.ctxWidth / 2; i -= this.px_per_unit) {
            this.ctx.moveTo(i, -this.ctxHeight / 2);
            this.ctx.lineTo(i, this.ctxHeight / 2);
        }

        //draw horizontal
        for (let i = this.px_per_unit; i <= this.ctxHeight / 2; i += this.px_per_unit) {
            this.ctx.moveTo(-this.ctxWidth / 2, i);
            this.ctx.lineTo(this.ctxWidth / 2, i);
        }
        for (let i = -this.px_per_unit; i >= -this.ctxHeight / 2; i -= this.px_per_unit) {
            this.ctx.moveTo(-this.ctxWidth / 2, i);
            this.ctx.lineTo(this.ctxWidth / 2, i);
        }
        this.ctx.stroke();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.ctxWidth, this.ctxHeight);
        this.ctx.fillStyle = this.config.BACKGROUND_COLOR;
        this.ctx?.fillRect(0, 0, this.ctxWidth, this.ctxHeight);
        this.ctx.translate(0.5, 0.5);
        this._drawAxis();
        this._drawGrid();
    }
}
