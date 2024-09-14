import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { UploadApiService } from './uploadApi.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService { //TODO RENOMBRAR A FILESERVICE

  constructor(private api: UploadApiService) {
  }

  uploadFile(formModel: FormData): Observable<null> {
    return this.api.uploadFile(formModel);
  }

  getAllIdImagenes(): Observable<number[]> {
    return this.api.getAllIdImagenes();
  }

  downloadFile(fileId : number): Observable<HttpResponse<Blob>>{
       return this.downloadFile(fileId);
  }

  getImage(imageUrl: string): Observable<Blob> {
    return  this.api.getImageX(imageUrl);
  }

}
