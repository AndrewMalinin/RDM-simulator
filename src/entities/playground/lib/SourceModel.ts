import Observable from '../../../shared/lib/helpers/Observable';
import { ICoords } from './Playground/IPlaygroundObject';

enum PULSE_TYPE {
    CHIRP = 'chirp'
}

export default class SourceModel extends Observable {
    static SIGNALS = {
        COORDS_UPDATED: 'c_u',
        RADIATING: 'r'
    };
    private _samplingFrequency = 10_000;
    private _carrierFreq_Hz = 5_000;
    private _pulseType = PULSE_TYPE.CHIRP;
    private _pulseRepetitionPeriod_s = 1000;
    private _pulseDuration_us = 50;
    public coords: ICoords | null = null;
    private _radiatingTimer: any = null;

    public updateCoords(coords: ICoords) {
        if (this.coords !== null && this.coords.x !== coords.x && this.coords.y !== coords.y) {
            this.coords = { ...coords };
            this._emit(SourceModel.SIGNALS.COORDS_UPDATED, this.coords);
        }
        else if (this.coords === null) {
            this.coords = { ...coords };
            this._emit(SourceModel.SIGNALS.COORDS_UPDATED, this.coords);
        }
    }

    public startRadiation() {
        this._radiatingTimer = setInterval(() => {
            this.radiate();
        }, this._pulseRepetitionPeriod_s);
    }

    radiate() {
        this._emit(SourceModel.SIGNALS.RADIATING, 0);
    }

    stopRadiation() {}
}
