import GridCanvasModel from './GridCanvasModel';
import IPlaygroundObject, { ICoords, IPosition } from './IPlaygroundObject';
import { store } from '../../../../app/store';
import { addObject, objectsSelector } from '../../model';

export type ObjectGUID = string;

export default class PlaygroundModel {
    private _gridCanvasModel: GridCanvasModel;
    private _container: HTMLElement;

    public px_per_unit = 20;
    private _drawingArea = {
        x_0: 0,
        y_0: 0,
        x_min: 0,
        y_min: 0,
        x_max: 0,
        y_max: 0
    };

    get objects() {
        return objectsSelector(store.getState());
    }

    constructor(container: HTMLElement) {
        this._container = container;
        this.init();
        this._gridCanvasModel = new GridCanvasModel(
            container,
            this._drawingArea.x_0,
            this._drawingArea.y_0,
            this.px_per_unit
        );
        this._gridCanvasModel.init();
    }

    public init() {
        window.addEventListener('resize', this._handleContainerResize.bind(this));
        this._calculateDrawingArea();
    }

    private _handleContainerResize() {
        this._calculateDrawingArea();
    }

    private _calculateDrawingArea() {
        const containerBounds = this._container.getBoundingClientRect();
        const x0 = Math.floor(containerBounds.width / 2);
        const y0 = Math.floor(containerBounds.height / 2);
        this._drawingArea = {
            x_0: x0,
            y_0: y0,
            x_min: x0 - containerBounds.width / 2,
            y_min: y0 - containerBounds.height / 2,
            x_max: x0 + containerBounds.width / 2,
            y_max: y0 + containerBounds.height / 2
        };
    }

    public getCoordsByPosition(position: IPosition): ICoords {
        return {
            x: (position.x - this._drawingArea.x_0) / this.px_per_unit,
            y: (this._drawingArea.y_0 - position.y) / this.px_per_unit
        };
    }

    public getPositionByCoords(coords: ICoords): IPosition {
        return {
            x: this._drawingArea.x_0 + coords.x * this.px_per_unit,
            y: this._drawingArea.y_0 - coords.y * this.px_per_unit
        };
    }

    private _addObject(object: IPlaygroundObject) {
        // const el = object.getDOMElement();
        // this._container.appendChild(el);
    }

    public addObject(object: IPlaygroundObject) {
        if (!this.objects[object.guid]) {
            store.dispatch(addObject(object));
            this._addObject(object);
        }
    }
}
