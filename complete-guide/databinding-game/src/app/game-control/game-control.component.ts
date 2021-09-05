import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-game-control',
  templateUrl: './game-control.component.html',
  styleUrls: ['./game-control.component.css']
})
export class GameControlComponent implements OnInit {
  @Output() number = new EventEmitter<number>();
  interval: any;
  counter = 1;

  constructor() {
  }

  ngOnInit(): void {
  }

  onStartGame() {
    this.interval = setInterval(() => {
      this.number.emit(this.counter++);
    }, 1000);
  }

  onPauseGame() {
    clearInterval(this.interval);
  }
}
