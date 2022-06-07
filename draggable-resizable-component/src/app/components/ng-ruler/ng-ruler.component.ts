import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import ResizeObserver from 'resize-observer-polyfill';
import { DataService } from './data.service';

@Component({
  selector: 'ng-ruler',
  templateUrl: './ng-ruler.component.html',
  styleUrls: ['./ng-ruler.component.scss'],
})
export class NgRulerComponent implements OnInit {
  @ViewChild('canvasWrapper', {static: true}) wrapper!: ElementRef;
  @ViewChild('canvasHorizontal', {static: true}) canvasHorizontal!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasVertical', {static: true}) canvasVertical!: ElementRef<HTMLCanvasElement>;

  @Input() rulerThickness: number = 25; // Thickness of the window ruler
  @Input() parentScale: number = 37.795275591; // Parent scale of the window ruler
  @Input() childScale: number = 0; // Child scale of the window ruler
  @Input() rulerColor: string = '#b9b7b5'; // Background color of the window ruler
  @Input() scaleColor: string = '#606060'; // Color of the scale of the window ruler
  @Input() numColor: string = '#403637'; // Color of the number printed in the window ruler
  @Input() borderColor: string = '#606060'; // Border color of the window ruler
  @Input() fontType: string = 'bold sans-serif'; // Font of the window ruler
  private rulerWidth: number = Math.round(210 * 3.7795275591 + 25);
  private rulerHeight: number = Math.round(297 * 3.7795275591 + 25);

  private ctxC!: CanvasRenderingContext2D;
  private ctxL!: CanvasRenderingContext2D;

  private prevOffsetX: number = 0;
  private prevOffsetY: number = 0;
  private newOffsetX: number = 0;
  private newOffsetY: number = 0;

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this._init();

