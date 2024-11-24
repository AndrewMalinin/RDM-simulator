import GeoCoordinate from './GeoCoordinate';
export * from './GeoCoordinate';

const ONE_DEGREE_OF_LATITUDE_KM = 111;
const ONE_RAD = 57.295779513;

function getOneDegreeOfLongitude(latitude: number) {
    return Math.cos(latitude / ONE_RAD) * 111.32; //111.32 - Длина одного градуса долготы на экваторе
}

/**
 * Вычисляет курс объекта в градусах на основании двух точек
 *
 * @param  {type} latitudeOld  Широта предыдущего местоопределения
 * @param  {type} longitudeOld Долгота предыдущего местоопределения
 * @param  {type} latitudeNew  Широта текущего местоопределения
 * @param  {type} longitudeNew Долгота текущего местоопределения
 * @return {type}              Направление движения объекта в градусах
 */
export function calculateCourse(oldLocation: GeoCoordinate, newLocation: GeoCoordinate): number | null {
    if (!oldLocation.isValid || !newLocation.isValid || GeoCoordinate.areEquals(oldLocation, newLocation)) {
        return null;
    }

    const longitudeDiff =
        //@ts-ignore проверили валидность if-ом в начале
        (newLocation.longitude - oldLocation.longitude) * getOneDegreeOfLongitude(newLocation.latitude);
    //@ts-ignore проверили валидность if-ом в начале
    const latitudeDiff = (newLocation.latitude - oldLocation.latitude) * ONE_DEGREE_OF_LATITUDE_KM;
    const angle = Math.atan2(latitudeDiff, longitudeDiff) * ONE_RAD;
    return 90 - angle; // Поправка на то, что у карты ноль находится в Pi/2
}

/**
 * Вычисляет минимальные и максимальные координаты полигона, (вписывание полигона в квадрат)
 *
 * @export
 * @param {number[][]} pointsArray - массив точек (каждая точка это массив из двух значений [широта, долгота])
 */
export function getSquarePolygon(pointsArray: number[][]) {
    if (pointsArray.length === 0) return undefined;
    let min_lat = pointsArray[0][0];
    let max_lat = pointsArray[0][0];
    let min_lon = pointsArray[0][1];
    let max_lon = pointsArray[0][1];

    for (let i = 1; i < pointsArray.length; i++) {
        if (min_lat > pointsArray[i][0]) {
            min_lat = pointsArray[i][0];
        }
        if (max_lat < pointsArray[i][0]) {
            max_lat = pointsArray[i][0];
        }
        if (min_lon > pointsArray[i][1]) {
            min_lon = pointsArray[i][1];
        }
        if (max_lon < pointsArray[i][1]) {
            max_lon = pointsArray[i][1];
        }
    }
    return {
        min_lat,
        max_lat,
        min_lon,
        max_lon
    };
}
