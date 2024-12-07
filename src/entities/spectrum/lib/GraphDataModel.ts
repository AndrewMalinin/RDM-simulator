import Observable from '../../../shared/lib/helpers/Observable';

export interface IMinMax {
    x: [number, number];
    y: [number, number];
}

export enum GraphViewType {
    POINTS = 1,
    LINES = 2
}

export default class GraphDataModel extends Observable {
    static SIGNALS = {
        MINMAX_UPDATED: 'minmax_updated',
        POINTS_UPDATED: 'points_updated'
    };
    private _points: number[] = [];
    private _minMax: IMinMax | null = null;

    public setData(points: number[]) {
        this._points = points;
        this._emit(GraphDataModel.SIGNALS.POINTS_UPDATED);
    }
}
