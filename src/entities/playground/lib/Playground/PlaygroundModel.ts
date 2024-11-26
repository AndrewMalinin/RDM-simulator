import GridCanvasModel from './GridCanvasModel';
import IPlaygroundObject from './IPlaygroundObject';

export type ObjectGUID = string;

export default class PlaygroundModel {
    private _gridCanvasModel: GridCanvasModel;
    public objects: { [key: ObjectGUID]: IPlaygroundObject } = {};
    private _container: HTMLElement;
    constructor(container: HTMLElement) {
        this._gridCanvasModel = new GridCanvasModel(container);
        this._container = container;
    }

    public init() {
        this._gridCanvasModel.init();
    }

    private _addObject(object: IPlaygroundObject) {
        // const el = object.getDOMElement();
        // this._container.appendChild(el);
    }

    public addObject(object: IPlaygroundObject) {
        if (!this.objects[object.guid]) {
            this.objects[object.guid] = object;
            this.objects = {...this.objects}
            this._addObject(object);
        }
    }
}
