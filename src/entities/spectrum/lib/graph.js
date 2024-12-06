import { CommonUtils       } from "./commonUtils.js";

export class Graph {
   constructor() {
      this.resizerWidth = 0;
      this.canvasWidth = undefined;
      this.canvasHeight = undefined;
      this.drawArea = {
         x: undefined,
         y: undefined
      };
      this.generator = 0;
      this.config = {
         axes: {
            padding: {
               left: 32.5,
               top: 15.5,
               right: 10.5,
               bottom: 25.5
            },
            color: 'rgba(230,230,250,0.2)',
            minYLabelsInterval: 25,
            minXLabelsInterval: 45,
            serifLength: 5
         },
         labels: {
            color: 'rgba(230,230,230,1)',
            mainLabelsColor: 'rgba(0, 255, 88, 1)',
            fontFamily: 'Consolas',
            fontSize: '1rem',
            unitY: 'дБ',
            unitX: 'МГц',
         },
         graphics: {
            width: 1,
            defaultColor: "#00FA9A",
            fillOpacity: 0.15,
            strokeOpacity: 1
         }
      };
      this.maxY = 100;
      this.minY = 0;
      this.segmentList = undefined;
      this.labelsXStep = [10, 20, 25, 50, 75, 100, 125, 150, 200, 250, 400, 500, 750, 1000, 2000] //[2000, 1000, 750, 500, 250, 200, 100, 75, 50, 25, 20, 10];//
      this.handleCanvasResize();
      window.addEventListener('resize', () => {
         this.handleCanvasResize();
      });

      window.addEventListener('markupResize', () => {
         this.handleCanvasResize();
      });

      document.querySelector('#layer_pointer').addEventListener("pointermove",
         (e) => {
            this.drawPointer(e)
         });

      document.querySelector('#layer_pointer').addEventListener("pointerout", (e) => {
         this.ptrCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      });

      document.querySelector('.spectrum').addEventListener("pointerdown", (e) => {
         this.handleMouseClick(e);
      });
   }

   init() {
      let canvas = document.querySelector('#layer_graph');
      let ctx = canvas.getContext('2d');
      this.canvasWidth = canvas.width;
      this.canvasHeight = canvas.height;
      this.drawArea.x = this.canvasWidth - (this.config.axes.padding.left + this.config.axes.padding.right);
      this.drawArea.y = this.canvasHeight - (this.config.axes.padding.top + this.config.axes.padding.bottom);
      this.ctx = ctx;
      this.maxCtx = document.querySelector('#layer_graph-max').getContext('2d');
      this.axesCtx = document.querySelector('#layer_axes').getContext('2d');
      this.ptrCtx = document.querySelector('#layer_pointer').getContext('2d');
      this.ctx.lineJoin = "round";
      this.ctx.lineCap = "round";
      this.maxCtx.lineJoin = "round";
      this.maxCtx.lineCap = "round";
      this.ptrCtx.strokeStyle = 'rgba(255, 255,255,0.7)';
      this.ptrCtx.fillStyle = 'rgba(0, 246,154,1)';
      this.ptrCtx.font = `${this.config.labels.fontSize} ${this.config.labels.fontFamily}`;
      this.ptrCtx.lineWidth = 1;
   }

   reset() {
      this.handleCanvasResize();
      this.segmentList = undefined;
   }

   setConfig(blockName, propertyName, value) {
      if (undefined !== this.config[blockName]) {
         if (undefined !== this.config[blockName][propertyName]) {
            this.config[blockName][propertyName] = value;
         }
      }
   }

   handleCanvasResize() {
      let spectrumBlockSizes = document.querySelector('.spectrum').getBoundingClientRect();
      let canvases = document.querySelectorAll('.spectrum__layer');
      for (var i = 0; i < canvases.length; i++) {
         canvases[i].width = spectrumBlockSizes.width;
         canvases[i].height = spectrumBlockSizes.height;
      }
      this.init();
      requestAnimationFrame(() => {
         this.updateYAxis();
         this.updateXAxis();
      });
   }

