
import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UploadService } from '../services/upload.service';


@Component({
  selector: 'app-formdata-upload',
  templateUrl: './formdata-upload.component.html',
  styleUrls: ['./formdata-upload.component.css']
})
export class FormdataUploadComponent implements OnInit {

  ngOnInit() {
  }

  form: FormGroup;
  loading: boolean = false;
  url = '';

  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(private fb: FormBuilder, private  uploadService: UploadService) {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      avatar: null
    });
  }

  onFileChange(event) {

    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      this.form.get('avatar').setValue(file);
    }

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is completed
        this.url = event.target.result;
      }
    }


  }

  private prepareSave(): any {
    let input = new FormData();
    input.append('name', this.form.get('name').value);
    input.append('avatar', this.form.get('avatar').value);
    return input;
  }

  onSubmit() {
    const formModel = this.prepareSave();
    this.loading = true;
    // In a real-world app you'd have a http request / service call here like
    // this.http.post('apiUrl', formModel)

    this.uploadService
      .uploadFile(formModel)
      .subscribe(
        (_) => {
          console.info('ARCHIVO SUBIDO');
        }
      );


    setTimeout(() => {
      // FormData cannot be inspected (see "Key difference"), hence no need to log it here
      alert('done!');
      this.loading = false;
    }, 1000);
  }

  clearFile() {
    this.form.get('avatar').setValue(null);
    this.fileInput.nativeElement.value = '';
  }

}
