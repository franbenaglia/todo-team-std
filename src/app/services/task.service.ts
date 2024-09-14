import { Injectable } from '@angular/core';
import { Task } from '../model/Task';
import { CardService } from './card.service';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
//ver si delegar o no no parece muy util
@Injectable({
    providedIn: 'root'
})
export class TaskService {

    constructor(private cardService: CardService) { }

    loadTask(): Observable<Task[]> {
        return this.cardService.getTasks();
    };

    addTask(form: FormGroup): Observable<any> {
        let t: Task = Object.assign(new Task(), form.value);
        return this.cardService.addOrUpdateTask(t)
    }

    deleteTask(form: FormGroup) {
        let t: Task = Object.assign(new Task(), form.value);
        this.cardService.deleteTask(t).subscribe(mes => {
        });
    }

}