   draw(panoramasStorage, segmentList, segmentListChanged = false) {
      //   console.time('Graph:')
      if (this.segmentList === undefined || segmentListChanged) {
         this.segmentList = segmentList;
         this.updateYAxis();
         this.updateXAxis();
      }

      if (this.segmentList !== undefined) {
         this.clear()
         Object.values(panoramasStorage).forEach((drone, i) => {
            for (let panorama in drone) {

               // Ищем к какому сегменту принаджелит текущая панорама
               let numberOfSegment = -1;
               let i = 0;
               while (i < this.segmentList.length) {
                  if (this.segmentList[i][0] <= drone[panorama].startFreq && this.segmentList[i][1] >= drone[panorama].endFreq) {
                     numberOfSegment = i;
                     break;
                  }
                  i++;
               }
               if (-1 === numberOfSegment) continue;


               let fullSegmentsLength = this.segmentList.reduce((accum, item) => {
                  return accum + (item[1] - item[0])
               }, 0);

               let startSegmentOffset;
               if (0 == numberOfSegment) startSegmentOffset = 0;
               else {
                  startSegmentOffset = this.drawArea.x * ((this.segmentList.slice(0, numberOfSegment).reduce((accum, item) => {
                     return accum + (item[1] - item[0])
                  }, 0)) / fullSegmentsLength);
               }

               if ((drone[panorama].startFreq - this.segmentList[i][0]) > 0) {
                  startSegmentOffset += this.drawArea.x * ((drone[panorama].startFreq - this.segmentList[i][0]) / fullSegmentsLength);
               }

               let segmentLength = this.drawArea.x * ((drone[panorama].band) / fullSegmentsLength)
               this.drawSegmentSpectrum(drone[panorama].counts,
                  drone[panorama].maxCounts,
                  drone[panorama].color,
                  Math.floor(startSegmentOffset) + 0.5,
                  Math.floor(segmentLength) - 1.5);
            }
         });
      }
      //   console.timeEnd('Graph:')
   }

   updateXAxis() {
      if (this.segmentList === undefined) return;
      this.axesCtx.globalCompositeOperation = 'source-over'
      // ====================== Стиль линий ==========================//
      this.axesCtx.strokeStyle = this.config.axes.color;
      this.axesCtx.lineWidth = 1;
      // ====================== Стиль заливки ==========================//
      this.axesCtx.fillStyle = this.config.labels.mainLabelsColor;
      // ====================== Стиль подписей ==========================//
      this.axesCtx.font = `${this.config.labels.fontSize} ${this.config.labels.fontFamily}`;
      this.axesCtx.textAlign = "center";
      this.axesCtx.textBaseline = "top";
      this.axesCtx.setLineDash([]);
      let fullSegmentsLength = this.segmentList.reduce((accum, item) => {
         return accum + (item[1] - item[0])
      }, 0);
      let segmentWidth;
      let segmentBand;
      let j;
      let x = this.config.axes.padding.left;
      let y = this.canvasHeight - this.config.axes.padding.bottom;
      this.axesCtx.beginPath();
      this.axesCtx.moveTo(x, y);
      for (let i = 0; i < this.segmentList.length; i++) {
         segmentBand = this.segmentList[i][1] - this.segmentList[i][0];
         segmentWidth = (segmentBand / fullSegmentsLength) * this.drawArea.x;
         // Первая засечка
         this.axesCtx.lineTo(Math.floor(x) + 0.5, y + this.config.axes.serifLength);
         this.axesCtx.moveTo(Math.floor(x) + 0.5, y);
         this.axesCtx.fillText((this.segmentList[i][0]) / 1e6,
            Math.floor(x) + 0.5, y + this.config.axes.serifLength + 2);

         j = 0;
         while (segmentWidth / this.config.axes.minXLabelsInterval < Math.floor((segmentBand / 1e6) / this.labelsXStep[j])) {
            j++;
            if (j >= this.labelsXStep.length) {
               j = -1;
               break;
            }
         }

         if (-1 !== j) {
            let labelStep = this.labelsXStep[j];
            this.axesCtx.fillStyle = this.config.labels.color;
            let step_x = labelStep * segmentWidth / (segmentBand / 1e6);
            let new_x = x + step_x;
            let countOfLabels = Math.floor((Math.floor((segmentBand / 1e6)) + 1) / labelStep);
            for (let k = 1; k < countOfLabels; k++) {
               this.axesCtx.moveTo(new_x, y);
               this.axesCtx.lineTo(Math.floor(new_x) + 0.5, y + this.config.axes.serifLength);
               this.axesCtx.moveTo(Math.floor(new_x) + 0.5, y);
               this.axesCtx.fillText(((this.segmentList[i][0]) / 1e6) + this.labelsXStep[j] * k,
                  Math.floor(new_x) + 0.5, y + this.config.axes.serifLength + 2);
               new_x += step_x
            }

            this.axesCtx.fillStyle = this.config.labels.mainLabelsColor;
         }

         x += segmentWidth;
         this.axesCtx.moveTo(x, y);
      }
      //this.axesCtx.closePath();
      this.axesCtx.textAlign = "right";
      this.axesCtx.lineTo(Math.floor(x) + 0.5, y + this.config.axes.serifLength);
      this.axesCtx.moveTo(Math.floor(x) + 0.5, y);
      this.axesCtx.fillText(this.config.labels.unitX,
         Math.floor(x) + 5.5, y + this.config.axes.serifLength + 2);
      this.axesCtx.stroke();
   }


