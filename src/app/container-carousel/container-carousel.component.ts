import { Component } from '@angular/core';
import { Task } from '../model/Task';
import { CardService } from '../services/card.service';
import { FormGroup } from '@angular/forms';
import { PrimeNGConfig, SharedModule } from 'primeng/api';
import { User } from '../model/User';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { CardComponent } from '../card/card.component';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-container-carousel',
    templateUrl: './container-carousel.component.html',
    styleUrl: './container-carousel.component.scss',
    standalone: true,
    imports: [DialogModule, CardComponent, ButtonModule, CarouselModule, SharedModule]
})
export class ContainerCarouselComponent {

  //TODO LLEVAR LA LOGICA DEL CRUD A CONTAINER COMPONENT
  tasks: Task[] = [];
  users: User[] = [];
  user: String = '';

  BasicShow: boolean = false;

  constructor(private cardService: CardService, private primengConfig: PrimeNGConfig) { }

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.loadTasks();
    this.loadUsers();

  }

  loadUsers() {
    this.cardService.getAllUsers().subscribe(users =>
      this.users = users
    );
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
    this.tasks.length = 0;
    this.cardService.getTasks().subscribe(
      task => this.tasks = task
    );
  };

  showDialog() {
    this.BasicShow = !this.BasicShow;
  }

  closeModal($event: Boolean) {
    this.showDialog();
  }

}




