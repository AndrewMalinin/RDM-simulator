/**
 * Класс для работы с цветами. Позволяет конвертировать текстовые представления цветов друг в друга и
 * выполнять прочие операции с цветами
 *
 * @export
 * @class Color
 */
export default class Color {
    private _r = 0;
    private _g = 0;
    private _b = 0;
    private _a = 1;

    constructor(redOrString?: number | string, green?: number, blue?: number, alpha?: number) {
        if (redOrString === undefined) {
            this._setReserveColor();
        } else if (typeof redOrString === 'number') {
            this._r = redOrString;
            this._g = green || 0;
            this._b = blue || 0;
            this._a = alpha || 1;
        } else if (typeof redOrString === 'string') {
            const testString = redOrString.replace(/ +/g, '');
            if (/^rgb\(.*\)$/.test(testString)) {
                // rgb()
                this.fromRgbString(testString);
            } else if (/^rgba\(.*\)$/.test(testString)) {
                // rgba()
                this.fromRgbaString(testString);
            } else if (/^#(?:[0-9a-f]{3}){1,2}$/i.test(testString)) {
                // hex()
                this.fromHexString(testString);
            } else {
                this._setReserveColor();
            }
        }
    }

    private _setReserveColor() {
        this._r = 0;
        this._g = 0;
        this._b = 0;
        this._a = 1;
    }

    public fromRgbString(str: string) {
        const substr = str.match(/\d{1,3},\d{1,3},\d{1,3}/);
        if (!substr) return this._setReserveColor();
        const colors = substr[0].split(',');
        this._r = parseInt(colors[0]) || 0;
        this._g = parseInt(colors[1]) || 0;
        this._b = parseInt(colors[2]) || 0;
        this._a = 1;
    }

    public fromRgbaString(str: string) {
        const substr = str.replace('rgba(', '').replace(')', '');
        const colors = substr.split(',');
        this._r = parseFloat(colors[0]) || 0;
        this._g = parseFloat(colors[1]) || 0;
        this._b = parseFloat(colors[2]) || 0;
        this._a = parseFloat(colors[3]) || 1;
    }

    public fromHexString(str: string) {
        let colorsStr = str.slice(1);
        if (colorsStr.length === 3) {
            colorsStr = colorsStr
                .split('')
                .map((color) => color + color)
                .join('');
        }
        this._r = parseInt(colorsStr.slice(0, 2), 16);
        this._g = parseInt(colorsStr.slice(2, 4), 16);
        this._b = parseInt(colorsStr.slice(4, 6), 16);
        this._a = 1;
    }

    public toRgba(customOpacity?: number) {
        return `rgba(${this._r},${this._g},${this._b},${customOpacity === undefined ? this._a : customOpacity})`;
    }

    public toRgb() {
        return `rgb(${this._r},${this._g},${this._b})`;
    }

    public toHex() {
        return `#${this._r.toString(16)}${this._g.toString(16)}${this._b.toString(16)}`;
    }

    get red() {
        return this._r;
    }

    get green() {
        return this._g;
    }

    get blue() {
        return this._b;
    }

    get alpha() {
        return this._a;
    }

    /**
     * Сравнивает два цвета на идентичность
     *
     * @static
     * @param {Color} firstColor
     * @param {Color} secondColor
     * @return {boolean}
     * @memberof Color
     */
    public static areEquals(firstColor: Color, secondColor: Color): boolean {
        return (
            firstColor.red === secondColor.red &&
            firstColor.green === secondColor.green &&
            firstColor.blue === secondColor.blue &&
            firstColor.alpha === secondColor.alpha
        );
    }

    /**
     * Подбирает контрастный цвет текста (черный или белый) для фонового цвета
     *
     * @static
     * @param {Color} bgColor - Цвет фона, на котором планируется разместить текст
     * @return {*}
     * @memberof Color
     */
    public static getContrastColor(bgColor: Color) {
        const _r = 0.3 * bgColor._r;
        const _g = 0.59 * bgColor._g;
        const _b = 0.11 * bgColor._b;
        return _r + _g + _b + 1 < 128 ? '#f8f8f8' : '#000000';
    }
}