   drawSegmentSpectrum(_data, _maxData, _color, _leftOffset, _segmentLength) {
      if (_data === undefined) return;
      if (_color === undefined) _color = this.config.graphics.defaultColor;
      this.maxCtx.strokeStyle = CommonUtils.hexToRgba(_color, this.config.graphics.strokeOpacity);
      this.ctx.fillStyle = CommonUtils.hexToRgba(_color, this.config.graphics.fillOpacity);
      this.ctx.strokeStyle = "transparent";
      this.maxCtx.lineWidth = this.config.graphics.width;

      const dataLength = _data.length;
      const step_x = (_segmentLength) / dataLength;
      const scale_y = this.drawArea.y / (this.maxY - this.minY);
      let x = this.config.axes.padding.left - step_x + 1 + _leftOffset;
      const zeroLine = this.canvasHeight - this.config.axes.padding.bottom - 0.5;
      const parsedData = _data.map((item) => {
         if ((item - this.minY) < 0) return zeroLine;
         return zeroLine - ((item - this.minY) * scale_y)
      });

      this.ctx.beginPath();
      for (let i = 0; i < dataLength; i++) {
         x += step_x;
         this.ctx.lineTo(x, parsedData[i]);
      }
      this.ctx.lineTo(x, zeroLine);
      this.ctx.lineTo(this.config.axes.padding.left + _leftOffset, zeroLine);
      this.ctx.lineTo(this.config.axes.padding.left + _leftOffset, parsedData[0]);
      this.ctx.closePath();
      this.ctx.fill();


      if (undefined !== _maxData) {
         const parsedMaxData = _maxData.map((item) => {
            if ((item - this.minY) < 0) return zeroLine;
            return zeroLine - ((item - this.minY) * scale_y)
         });

         this.maxCtx.beginPath();
         x = this.config.axes.padding.left - step_x + 1 + _leftOffset
         for (let i = 0; i < dataLength; i++) {
            x += step_x;
            this.maxCtx.lineTo(x, parsedMaxData[i]);
         }

         this.maxCtx.stroke();
      }

   }

   clear() {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.maxCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
   }

   updateYAxis() {
      this.axesCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.axesCtx.globalCompositeOperation = 'source-over'
      // ====================== Стиль линий ==========================//
      this.axesCtx.strokeStyle = this.config.axes.color;
      this.axesCtx.lineWidth = 1;
      this.axesCtx.setLineDash([]);
      // ====================== Стиль подписей =======================//
      this.axesCtx.fillStyle = this.config.labels.color;
      this.axesCtx.font = `${this.config.labels.fontSize} ${this.config.labels.fontFamily}`;
      this.axesCtx.textAlign = "right";
      this.axesCtx.textBaseline = "middle";

      // Шаг значений подписей по Y
      let labelStep = 10;
      // Расстояние в пикселях между подписями
      let labelInterval = this.drawArea.y / ((this.maxY - this.minY) / labelStep);

      if (labelInterval > 2 * this.config.axes.minYLabelsInterval) {
         labelStep = 5;
      } else if (labelInterval < this.config.axes.minYLabelsInterval) {
         labelStep = 20;
      }
      labelInterval = this.drawArea.y / ((this.maxY - this.minY) / labelStep);
      // Массив подписей по оси Y
      let labelArray = CommonUtils.range(this.minY, this.maxY, labelStep)
      labelArray[labelArray.length - 1] = this.config.labels.unitY;
      let x = this.config.axes.padding.left;
      let y = this.config.axes.padding.top;
      this.axesCtx.beginPath();
      this.axesCtx.moveTo(x, y);
      for (let i = 0; i < labelArray.length - 1; i++) {
         this.axesCtx.lineTo(x - this.config.axes.serifLength, y);
         this.axesCtx.moveTo(x, Math.floor(y) + 0.5);
         this.axesCtx.fillText(labelArray[labelArray.length - i - 1],
            x - this.config.axes.serifLength - 5, y);
         y = Math.floor(this.config.axes.padding.top + (i + 1) * labelInterval) + 0.5;
         this.axesCtx.lineTo(x, y);
      }

      this.axesCtx.lineTo(x - this.config.axes.serifLength, y);
      this.axesCtx.moveTo(x, y);
      this.axesCtx.fillText(labelArray[0], x - this.config.axes.serifLength - 5, y);
      this.axesCtx.lineTo(x, this.canvasHeight - this.config.axes.padding.bottom);
      this.axesCtx.lineTo(this.canvasWidth - this.config.axes.padding.right,
         this.canvasHeight - this.config.axes.padding.bottom);
      this.axesCtx.stroke();

      this.drawHorizontalLine(labelArray.length);
   }

