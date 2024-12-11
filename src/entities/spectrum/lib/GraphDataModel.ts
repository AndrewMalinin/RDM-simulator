import Observable from '../../../shared/lib/helpers/Observable';

export interface IMinMax {
    x: [number, number];
    y: [number, number];
}

export enum GRAPH_VIEW_TYPE {
    POINTS = 1,
    LINES = 2
}

export enum VALUES_TYPE {
    X_Y = 0,
    XRANGE_Y = 1
}

export interface IValues {
    x: Array<number>;
    y: Array<number>;
    type: VALUES_TYPE;
}

export interface IData {
    data: IValues;
    color?: string;
    shadowColor?: string;
}

export default class GraphDataModel extends Observable {
    static SIGNALS = {
        MINMAX_UPDATED: 'minmax_updated',
        DATA_UPDATED: 'data_updated'
    };
    private _type: GRAPH_VIEW_TYPE;
    private _data: IData | null = null;
    private _minMax: IMinMax | null = null;

    get type() {
        return this._type;
    }

    get data() {
        return this._data;
    }

    set minMax(v: IMinMax | null) {
        this._minMax = v;
        this._emit(GraphDataModel.SIGNALS.MINMAX_UPDATED, v);
    }

    get minMax() {
        return this._minMax;
    }

    constructor(type: GRAPH_VIEW_TYPE) {
        super();
        this._type = type;
    }

    public setData(data: IData) {
        this._data = data;
        this._emit(GraphDataModel.SIGNALS.DATA_UPDATED, this._data);
    }
}
