import { createGUID } from '../../../../shared/lib';
import Observable from '../../../../shared/lib/Observable';
import PlaygroundModel, { ObjectGUID } from './PlaygroundModel';

export enum ICON_TYPE {
    CIRCLE = 'circle',
    SOURCE = 'source',
    RECEIVER = 'receiver'
}

export interface IObjectPosition {
    x: number;
    y: number;
    height: number;
    width: number;
}

export interface ICoords {
    x: number;
    y: number;
}

export default class IPlaygroundObject extends Observable {
    public static SIGNALS = {
        COORDS_UPDATED: 'c_u',
        POSITION_TRYING_TO_CHANGE: 'p_t_c'
    };
    public readonly position: ICoords = { x: 0, y: 0 };
    public guid: ObjectGUID = createGUID();
    public icon: ICON_TYPE = ICON_TYPE.CIRCLE;
    private _domElement: HTMLElement | null = null;
    private _playgroundModel: PlaygroundModel | null = null;

    public getDOMElement() {
        if (this._domElement) {
            return this._domElement;
        }
        const el = document.createElement('div');
        el.className = 'post-label';

        // makeDraggable(el);
        this._domElement = el;
        return el;
    }

    public addTo(playgroundModel: PlaygroundModel) {
        playgroundModel.addObject(this);
    }

    public setPosition(x: number, y: number) {}
}
