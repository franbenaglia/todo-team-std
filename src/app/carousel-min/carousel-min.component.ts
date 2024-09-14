import { Component, ElementRef, ViewChild, ViewChildren } from '@angular/core';
import { Task } from '../model/Task';
import { CardService } from '../services/card.service';
import { FormGroup } from '@angular/forms';
import { PrimeNGConfig, SharedModule } from 'primeng/api';
import { AuthenticationService } from '../services/authentication.service';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from '../model/User';
import { CardMinComponent } from '../card-min/card-min.component';
import { DragDropModule } from 'primeng/dragdrop';
import { CarouselModule } from 'primeng/carousel';
import { SplitterModule } from 'primeng/splitter';
import { ButtonModule } from 'primeng/button';
import { CardComponent } from '../card/card.component';
import { DialogModule } from 'primeng/dialog';
import { NgIf, NgClass } from '@angular/common';

@Component({
    selector: 'app-carousel-min',
    templateUrl: './carousel-min.component.html',
    styleUrl: './carousel-min.component.scss',
    standalone: true,
    imports: [NgIf, DialogModule, CardComponent, ButtonModule, SplitterModule, SharedModule, CarouselModule, NgClass, DragDropModule, CardMinComponent]
})
export class CarouselMinComponent {

  user: String = '';
  users: User[] = [];

  tasks: Task[] = [];

  task: Task;

  initializedTasks: Task[] = [];
  asignedTasks: Task[] = [];
  finishedTasks: Task[] = [];

  draggedTask: Task | undefined | null;

  BasicShow: boolean = false;

  retrievedImage: any;
  retrievedSanitizedImage: any;

  constructor(private auth: AuthenticationService, private cardService: CardService, private primengConfig: PrimeNGConfig, private readonly sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.auth.getUserData().subscribe(user => {
      this.user = user.username;
      this.loadTasks();
      this.loadUsers();
    });

  }

  addTask(form: FormGroup) {
    this.cardService.addOrUpdateTaskWithFile(form).subscribe(task => {
      console.log(task)
      this.loadTasks();
    });
  }

  deleteTask(form: FormGroup) {
    let t: Task = Object.assign(new Task(), form.value);
    this.cardService.deleteTask(t).subscribe(mes => {
      console.log(mes);
      this.loadTasks();
    });
  }

  loadTasks() {

    this.asignedTasks.length = 0;
    this.initializedTasks.length = 0;
    this.finishedTasks.length = 0;

    this.cardService.getTasksByUserAndState(this.user, 'ASSIGNED').subscribe(
      task => {
        this.asignedTasks = task;
        if (this.asignedTasks.length === 0) {
          let task = new Task();
          task.description = 'DROP HERE';
          task.state = 'ASSIGNED';
          this.asignedTasks.push(task);
        };
      });

    this.cardService.getTasksByUserAndState(this.user, 'FINISHED').subscribe(
      task => {
        this.finishedTasks = task;
        if (this.finishedTasks.length === 0) {
          let task = new Task();
          task.description = 'DROP HERE';
          task.state = 'FINISHED';
          this.finishedTasks.push(task);
        };
      });

    this.cardService.getTasksByUserAndState(this.user, 'INITIALIZED').subscribe(
      task => {
        this.initializedTasks = task
        if (this.initializedTasks.length === 0) {
          let task = new Task();
          task.description = 'DROP HERE';
          task.state = 'INITIALIZED';
          this.initializedTasks.push(task);
        };
      });

  };

  loadUsers() {
    this.cardService.getAllUsers().subscribe(users =>
      this.users = users
    );
  }

  showDialog(id: number | null) {
    if (id) {
      this.cardService.getTask(id).subscribe(task => {
        this.task = task;
        this.BasicShow = true;
        this.getImage(id);
      });
    } else {
      this.task = null;
      this.BasicShow = !this.BasicShow;
    }
  }

  getImage(taskId: number) {

    return this.cardService.getTaskImage(taskId).subscribe((src) => {
      let reader = new FileReader();
      reader.addEventListener("load", () => {
        this.retrievedImage = reader.result;
        this.retrievedSanitizedImage = this.sanitizer.bypassSecurityTrustUrl(this.retrievedImage);
        console.log(this.retrievedSanitizedImage);
      }, false);

      if (src) {
        reader.readAsDataURL(src);
        //console.log(src);
      }
    });
  }

  closeModal($event: Boolean) {
    this.showDialog(null);
  }

  dragStart(task: Task) {
    this.draggedTask = task;
  }

  dragEnd() {
    this.draggedTask = null;
  }

  drop(state: string) {

    if (this.draggedTask) {

      if (this.draggedTask.state !== state) {

        this.draggedTask.state = state;

        if (state === 'ASSIGNED') {
          if (this.asignedTasks.length === 1) {
            this.asignedTasks[0].state = 'dropped';
          }
          let temp = [this.draggedTask, ...(this.asignedTasks as Task[])];
          this.asignedTasks = temp.sort(this.orderState);
        }
        if (state === 'FINISHED') {
          if (this.finishedTasks.length === 1) {
            this.finishedTasks[0].state = 'dropped';
          }
          let temp = [this.draggedTask, ...(this.finishedTasks as Task[])];
          this.finishedTasks = temp.sort(this.orderState);
        }
        if (state === 'INITIALIZED') {
          if (this.initializedTasks.length === 1) {
            this.initializedTasks[0].state = 'dropped';
          }
          let temp = [this.draggedTask, ...(this.initializedTasks as Task[])];
          this.initializedTasks = temp.sort(this.orderState);
        }

        this.cardService.changeStateTask(this.draggedTask, state).subscribe({
          next: (v) => {
            console.log(v);
            console.log('UPDATED');
          },
          error: (e) => {
            console.error(e);
            this.loadTasks();
            //SHOW MESSAGE
          },
          complete: () => console.log('')
        });

        this.draggedTask = null;

      }
    }
  }

  private orderState = (a: Task, b: Task) => {

    if ((a.state === 'INITIALIZED' || a.state === 'ASSIGNED' || a.state === 'FINISHED') && b.state === 'dropped') {
      return 1;
    } else {
      return -1;
    }
    //((b.state === 'INITIALIZED' || b.state === 'ASSIGNED' || b.state === 'FINISHED') && a.state === 'dropped') 
    //return 0;
  }


  private findIndex(task: Task) {
    let index = -1;
    for (let i = 0; i < (this.initializedTasks as Task[]).length; i++) {
      if (task.id === (this.initializedTasks as Task[])[i].id) {
        index = i;
        break;
      }
    }
    return index;
  }


}




//this.initializedTasks = this.initializedTasks?.filter(  (val, i) => i != draggedTaskIndex);
//this.initializedTasks = [...(this.initializedTasks as Task[]), this.draggedTask];
//let draggedTaskIndex = this.findIndex(this.draggedTask);
//this.loadTasks();