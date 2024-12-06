/**
 * Базовый класс, предоставляющий функции подписки и уведомлений.
 * Подходит для классов-моделей, которые уведомляют об обновлении данных
 * 
 * @example
 *  class Model extends Observable {}
 *  const model = new Model();
 *  model.subscribe('signal', callback);
 *  callback(arg1, arg2, arg3, ...) {}
 * @export
 * @class Observable
 */

export default class Observable {
   private _listeners: {
      [key: string]: {
         callbacks: Array<Function>;
      };
   } = {};
   public subscribe(e: string, callback: Function) {
      if (this._listeners[e] === undefined) {
         this._listeners[e] = {callbacks: []};
      }
      this._listeners[e].callbacks.push(callback);
   }

   public unsubscribe(e: string, callback: Function) {
      this._listeners[e].callbacks = this._listeners[e].callbacks.filter(function (listener) {
         return listener !== callback;
      });
   }

   protected _emit(e: string, ...params: any) {
      if (this._listeners[e] === undefined || this._listeners[e].callbacks === undefined) {
         return;
      }

      this._listeners[e].callbacks.forEach(function(listener) {
         if (arguments.length > 0) {
            listener(...params);
         } else {
            listener();
         }
      });
   }
}
