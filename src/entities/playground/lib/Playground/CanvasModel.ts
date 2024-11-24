
export default class CanvasModel {
   public canvas: HTMLCanvasElement;
   public ctx: CanvasRenderingContext2D
   public ctxWidth: number;
   public ctxHeight: number
   constructor(canvas: HTMLCanvasElement) {
       this.canvas = canvas;
      //@ts-ignore
       this.ctx = canvas.getContext('2d');
       this.ctxWidth = this.canvas.width;
       this.ctxHeight = this.canvas.height;
   }
}
