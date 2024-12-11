import { debounce, genWrapper, range, rangeGen, smartRange, step } from '../../../shared/lib/helpers';
import Observable from '../../../shared/lib/helpers/Observable';
import GraphDataModel, { VALUES_TYPE } from './GraphDataModel';

interface IGraphLibConfig {
    paddings: number[];
    backgroundColor: string;
    defaultGraphColor: string;
    labels: {
        color: string;
        mainLabelsColor: string;
        fontFamily: string;
        fontSize: number;
        lineHeight: number;
        /**
         * Расстояние от надписи до засечки
         *
         * @type {number}
         */
        padding: number;
        unitY: string;
        unitX: string;
    };
    grid: {
        color: string;
    };
    axes: {
        color: string;
        serifHeight: number;
        minSpaceBetweenLabels: {
            x: number;
            y: number;
        };
    };
}

interface IGraphLibParams {
    container: HTMLDivElement;
    model: GraphDataModel;
    config: Partial<IGraphLibConfig>;
}

interface IDrawingArea {
    x_0: number;
    y_0: number;
    x_min: number;
    y_min: number;
    x_max: number;
    y_max: number;
}

function ctx(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    return canvas.getContext('2d')!;
}

export class GraphLib extends Observable {
    public model: GraphDataModel;
    private _container: HTMLDivElement;
    //@ts-ignore
    private _axesCanvas: HTMLCanvasElement;
    //@ts-ignore
    private _graphCanvas: HTMLCanvasElement;
    //@ts-ignore
    private _pointerCanvas: HTMLCanvasElement;
    private _width = 0;
    private _height = 0;

    private _drawingArea: IDrawingArea = {
        x_0: 0,
        y_0: 0,
        x_min: 0,
        y_min: 0,
        x_max: 0,
        y_max: 0
    };

    public config: IGraphLibConfig = {
        paddings: [50, 50, 10, 10],
        backgroundColor: '#080e17',
        defaultGraphColor: '#84bff9',
        labels: {
            color: '#9fb6d5',
            mainLabelsColor: 'rgba(0, 255, 88, 1)',
            fontFamily: 'Consolas',
            fontSize: 16,
            lineHeight: 1.2,
            padding: 5,
            unitY: 'дБ',
            unitX: 'МГц'
        },
        grid: {
            color: '#263a52'
        },
        axes: {
            color: '#385f8f',
            serifHeight: 5,
            minSpaceBetweenLabels: {
                y: 20,
                x: 50
            }
        }
    };

    private _yLabelsWidth = 50;
    private _yLabels: number[] = [];
    private _xLabels = [];

    private get _labelsHeight() {
        return this.config.labels.fontSize * this.config.labels.lineHeight;
    }

    constructor(params: IGraphLibParams) {
        super();
        this.model = params.model;
        if (params.config) {
            this.config = Object.assign(this.config, params.config);
        }

        this._container = params.container;
        this._container.style.background = this.config.backgroundColor;
        this._init();
        //   this.resizerWidth = 0;
        //   this.canvasWidth = undefined;
        //   this.canvasHeight = undefined;
        //   this.drawArea = {
        //       x: undefined,
        //       y: undefined
        //   };
        //   this.config = {
        //       axes: {
        //           padding: {
        //               left: 32.5,
        //               top: 15.5,
        //               right: 10.5,
        //               bottom: 25.5
        //           },
        //           color: 'rgba(230,230,250,0.2)',
        //           minYLabelsInterval: 25,
        //           minXLabelsInterval: 45,
        //           serifLength: 5
        //       },
        //       labels: {
        //           color: 'rgba(230,230,230,1)',
        //           mainLabelsColor: 'rgba(0, 255, 88, 1)',
        //           fontFamily: 'Consolas',
        //           fontSize: '1rem',
        //           unitY: 'дБ',
        //           unitX: 'МГц'
        //       },
        //       graphics: {
        //           width: 1,
        //           defaultColor: '#00FA9A',
        //           fillOpacity: 0.15,
        //           strokeOpacity: 1
        //       }
        //   };
    }

