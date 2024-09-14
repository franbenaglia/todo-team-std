import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const REST_JWT_URL = environment.restJWTUrl;

@Injectable({
  providedIn: 'root'
})
export class UploadApiService { //TODO RENOMBRAR A FILEAPISERVICE

  constructor(
    public http: HttpClient
  ) {

  }

  public uploadFile(formModel: FormData): Observable<null> {

    return this.http
      .post<null>(REST_JWT_URL + '/uploadFile', formModel)
      .pipe(
        map(response => {
          return response;
        })
      )

  }



  public getAllIdImagenes(): Observable<number[]> {

    return this.http
      .get<number[]>(REST_JWT_URL + '/allIdsImagenes')
      .pipe(
        map(response => {
          const ids = <number[]>response;
          return ids;
        })
      )
  }

  public downloadFile(fileId: number): Observable<HttpResponse<Blob>> {
    return this.http.get<HttpResponse<Blob>>(REST_JWT_URL + '/downloadFilex/' + fileId, {
      responseType: 'blob' as 'json'
    });
  }

  public getImageX(imageUrl: string): Observable<Blob> {
    return this.http.get(imageUrl, { responseType: 'blob' });
  }


}
