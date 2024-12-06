export class CommonUtils {
   constructor() {}

   static getIpFromCurrentUrl() {
      var regexp = /src=([^&]+)/i;
      var getValue = '';
      if (!!regexp.exec(document.location.search))
         getValue = regexp.exec(document.location.search)[1];
      return getValue;
   }

   /**
    * @static Преобразует время принятое в JSON'е с самолётами и преобразует в unixTimeStamp
    *
    * @param  {String} ivsTime строка вида "hh:mm:ss.msc"
    * @return {int}         timeStamp
    */
   static ivsTimeToUnix(ivsTime) {
      let timeArray = ivsTime.split(':', 8);
      timeArray.push(ivsTime.slice(-3));
      let time = new Date();
      time.setHours(timeArray[0],timeArray[1],timeArray[2], timeArray[3]);
      return time.getTime();
   }

   /**
    * @static Вычисляет курс объекта в градусах на основании четырех координат
    *
    * @param  {type} latitudeOld  Широта предыдущего местоопределения
    * @param  {type} longitudeOld Долгота предыдущего местоопределения
    * @param  {type} latitudeNew  Широта текущего местоопределения
    * @param  {type} longitudeNew Долгота текущего местоопределения
    * @return {type}              Направление движения объекта в градусах
    */
   static calculateCourse(latitudeOld, longitudeOld, latitudeNew, longitudeNew){
     if(longitudeNew == longitudeOld && latitudeNew == latitudeOld){
       return undefined;
     }
     let _angle =  Math.atan( (latitudeNew - latitudeOld) /
                              (longitudeNew - longitudeOld) ) * 57.2958;
     let _correct = (longitudeNew - longitudeOld)< 0 ? 180 : 0;
     return (90 - _angle ) + _correct;
   }

   static round(number, precision) {
      if(number === '') { return '';}
      if(precision === 0){ return parseInt(number);}
      return parseInt(number * Math.pow(10, precision)) / Math.pow(10, precision);
   }

   static roundToFixedDigit(number, digit) {
      let roundedNumber = CommonUtils.round(number, digit);
      return roundedNumber.toFixed(digit)
   }

   /**
    * Выбирает контрастный по отношению к фону цвет текста
    *
    * @param  {String} bgColorHEX   Цвет фона в HEX-формате
    * @param  {String} defaultColor Цвет, возвращаемый при ошибке в функции
    * @return {String}  Цвет текста: белый(#EEEEEE), черный(#000000) или defaultColor
    */
   static getTextColor(bgColorHEX, defaultColor = "#f0f0f0") {
     if('#' !== bgColorHEX[0]) {return defaultColor; }
     let _r = 0.3 * parseInt(bgColorHEX.substr(1, 2), 16);
     let _g = 0.59 *  parseInt(bgColorHEX.substr(3, 2), 16);
     let _b = 0.11 * parseInt(bgColorHEX.substr(5, 2), 16);
     return (_r + _g + _b + 1) < 128 ?  '#f8f8f8': '#000000';

   }

   /**
    * Преобразует время из UNIX-формата в строку вида
    * hours:minutes:seconds/day.month.year
    *
    * @param  {number} time UNIX-время
    * @return {String} Время в формате hours:minutes:seconds/day.month.year
    */
   static timeTransform(time){
     let date = new Date(time);
     let day   = ('0' +  date.getDate())    .slice(-2);
     let month = ('0' + (date.getMonth()+1)).slice(-2);
     let year  = ('0' +  date.getFullYear()).slice(-2);
     return String( CommonUtils.getHoursMinuteSecondsDate(time) + '/' + day + '.' + month + '.' + year);
   }

   /**
    * Переводит UNIX-время в строку вида
    * hours:minutes:seconds
    *
    * @param  {number} unixTimeStamp UNIX-время
    * @return {String} Время в формате hours:minutes:seconds
    */
   static getHoursMinuteSecondsDate(unixTimeStamp){
     let time = new Date(unixTimeStamp);
     return  ('0' + time.getHours())  .slice(-2) + ':' +
             ('0' + time.getMinutes()).slice(-2) + ':' +
             ('0' + time.getSeconds()).slice(-2);
   }

   /**
    * Генерирует случайное целое число в диапазоне [0, max]
    *
    * @param  {number} max Максимальное число диапазона
    * @return {number}     Случайное целое число
    */
   static getRandomInt(max) {
     return Math.floor(Math.random() * Math.floor(max));
   }

   /**
    * Создает массив значений с промежутком s, от a до b
    *
    * @param  {number} a нижняя граница диапазона
    * @param  {number} b верхняя граница диапазона
    * @param  {number} s шаг
    * @return {Array}   Массив значений
    */
   static range(a, b, s = 1) {
      if (a >= b) return [];
      var r = [],
         i = a;
      while (i <= b) {
         r.push(i);
         i += s;
      }
      return r;
   }

   static hexToRgba(hexColor, opacity = 0) {
      return `rgba(${parseInt(hexColor.substr(1, 2), 16)}, ${parseInt(hexColor.substr(3, 2), 16)}, ${parseInt(hexColor.substr(5, 2), 16)}, ${opacity})`
   }

   static clickInsideElement(e, className) {
     let el = e.srcElement || e.target;
     if ( el.classList.contains(className) ) {
       return el;
     } else {
       while ( el = el.parentNode ) {
         if ( el.classList && el.classList.contains(className) ) {
           return el;
         }
       }
     }
     return false;
   }

   static calcAverage(array) {
      return CommonUtils.roundToFixedDigit(array.reduce((sum, current) => sum + current, 0) / parseFloat(array.length), 1);
   }

   static calcStndDeviation(array) {
      let _avg = CommonUtils.calcAverage(array);
      return CommonUtils.roundToFixedDigit(Math.sqrt(array.reduce((sum, current) => sum + (current - _avg) * (current - _avg), 0) / parseFloat(array.length)), 1);
   }

   static getMonthNamesArray(){
      return [ 'января', 'февраля', 'марта',
               'апреля','мая','июня','июля',
               'августа','сентября','октября',
               'ноября','декабря'
            ];
   }

   static getMonthNumberByName(monthName) {
      return CommonUtils.getMonthNamesArray().indexOf(monthName) + 1;
   }
   
   static getMonthNameByNumber(monthNumber) {
      return CommonUtils.getMonthNamesArray()[monthNumber - 1];
   }

}

/**
* Вычисляет хэш-функцию от строки. Вызывается через точку
* <String>.hash()
*
* @return {number}  Хэш строки
*/
export function hash(){
  return this.split('').reduce((prevHash, currVal) =>
    (((prevHash << 5) - prevHash) + currVal.charCodeAt(0))|0, 0);
}

String.prototype.hash = hash;