    private _createCanvas(container: HTMLDivElement, zIndex: number, id?: string) {
        const canvas = document.createElement('canvas');
        canvas.className = 'graphlib-canvas-layer';
        canvas.style.zIndex = String(zIndex);
        if (id) canvas.id = id;
        container.appendChild(canvas);
        return canvas;
    }

    private _configureCanvas(canvas: HTMLCanvasElement) {
        canvas.width = this._width;
        canvas.height = this._height;
    }

    private _handleContainerResize() {
        const containerBounds = this._container.getBoundingClientRect();
        this._width = containerBounds.width;
        this._height = containerBounds.height;
        this._configureCanvas(this._axesCanvas);
        this._configureCanvas(this._graphCanvas);
        this._configureCanvas(this._pointerCanvas);
        this._updateView();
    }

    private _updateView() {
        this._computeAxisLabels();
        this._recalculateDrawingArea();
        requestAnimationFrame(() => {
            this.clear();
            this.updateAxesLayer();
            this.updateGraphLayer();
        });
    }

    private _recalculateDrawingArea() {
        const x0 = this.config.paddings[3] + this._yLabelsWidth + this.config.axes.serifHeight + 0.5;
        const y0 = this._height - this.config.paddings[0] - this._labelsHeight + 0.5;
        this._drawingArea = {
            x_0: x0,
            y_0: y0,
            x_min: x0,
            x_max: this._width - this.config.paddings[1],
            y_min: this.config.paddings[0],
            y_max: y0
        };
    }

    private _init() {
        this._axesCanvas = this._createCanvas(this._container, 1);
        this._graphCanvas = this._createCanvas(this._container, 2);
        this._pointerCanvas = this._createCanvas(this._container, 3);
        const resizeObserver = new ResizeObserver((entries) => {
            this._handleContainerResize();
        });

        resizeObserver.observe(this._container);
        this._handleContainerResize();

        this.model.subscribe(GraphDataModel.SIGNALS.DATA_UPDATED, () => {
            this.updateGraphLayer();
        });
        this.model.subscribe(GraphDataModel.SIGNALS.MINMAX_UPDATED, () => {
            this._updateView();
        });
    }

    private _drawGrid() {}

    public updateAxesLayer() {
        this._drawGrid();
        this._updateYAxis();
        this._updateXAxis();
    }

    public reset() {
        this._handleContainerResize();
    }

    public updateGraphLayer() {
        this._clearGraphCanvas();
        if (!this.model.minMax || !this.model.data) return;
        const {
            x: [xMin, xMax],
            y: [yMin, yMax]
        } = this.model.minMax;
        const data = this.model.data;
        const c = ctx(this._graphCanvas);
        c.beginPath();
        c.strokeStyle = data.color || this.config.defaultGraphColor;
        const values = data.data;
        const xW = Math.abs((this._drawingArea.x_max - this._drawingArea.x_0) / (xMax - xMin));
        const yW = Math.abs((this._drawingArea.y_0 - this._drawingArea.y_min) / (yMax - yMin));

        const { x_0, y_0 } = this._drawingArea;
        const xValuesGen =
            values.type === VALUES_TYPE.X_Y
                ? genWrapper(values.x)
                : rangeGen(values.x[0], values.x[1], values.y.length);
        for (let i = 0; i < values.y.length; i++) {
            c.lineTo(x_0 + xValuesGen.next().value * xW, y_0 - (values.y[i] - yMin) * yW);
        }
        c.stroke();
        c.closePath();
    }

    private _computeAxisLabels(): boolean {
        if (!this.model.minMax) {
            this._yLabels = [];
            this._xLabels = [];
            return true;
        }
        let needRelayouting = false;

        const {
            y: [yMin, yMax]
        } = this.model.minMax;

        // Максимальное количество подписей, которое уместится на текущую ось Y (включая граничные подписи)
        const maxYLabelsCount = Math.floor(
            (this._drawingArea.y_0 - this._drawingArea.y_min) /
                (this.config.axes.minSpaceBetweenLabels.y + this._labelsHeight) +
                1
        );

        if (maxYLabelsCount < 2) return false;
        const c = ctx(this._axesCanvas);
        c.font = `${this.config.labels.fontSize}px ${this.config.labels.fontFamily}`;

        const labelArray = smartRange(yMin, yMax, maxYLabelsCount);
        this._yLabels = labelArray;
        const yLabelMaxWidth = Math.ceil(
            Math.max(...labelArray.map((label) => c.measureText(String(label)).width)) + this.config.labels.padding
        );
        if (yLabelMaxWidth !== this._yLabelsWidth) {
            this._yLabelsWidth = yLabelMaxWidth;
            needRelayouting = true;
        }
        return needRelayouting;
    }

