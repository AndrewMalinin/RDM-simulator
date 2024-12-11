/**
 * Преобразует одномерный массив в матрицу
 *
 * @export
 * @param {Array<any>} arr
 * @param {number} rows
 * @param {number} cols
 * @return {*}
 */
export function toMatrix(arr: Array<any>, rows: number, cols: number) {
    const result = []; // итоговая матрица

    for (let i = 0; i < rows; i++) {
        const oneRow = Array(cols);
        for (let j = 0; j < cols; j++) {
            oneRow[j] = arr[i * cols + j];
        }
        result.push(oneRow);
    }
    return result;
}

/**
 * Проверяет, содержат ли два массива одинаковые элементы
 * без учета их положения (проще говоря, находятся ли во втором массиве
 * те же элементы, что и в первом, не важно в каком порядке они стоят )
 *
 * @example
 *  isArraysContainSameElements([1,2,3,4,5], [1,2,3,4,5]) --> true
 *  isArraysContainSameElements([1,2,3,4,5], [5,4,3,2,1]) --> true
 *  isArraysContainSameElements([], []) --> true
 *  isArraysContainSameElements([1,2,3], [4,5,6]) --> false
 *
 *
 * @export
 * @param {any[]} arr1
 * @param {any[]} arr2
 */
export function isArraysContainSameElements(arr1: any[], arr2: any[]) {
    if (!(Array.isArray(arr1) && Array.isArray(arr2)) || arr1.length !== arr2.length) return false;
    if (arr1 === arr2) return true;
    return !arr1.some((el) => !arr2.includes(el));
}

export function getLastElement<T>(arr: T[]): T {
    return arr[arr.length - 1];
}

export function step(a: number, b: number, s: number) {
    if (a >= b) return [];
    const r = [];
    let i = a;
    while (i <= b) {
        r.push(Math.round(i * 10) / 10);
        i += s;
    }
    return r;
}

export function smartRange(a: number, b: number, count: number) {
    const step = (b - a) / (count - 1);
    if (Math.abs(step) <= Number.MIN_VALUE) return [];
    const r = [];
    let temp = a;
    for (let i = 0; i < count; i++) {
        r.push(Math.round(temp * 1000) / 1000);
        temp += step;
    }
    // Поправка на случай иррационального step
    if (r[count - 1] !== b) {
        r[count - 1] = b;
    }
    return r;
}

export function range(a: number, b: number, count: number) {
    const step = (b - a) / (count - 1);
    if (Math.abs(step) <= Number.MIN_VALUE) return [];
    const r = [];
    let temp = a;
    for (let i = 0; i < count; i++) {
        r.push(temp);
        temp += step;
    }
    // Поправка на случай иррационального step
    if (r[count - 1] !== b) {
        r[count - 1] = b;
    }
    return r;
}

export function* rangeGen(a: number, b: number, count: number) {
    const step = (b - a) / (count - 1);
    if (Math.abs(step) <= Number.MIN_VALUE) return [];
    let temp = a;
    for (let i = 0; i < count; i++) {
        yield temp;
        temp += step;
    }
}

export function* genWrapper(arr: Array<any>) {
    for (let i = 0; i < arr.length; i++) {
        yield arr[i];
    }
}
