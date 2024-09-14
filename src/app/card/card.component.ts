import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Task } from '../model/Task';
import { User } from '../model/User';
import { ButtonModule } from 'primeng/button';
import { NgIf } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.css'],
    standalone: true,
    imports: [ReactiveFormsModule, InputTextareaModule, DropdownModule, NgIf, ButtonModule]
})
export class CardComponent implements OnInit {

  @Input() task: Task;

  @Input() image: any;

  renderImage: boolean = false;

  @Input() users: User[] | undefined;

  @Input() isButtonVisible: Boolean;

  @Output() newCardEvent = new EventEmitter<FormGroup>;

  @Output() closeEvent = new EventEmitter<Boolean>;

  @Output() deleteEvent = new EventEmitter<FormGroup>;

  @ViewChild('fileInput') fileInput: ElementRef;

  placeHolder: string;

  user: User = new User();

  states: any[] = [{ state: 'INITIALIZED' }, { state: 'ASSIGNED' }, { state: 'FINISHED' }];

  state: string;

  title: String;

  url: String = '';

  constructor() {
  }

  ngOnInit(): void {
    if (this.task) {
      this.clearFile();
      this.loadTask();
      this.user = this.task.user;
      this.placeHolder = this.user ? 'Change User' : 'Select user';
      this.title = this.task.title;
    }
  }

  form = new FormGroup({
    "id": new FormControl(),
    "title": new FormControl("", Validators.required),
    "dir": new FormControl("", Validators.required),
    "description": new FormControl("", Validators.required),
    avatar: new FormControl(""),
    "user": new FormControl<User | null>(null),
    "state": new FormControl("", Validators.required),
    //"user": new FormGroup(
    //  {
    //    id: new FormControl(),
    //    "name": new FormControl("name", Validators.required)
    //  })
  });


  onSubmit() {
    
    let state = this.form.get('state').value as any;
    //let state = JSON.parse(statestr);
    this.form.controls['state'].setValue(state.state);

    this.newCardEvent.emit(this.form);
    this.closeEvent.emit(true);
  }

  delete($event: MouseEvent) {
    this.deleteEvent.emit(this.form);
    this.closeEvent.emit(true);
  }

  closeModal($event: MouseEvent) {
    this.task = null;
    this.closeEvent.emit(true);
  }

  loadTask() {
    this.form.patchValue({
      id: this.task.id,
      title: this.task.title,
      dir: this.task.dir,
      description: this.task.description,
      user: this.task.user,
      state: this.task.state
    });
  }

  keyPress($event: KeyboardEvent) {
    this.isButtonVisible = true;
  }

  onFileChange(event) {
    console.log('laimagen: ');
    console.log(this.image);
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      this.form.get('avatar').setValue(file);
    }

  }

  clearFile() {
    this.form.get('avatar').setValue(null);
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }


}