    private _updateYAxis() {
        const c = ctx(this._axesCanvas);
        // ====================== Вертикальная линия ==========================//
        c.strokeStyle = this.config.axes.color;
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(this._drawingArea.x_0, this._drawingArea.y_0);
        c.lineTo(this._drawingArea.x_0, this._drawingArea.y_min);
        c.stroke();
        // this.axesCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        c.globalCompositeOperation = 'source-over';
        // ====================== Стиль линий ==========================//
        c.strokeStyle = this.config.axes.color;
        c.lineWidth = 1;
        c.setLineDash([]);
        // ====================== Стиль подписей =======================//
        c.fillStyle = this.config.labels.color;
        c.font = `${this.config.labels.fontSize}px ${this.config.labels.fontFamily}`;
        c.textAlign = 'end';
        c.textBaseline = 'middle';

        if (!this.model.minMax) return;
        const {
            y: [yMin, yMax]
        } = this.model.minMax;

        const x = this._drawingArea.x_0;
        let y = this._drawingArea.y_0;
        const yW = Math.abs((this._drawingArea.y_0 - this._drawingArea.y_min) / (yMax - yMin));
        c.beginPath();
        console.log('start');
        for (let i = 0; i < this._yLabels.length; i++) {
            console.log(y);
            y = this._drawingArea.y_0 - yW * (this._yLabels[i] - yMin);
            c.moveTo(x - this.config.axes.serifHeight, y);
            c.lineTo(x, y);
            c.fillText(String(this._yLabels[i]), x - this.config.axes.serifHeight - this.config.labels.padding, y);
        }
        c.stroke();

        c.beginPath();
        c.setLineDash([5, 10]);
        c.strokeStyle = this.config.grid.color;
        for (let i = 1; i < this._yLabels.length; i++) {
            y = this._drawingArea.y_0 - yW * (this._yLabels[i] - yMin);
            c.moveTo(x, y);

            c.lineTo(this._drawingArea.x_max, y);
        }
        c.stroke();

        // if (labelInterval > 2 * this.config.axes.minYLabelsInterval) {
        //     labelStep = 5;
        // } else if (labelInterval < this.config.axes.minYLabelsInterval) {
        //     labelStep = 20;
        // }

        // labelInterval = this.drawArea.y / ((this.maxY - this.minY) / labelStep);
        // // Массив подписей по оси Y
        // let labelArray = CommonUtils.range(this.minY, this.maxY, labelStep);
        // labelArray[labelArray.length - 1] = this.config.labels.unitY;
        // let x = this.config.axes.padding.left;
        // let y = this.config.axes.padding.top;

        // this.drawHorizontalLine(labelArray.length);
    }

    private _updateXAxis() {
        const c = ctx(this._axesCanvas);
        c.globalCompositeOperation = 'source-over';
        // ====================== Стиль линий ==========================//
        c.strokeStyle = this.config.axes.color;
        c.lineWidth = 1;
        c.setLineDash([]);
        // ====================== Стиль подписей =======================//
        c.fillStyle = this.config.labels.color;
        c.font = `${this.config.labels.fontSize}px ${this.config.labels.fontFamily}`;
        c.textAlign = 'end';
        c.textBaseline = 'middle';

        c.beginPath();
        c.moveTo(this._drawingArea.x_0, this._drawingArea.y_0);
        c.lineTo(this._drawingArea.x_max, this._drawingArea.y_0);
        c.stroke();
    }

    clear() {
        const axesCtx = ctx(this._axesCanvas);
        axesCtx.clearRect(0, 0, this._width, this._height);
        this._clearGraphCanvas();
    }

    private _clearGraphCanvas() {
        const graphCtx = ctx(this._graphCanvas);
        graphCtx.clearRect(0, 0, this._width, this._height);
    }
}
