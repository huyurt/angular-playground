import { Component, Input, OnInit } from '@angular/core';

@Component({
  templateUrl: './dynamic-component.component.html',
  styleUrls: ['./dynamic-component.component.css'],
})
export class DynamicComponentComponent implements OnInit {

  @Input() content: string = '';
  @Input() dropPoint: { x: number, y: number } = {x: 0, y: 0};

  constructor() {
  }

  ngOnInit(): void {
  }

}
