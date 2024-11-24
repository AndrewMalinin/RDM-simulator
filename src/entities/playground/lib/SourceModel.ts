import Observable from '../../../shared/lib/Observable';

enum PULSE_TYPE {
    CHIRP = 'chirp'
}

export default class SourceModel extends Observable {
    static SIGNALS = {
        POSITION_UPDATED: 'p_u',
        RADIATING: 'r'
    };
    private _samplingFrequency = 10_000;
    private _carrierFreq_Hz = 5_000;
    private _pulseType = PULSE_TYPE.CHIRP;
    private _pulseRepetitionPeriod_s = 1000;
    private _pulseDuration_us = 50;
    public position = { x: 0, y: 0 };
    private _radiatingTimer: any = null;

    constructor(x: number, y: number) {
        super();
        this.updatePosition(x, y);
    }

    updatePosition(x: number, y: number) {
        this.position.x = x;
        this.position.y = y;
    }

    startRadiation() {
        this._radiatingTimer = setInterval(() => {
            this.radiate();
        }, this._pulseRepetitionPeriod_s);
    }

    radiate() {
        this._emit(SourceModel.SIGNALS.RADIATING, 0);
    }

    stopRadiation() {}
}
