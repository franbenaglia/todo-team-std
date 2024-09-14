import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../model/Task';

@Component({
    selector: 'app-card-drag',
    templateUrl: './card-drag.component.html',
    styleUrl: './card-drag.component.scss',
    standalone: true
})
export class CardDragComponent implements OnInit {

  @Input() task: Task;

  description: String;

  constructor() {
  }

  ngOnInit(): void {
    if (this.task) {
      this.description = this.task.description;
    }

  }

}

