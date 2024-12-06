export function createGUID() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

/**
 * Вычисление хэша строки
 *
 * @export
 * @param {string} string
 * @return {*}
 */
export function hash(string: string): number {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        const char = string.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

/**
 * Приводит первый символ строки к верхнему регистру
 * Пример:
 *   someString ---> SomeString
 *   OtherString ---> OtherString
 *
 * @export
 * @param {string} string
 * @return {*}
 */
export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Приводит первый символ строки к нижнему регистру
 * Пример:
 *   SomeString ---> someString
 *   otherString ---> otherString
 *
 * @export
 * @param {string} string
 * @return {*}
 */
export function decapitalizeFirstLetter(string: string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

/**
 * Проверяет, что в строке содержатся только числа
 * (строковое представление натурального числа)
 *
 * @export
 * @param {string} string
 * @return {*}
 */
export function isNumericString(string: string) {
    if (!string) return false;
    return string.match(/\D/) === null;
}

export function getFormattedText(_text: string) {
    if (_text) {
        return _text.split('\n').map((str, i) => (str === '\n' || str === '' ? <br key={i} /> : <p key={i}>{str}</p>));
    } else {
        return <></>;
    }
}
