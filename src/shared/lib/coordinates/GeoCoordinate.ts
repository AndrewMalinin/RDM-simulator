type Coordinate = number | null;
type CoordinateArray = [Coordinate, Coordinate, Coordinate?];

/**
 * Класс для хранения координат
 *
 * @export
 * @class GeoCoordinate
 */
export default class GeoCoordinate {
    private _latitude: Coordinate = null;
    private _longitude: Coordinate = null;
    private _altitude: Coordinate = null;
    private _isValid = false;

    get latitude() {
        return this._latitude;
    }

    set latitude(lat: Coordinate) {
        if (lat !== this._latitude) {
            this._latitude = lat;
            this._isValid = this._checkValidity();
        }
    }

    get longitude() {
        return this._longitude;
    }

    set longitude(lon: Coordinate) {
        if (lon !== this._longitude) {
            this._longitude = lon;
            this._isValid = this._checkValidity();
        }
    }

    get altitude() {
        return this._altitude;
    }

    set altitude(alt: Coordinate) {
        if (alt !== this._altitude) {
            this._altitude = alt;
            this._isValid = this._checkValidity();
        }
    }

    get isValid() {
        return this._isValid;
    }

    private set isValid(validity: boolean) {
        this._isValid = validity;
    }

    static areEquals(coordsA: GeoCoordinate, coordsB: GeoCoordinate) {
        return (
            coordsA.latitude === coordsB.latitude &&
            coordsA.longitude === coordsB.longitude &&
            coordsA.altitude === coordsB.altitude
        );
    }

    public constructor(
        latitudeOrCoordArray?: Coordinate | CoordinateArray,
        longitude?: Coordinate,
        altitude?: Coordinate
    ) {
        if (latitudeOrCoordArray !== undefined) {
            if (Array.isArray(latitudeOrCoordArray)) {
                this.fromArray(latitudeOrCoordArray);
            } else {
                this.latitude = latitudeOrCoordArray === undefined ? null : latitudeOrCoordArray;
                this.longitude = longitude === undefined ? null : longitude;
                this.altitude = altitude || 0;
            }
        }
    }

    /**
     * Получает координаты из массива вида
     * [широта, долгота, высота(не обязательна)]
     *
     * @param {CoordinateArray} coordsArray
     * @memberof GeoCoordinate
     */
    public fromArray(coordsArray: CoordinateArray) {
        if (Array.isArray(coordsArray)) {
            this.latitude = coordsArray[0] === undefined ? null : coordsArray[0];
            this.longitude = coordsArray[1] === undefined ? null : coordsArray[1];
            this.altitude = coordsArray[2] || 0;
        } else {
            this.reset();
        }
    }

    /**
     * Возвращает координаты в виде [широта, долгота]
     * Если передан параметр withAltitude, то возвращает [широта, долгота, высота]
     *
     * @param {boolean} [withAltitude] - необходимо ли добавить высоту в массив
     * @return {*}  {CoordinateArray}
     * @memberof GeoCoordinate
     */
    public toArray(withAltitude?: boolean): CoordinateArray {
        const result: CoordinateArray = [this.latitude, this.longitude];
        if (this.altitude !== null) {
            result.push(this.altitude);
        }
        return result;
    }

    /**
     * Проверка координат на корректность
     *
     * @return {*}
     * @memberof GeoCoordinate
     */
    private _checkValidity(): boolean {
        if ((!this.latitude && !this.longitude) || !this.isValidAltitude()) {
            return false;
        }
        //@ts-ignore
        else if (this.latitude < -90 || this.latitude > 90 || this.longitude < -180 || this.longitude > 180) {
            return false;
        }
        return true;
    }

    /**
     * Проверка высоты на корректность
     *
     * @return {*}
     * @memberof GeoCoordinate
     */
    public isValidAltitude() {
        if (this.altitude !== null && this.altitude >= 0) {
            return true;
        }
        return false;
    }

    /**
     * Сбрасывает значения координат к дефолтным (null)
     *
     * @param {CoordinateArray} coordsArray
     * @memberof GeoCoordinate
     */
    public reset() {
        this.latitude = null;
        this.longitude = null;
        this.altitude = null;
        this._isValid = false;
    }
}