   drawHorizontalLine(numberOfLines) {
      this.axesCtx.strokeStyle = this.config.axes.color;
      this.axesCtx.setLineDash([5, 3]);
      let x = this.config.axes.padding.left + 1;
      let y = this.config.axes.padding.top;
      const lineInterval = this.drawArea.y / (numberOfLines - 1);
      this.axesCtx.beginPath();
      this.axesCtx.moveTo(x, y);
      for (let i = 0; i < numberOfLines - 1; i++) {
         this.axesCtx.lineTo(x + this.drawArea.x - 2, Math.floor(y) + 0.5);
         y += lineInterval;
         this.axesCtx.moveTo(x, Math.floor(y) + 0.5);
      }

      this.axesCtx.stroke();
      this.axesCtx.globalCompositeOperation = 'destination-out'
      this.axesCtx.fillStyle = 'red';
      this.axesCtx.arc(this.canvasWidth - 24, 24, 20, 0, 6.2831853071);
      this.axesCtx.closePath();
      this.axesCtx.fill();
   }

   drawPointer(e) {
      const containerBounds = document.querySelector('.spectrum').getBoundingClientRect();
      this.ptrCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      var x = e.clientX - containerBounds.left;
      var y = e.clientY - containerBounds.top;
      if (x < this.config.axes.padding.left ||
         x > (this.canvasWidth - this.config.axes.padding.right) ||
         y < this.config.axes.padding.top ||
         y > (this.canvasHeight - this.config.axes.padding.bottom)) return;
      this.ptrCtx.beginPath();
      this.ptrCtx.moveTo(this.config.axes.padding.left, Math.floor(y) + 0.5);
      this.ptrCtx.lineTo((this.canvasWidth - this.config.axes.padding.right), Math.floor(y) + 0.5);
      this.ptrCtx.moveTo(Math.floor(x) + 0.5, this.config.axes.padding.top);
      this.ptrCtx.lineTo(Math.floor(x) + 0.5, this.canvasHeight - this.config.axes.padding.bottom);
      this.ptrCtx.moveTo((this.canvasWidth - this.config.axes.padding.right), Math.floor(y) + 0.5);
      this.ptrCtx.stroke();
      let yLabel = parseInt((this.drawArea.y + this.config.axes.padding.top - y) * ((this.maxY - this.minY) / this.drawArea.y) + this.minY);

      if (this.segmentList !== undefined) {
         let fullSegmentsLength = this.segmentList.reduce((accum, item) => {
            return accum + (item[1] - item[0])
         }, 0);
         let res = this.drawArea.x / fullSegmentsLength;
         let accSegmentLength = this.config.axes.padding.left;
         let i = -1;

         while (accSegmentLength <= x) {
            i++;
            accSegmentLength += (this.segmentList[i][1] - this.segmentList[i][0]) * res;
         }

         let freq = Math.round(((this.segmentList[i][1] - (accSegmentLength - x) / res) / 1e5)) / 10;
         this.ptrCtx.textBaseline = "top";
         if (x < (this.canvasWidth - this.config.axes.padding.right - 70)) {
            this.ptrCtx.textAlign = "start";
            x += 5;
         }
         this.ptrCtx.fillText(freq,
            Math.floor(x) - 2.5, this.config.axes.padding.top);
      }

      this.ptrCtx.textAlign = "end";
      this.ptrCtx.textBaseline = "bottom";
      this.ptrCtx.fillText(yLabel + this.config.labels.unitY,
         (this.canvasWidth - this.config.axes.padding.right), Math.floor(y) - 0.5);
   }

   handleMouseClick(e) {
      if (e.which == 2) { // средняя кнопка мыши
         e.preventDefault();
         const zeroLine = this.canvasHeight - this.config.axes.padding.bottom;
         const deltaY = this.maxY - this.minY;
         const res = deltaY / this.drawArea.y; // разрешение оси Y дБ/пиксель
         let startY = e.clientY - this.resizerWidth;

         const g = (e) => {
            const diff = startY - (e.clientY - this.resizerWidth);
            if (!(Math.abs(diff) * res > 1)) {
               return;
            }
            this.minY -= diff * res;
            this.maxY -= diff * res;
            startY = e.clientY - this.resizerWidth;
         }

         document.querySelector('.spectrum').addEventListener('pointermove', g);
         document.querySelector('.spectrum').addEventListener('pointerup', () => {
            document.querySelector('.spectrum').removeEventListener('pointermove', g);
            this.minY = Math.round(this.minY);
            this.maxY = Math.round(this.maxY);
            this.updateYAxis();
            this.updateXAxis();
         });
      }
   }
}
