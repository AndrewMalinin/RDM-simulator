import CanvasModel from './CanvasModel';

export interface IGraphProps {
    color: string;
    strokeWidth: number;
}

export default class GraphCanvasModel extends CanvasModel {
    static SIGNALS = {
        CANVAS_CLEARED: 'c_c'
    };
    //Сколько пикселей в одной единице сетки
    private _x0: number;
    private _y0: number;
    public px_per_unit = 20;

    public config = {
        DEFAULT_GRAPH_COLOR: 'rgba(255,60,20, 1)'
    };

    constructor(container: HTMLElement, x0: number, y0: number, px_per_unit: number) {
        const canvas = document.createElement('canvas');
        canvas.className = 'canvas_graph';
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
        // this.ctx.rotate(Math.PI * 2);
        this.clear();
    }

    addGraphic(points: [number, number][], props?: Partial<IGraphProps>) {
        if (!points.length) return;
        this.ctx.beginPath();
        this.ctx.strokeStyle = props?.color || this.config.DEFAULT_GRAPH_COLOR;
        this.ctx.moveTo(points[0][0] * this.px_per_unit, -points[0][1] * this.px_per_unit);
        for (let i = 1; i < points.length; i++) {
            const [x, y] = points[i];
            this.ctx.lineTo(x * this.px_per_unit, -y * this.px_per_unit);
        }
        this.ctx.stroke();
    }

    public clear() {
        this.ctx.clearRect(-this.ctxWidth / 2, -this.ctxHeight / 2, this.ctxWidth, this.ctxHeight);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        this.ctx.fillRect(-this.ctxWidth / 2, -this.ctxHeight / 2, this.ctxWidth, this.ctxHeight);
        this._emit(GraphCanvasModel.SIGNALS.CANVAS_CLEARED);
    }
}
