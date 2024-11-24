import SourceModel from '../SourceModel';
import GridCanvasModel from './GridCanvasModel';

export default class PlaygroundModel {
    private _gridCanvasModel: GridCanvasModel;
    private _source: SourceModel | null = null;
    constructor(container: HTMLDivElement) {
        this._gridCanvasModel = new GridCanvasModel(container);
    }

    public init() {
        this._gridCanvasModel.init();
    }

    public createSource() {
        this._source = new SourceModel(0, 0);
        this._source.startRadiation();
    }

    public deleteSource() {
      if (this._source) {
         this._source.stopRadiation();
         this._source = null;
      }
    }
}
