import { createGUID } from '../../../../shared/lib/helpers';
import Observable from '../../../../shared/lib/helpers/Observable';
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

export interface IPosition {
    x: number;
    y: number;
}

export default class IPlaygroundObject extends Observable {
    public static SIGNALS = {
        COORDS_UPDATED: 'c_u',
        COORDS_MANUALLY_SETTED: 'c_m_s',
        POSITION_TRYING_TO_CHANGE: 'p_t_c'
    };
    public coords: ICoords = { x: 0, y: 0 };
    private _position: IPosition = { x: 0, y: 0 };
    public style = {
        size: 24,
        color: '#100588'
    };
    public guid: ObjectGUID = createGUID();
    public icon: ICON_TYPE = ICON_TYPE.CIRCLE;
    private _playgroundModel: PlaygroundModel | null = null;

    constructor(c?: ICoords) {
        super();
        if (c) {
            this.setCoords(c);
            //this._emit(IPlaygroundObject.SIGNALS.COORDS_UPDATED, c);
        }
    }

    public setCoords(c: ICoords) {
        this.coords = { ...c };
        this._emit(IPlaygroundObject.SIGNALS.COORDS_UPDATED, c);
    }

    public setPosition(p: IPosition) {
        this._position = p;
        if (this._playgroundModel) {
            this.setCoords(this._playgroundModel.getCoordsByPosition(p));
        }
    }

    public addTo(playgroundModel: PlaygroundModel) {
        playgroundModel.addObject(this);
        this._playgroundModel = playgroundModel;
    }
}
