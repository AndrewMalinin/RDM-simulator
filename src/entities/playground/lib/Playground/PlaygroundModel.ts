import GridCanvasModel from './GridCanvasModel';
import IPlaygroundObject, { IPosition } from './IPlaygroundObject';
import { store } from '../../../../app/store';
import { addObject, objectsSelector } from '../../model';

export type ObjectGUID = string;

export default class PlaygroundModel {
    private _gridCanvasModel: GridCanvasModel;
    private _container: HTMLElement;

    get objects() {
        return objectsSelector(store.getState());
    }

    constructor(container: HTMLElement) {
        this._gridCanvasModel = new GridCanvasModel(container);
        this._container = container;
    }

    public init() {
        this._gridCanvasModel.init();
    }

    public getCoordsByPosition(position: IPosition) {
        return this._gridCanvasModel.getCoordsByPosition(position);
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
