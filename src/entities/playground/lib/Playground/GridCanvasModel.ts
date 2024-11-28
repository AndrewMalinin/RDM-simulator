import CanvasModel from './CanvasModel';
import { ICoords, IPosition } from './IPlaygroundObject';

export default class GridCanvasModel extends CanvasModel {
    //Сколько пикселей в одной единице сетки
    public px_per_unit = 20;
    public config = {
        AXIS_COLOR: 'rgba(90,120,250, 0.9)',
        GRID_COLOR: 'rgba(90,120,250, 0.1)',
        BACKGROUND_COLOR: 'rgba(250,250,255,0.1)'
    };
    private _x0 = 0;
    private _y0 = 0;

    constructor(container: HTMLElement) {
        const canvas = document.createElement('canvas');
        canvas.className = 'canvas_grid';
        container.appendChild(canvas);
        super(canvas);
    }

    init() {
        window.addEventListener('resize', this.handleCanvasResize.bind(this));
        this.handleCanvasResize();
    }

    public getCoordsByPosition(position: IPosition): ICoords {
        return {
            x: (position.x - this._x0) / this.px_per_unit,
            y: (this._y0 - position.y) / this.px_per_unit
        };
    }

    private _calculateCenter() {
        this._x0 = Math.floor(this.ctxWidth / 2);
        this._y0 = Math.floor(this.ctxHeight / 2);
    }

    public handleCanvasResize() {
        const containerBound = this.canvas.parentElement!.getBoundingClientRect();
        this.canvas.width = containerBound.width;
        this.ctxWidth = containerBound.width;
        this.canvas.height = containerBound.height;
        this.ctxHeight = containerBound.height;

        requestAnimationFrame(() => {
            //console.time('grid render time')
            this.draw();
            //console.timeEnd('grid render time')
        });
    }

    private _drawAxis() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.config.AXIS_COLOR;
        this.ctx.moveTo(0, this._y0);
        this.ctx.lineTo(this.ctxWidth, this._y0);
        this.ctx.moveTo(this._x0, 0);
        this.ctx.lineTo(this._x0, this.ctxHeight);
        this.ctx.stroke();
    }

    private _drawGrid() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.config.GRID_COLOR;
        // //draw vertical
        for (let i = this._x0 + this.px_per_unit; i <= this.ctxWidth; i += this.px_per_unit) {
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.ctxHeight);
        }
        for (let i = this._x0 - this.px_per_unit; i >= 0; i -= this.px_per_unit) {
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.ctxHeight);
        }
        //draw horizontal
        for (let i = this._y0 + this.px_per_unit; i <= this.ctxHeight; i += this.px_per_unit) {
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.ctxWidth, i);
        }
        for (let i = this._y0 - this.px_per_unit; i >= 0; i -= this.px_per_unit) {
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.ctxWidth, i);
        }
        this.ctx.stroke();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.ctxWidth, this.ctxHeight);
        this.ctx.fillStyle = this.config.BACKGROUND_COLOR;
        this.ctx?.fillRect(0, 0, this.ctxWidth, this.ctxHeight);
        this.ctx.translate(0.5, 0.5);
        this._calculateCenter();
        this._drawAxis();
        this._drawGrid();
    }
}
