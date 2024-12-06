import Color from './Color';
import { COLOR_PALETTE_48 } from './constants';

export * from './constants';
export * from './Color';

/**
 * Возвращает цвет из палитры по переданному числу.
 * Для подряд идущих цветов будут возвращаться максимально непохожие цвета.
 *
 * @export
 * @param {number} number
 * @param {string[]} [colorPalette=COLOR_PALETTE_48]
 * @return {*}
 */
export function getColorFromPaletteByNumber(number: number, colorPalette: string[] = COLOR_PALETTE_48) {
    if (!number) return colorPalette[0]; // если number === 0, то первый элемент палитры как раз будет соответствовать
    // Временный хардкод, так как палитра это 6 градиентов по 8 цветов каждый
    return colorPalette[(number * 8) % colorPalette.length];
}

/**
 * Меняет значение прозрачности в стандартной rgba строке и возвращает строку
 *
 * @example
 * console.log(changeRgbaOpacity("rgba(123,80,55,0.8)"), 0.4) // rgba(123,80,55,0.4)
 *
 * @export
 * @param {string} rgbaColor
 * @param {number} [opacity=1]
 * @return {*}
 */
export function changeRgbaOpacity(rgbaColor: string, opacity = 1) {
    if (rgbaColor === undefined) return 'rgba(255,255,255,1)';
    return rgbaColor.replace(/\s?\d*\.?\d\s?\)$/gm, `${opacity})`);
}

/**
 * Возвращает цвет, зависимый от качества (число от 0 до 100).
 *
 * При максимальном качестве возвращается переданный цвет (color).
 * Чем меньше качество, тем ближе становится возвращаемый цвет к серому.
 * При качестве = 0 возвращается серый цвет
 *
 * @export
 * @param {Color} color
 * @param {number} quality - качество от 0 до 100
 * @return {*}  {Color}
 */
export function getColorWithQuality(color: Color, quality: number): Color {
    if (quality < 0) quality = 0;
    else if (quality > 100) quality = 100;
    const grey = new Color(128, 128, 128);
    return new Color(
        grey.red - Math.round(((grey.red - color.red) * quality) / 100.0),
        grey.green - Math.round(((grey.green - color.green) * quality) / 100.0),
        grey.blue - Math.round(((grey.blue - color.blue) * quality) / 100.0)
    );
}

// /**
//  * Возвращает уникальный цвет для каждого неотрицательного числа.
//  * В идеале цвета для подряд идущих чисел будут максимально разнесены в цветовом пространстве
//  *
//  * @export
//  * @param {number} number
//  */
// export function getUniqueColorByNumber(number: number) {}