    this._createHorizontal(0);
    this._createVertical(0);
    this._observer();
  }

  _init() {
    this.dataService.newScale(this.parentScale);
  }

  _observer(): void {
    const ro: ResizeObserver = new ResizeObserver(() => {
      this._createHorizontal(0);
      this._createVertical(0);
    });
    ro.observe(this.wrapper.nativeElement);
  }

  _printHorizontalParent(canvas: HTMLCanvasElement, refValue: number, remain: number, scaleCount: number): void {
    this.ctxL.beginPath();
    this.ctxL.moveTo(refValue, 0);
    this.ctxL.lineTo(refValue, canvas.height);
    this.ctxL.fillText(
      `${Math.abs(remain - scaleCount)}`,
      refValue + 1,
      10,
    );
    this.ctxL.strokeStyle = this.scaleColor;
    this.ctxL.lineWidth = 1;
    this.ctxL.font = this.fontType;
    this.ctxL.fillStyle = this.numColor;
    this.ctxL.stroke();
  }

  _printHorizontalChild(canvas: HTMLCanvasElement, refValue: number): void {
    this.ctxL.beginPath();
    this.ctxL.moveTo(refValue, 15);
    this.ctxL.lineTo(refValue, canvas.height);
    this.ctxL.strokeStyle = this.scaleColor;
    this.ctxL.lineWidth = 1;
    this.ctxL.stroke();
  }

  _printHorizontalEmptyBox(canvas: HTMLCanvasElement): void {
    this.ctxL.beginPath();
    this.ctxL.strokeStyle = this.borderColor;
    this.ctxL.strokeRect(0, 0, canvas.height, canvas.height);
    this.ctxL.fillStyle = this.rulerColor;
    this.ctxL.fillRect(0, 0, canvas.height, canvas.height);
    this.ctxL.stroke();
  }

  _createHorizontal(newOffsetX: number): void {
    this.ctxL = this.canvasHorizontal.nativeElement.getContext('2d')!;
    const l: HTMLCanvasElement = this.ctxL.canvas;
    l.width = this.rulerWidth;
    l.height = this.rulerThickness;
    const offsetX: number = this.prevOffsetX + newOffsetX;

    this.ctxL.translate(0.5, 0.5);
    this.ctxL.clearRect(0, 0, l.width, l.height);

    // Frame
    this.ctxL.beginPath();
    this.ctxL.strokeStyle = this.borderColor;
    this.ctxL.strokeRect(l.height, 0, l.width - l.height, l.height);
    this.ctxL.fillStyle = this.rulerColor;
    this.ctxL.fillRect(l.height, 0, l.width - l.height, l.height);
    this.ctxL.stroke();

    this.dataService.newOffsetX(offsetX);
    this.newOffsetX = offsetX;

    const offset: number = l.height + offsetX;
    const remain: number = Math.abs(Math.floor(offsetX / this.parentScale));
    const cutoff: number = offset - remain * this.parentScale;

    // Parents - positive
    let scaleCount: number = 0;
    for (let i = cutoff; i < l.width; i += this.parentScale) {
      this._printHorizontalParent(l, i, remain, scaleCount);
      scaleCount++;
    }
    // // Parents - negative
    scaleCount = 0;
    for (let i = cutoff; i > 0; i -= this.parentScale) {
      this._printHorizontalParent(l, i, remain, scaleCount);
      scaleCount++;
    }

    // Children - positive
    for (let i = cutoff; i < l.width; i += this.parentScale / this.childScale) {
      this._printHorizontalChild(l, i);
    }
    // // Children - negative
    for (let i = cutoff; i > 0; i -= this.parentScale / this.childScale) {
      this._printHorizontalChild(l, i);
    }

    // Empty box
    this._printHorizontalEmptyBox(l);
  }

  _printVerticalParent(canvas: HTMLCanvasElement, refValue: number, remain: number, scaleCount: number): void {
    this.ctxC.beginPath();
    this.ctxC.moveTo(0, refValue);
    this.ctxC.lineTo(canvas.width, refValue);
    this._fillTextLine(
      this.ctxC,
      `${Math.abs(remain - scaleCount)}`,
      1,
      refValue,
    );
    this.ctxC.strokeStyle = this.scaleColor;
    this.ctxC.lineWidth = 1;
    this.ctxC.font = this.fontType;
    this.ctxC.fillStyle = this.numColor;
    this.ctxC.stroke();
  }

  _printVerticalChild(canvas: HTMLCanvasElement, refValue: number): void {
    this.ctxC.beginPath();
    this.ctxC.moveTo(15, refValue);
    this.ctxC.lineTo(canvas.width, refValue);
    this.ctxC.strokeStyle = this.scaleColor;
    this.ctxC.lineWidth = 1;
    this.ctxC.stroke();
  }

  _printVerticalEmptyBox(canvas: HTMLCanvasElement): void {
    this.ctxC.beginPath();
    this.ctxC.strokeStyle = this.borderColor;
    this.ctxC.strokeRect(0, 0, canvas.width, canvas.width);
    this.ctxC.fillStyle = this.rulerColor;
    this.ctxC.fillRect(0, 0, canvas.width, canvas.width);
    this.ctxC.stroke();
  }

  _createVertical(newOffsetY: number): void {
    this.ctxC = this.canvasVertical.nativeElement.getContext('2d')!;
    const c: HTMLCanvasElement = this.ctxC.canvas;
    c.width = this.rulerThickness;
    c.height = this.rulerHeight;
    const offsetY: number = this.prevOffsetY + newOffsetY;

    this.ctxC.translate(0.5, 0.5);
    this.ctxL.clearRect(0, 0, c.width, c.height);

    // Frame
    this.ctxC.beginPath();
    this.ctxC.strokeStyle = this.borderColor;
    this.ctxC.strokeRect(0, c.width, c.width, c.height - c.width);
    this.ctxC.fillStyle = this.rulerColor;
    this.ctxC.fillRect(0, c.width, c.width, c.height - c.width);
    this.ctxC.stroke();

    this.dataService.newOffsetY(offsetY);
    this.newOffsetY = offsetY;

    const offset: number = c.width + offsetY;
    const remain: number = Math.abs(Math.floor(offsetY / this.parentScale));
    const cutoff: number = offset - remain * this.parentScale;

    // Parents - positive
    let scaleCount: number = 0;
    for (let i = cutoff; i < c.height; i += this.parentScale) {
      this._printVerticalParent(c, i, remain, scaleCount);
      scaleCount++;
    }
    // Parents - negative
    scaleCount = 0;
    for (let i = cutoff; i > 0; i -= this.parentScale) {
      this._printVerticalParent(c, i, remain, scaleCount);
      scaleCount++;
    }

    // Children - positive
    for (let i = cutoff; i < c.height; i += this.parentScale / this.childScale) {
      this._printVerticalChild(c, i);
    }
    // Children - negative
    for (let i = cutoff; i > 0; i -= this.parentScale / this.childScale) {
      this._printVerticalChild(c, i);
    }

    // Empty box
    this._printVerticalEmptyBox(c);
  }

  _fillTextLine(ctx: CanvasRenderingContext2D, text: string, x: number, y: number): void {
    const resY = y + 10;
    ctx.fillText(text.toString(), x, resY);
  }
}
