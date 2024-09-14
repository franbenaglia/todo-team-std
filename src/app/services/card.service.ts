import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, mergeMap, iif, of } from 'rxjs';
import { Task } from '../model/Task';
import { User } from '../model/User';
import { FormGroup } from '@angular/forms';
import { TaskResponse } from '../model/TaskResponse';
import { environment } from '../../environments/environment';
import { AuthenticationService } from './authentication.service';
import { UserResponse } from '../model/UserResponse';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  urlresourceserver: string = environment.resourceserver;

  baseURL: string = this.urlresourceserver + "/api/task/";
  baseURLImage: string = this.urlresourceserver + "/api/task/files/";
  token: string = '';

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('tokenJwt') ||
      localStorage.getItem('tokenOAuth');
  }

  getTasksByUser(user: User): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseURL + 'tasks/' + user.id);
  }

  getTasks(): Observable<Task[]> {
    let t = this.token;
    return this.http.get<Task[]>(this.baseURL + 'tasks',
      { headers: new HttpHeaders({ "Authorization": "Bearer " + t }) });
  }

  //TODO add change java version and uncomment url version
  getTasksPaginated(first: number, rows: number, order: string | string[], direction: number): Observable<TaskResponse> {
    let page: number = first / rows;
    let t = this.token;
    let url = this.baseURL + 'tasks/' + page + '/' + rows;
    if (order) {
      let dir = direction === 1 ? 'ASC' : 'DESC';
      url = this.baseURL + 'tasks/' + page + '/' + rows + '/' + order + '/' + dir;
    }
    //return this.http.get<TaskResponse>(url,
    //  { headers: new HttpHeaders({ "Authorization": "Bearer " + t }) });
    return this.http.get<TaskResponse>(this.baseURL + 'tasks/' + page + '/' + rows,
      { headers: new HttpHeaders({ "Authorization": "Bearer " + t }) });
  }

  getTask(id: number): Observable<Task> {
    let t = this.token;
    return this.http.get<Task>(this.baseURL + 'task/' + id,
      { headers: new HttpHeaders({ "Authorization": "Bearer " + t }) });
  }

  deleteTask(task: Task): Observable<any> {
    const body = JSON.stringify(task);
    let t = this.token;
    return this.http.delete(`${this.baseURL + 'task'}/${task.id}`,
      { headers: new HttpHeaders({ "Authorization": "Bearer " + t }), responseType: 'text' });
  }

  private prepareSave(form: FormGroup): any {
    let input = new FormData();
    //input.append('id', !form.get('id') ? form.get('id').value : null);
    input.append('title', form.get('title').value);
    input.append('dir', form.get('dir').value);
    input.append('description', form.get('description').value);
    input.append('avatar', form.get('avatar').value);
    input.append('user', form.get('user').value);
    return input;
  }

  getTaskImage(taskId: number): Observable<any> {
    let t = this.token;
    return this.http.get(this.baseURLImage + 'downloadImageAsResourceByIdTask/' + taskId,
      {
        headers: new HttpHeaders(
          {
            "Content-Type": "application/octet-stream",
            "Authorization": "Bearer " + t

          }
        ),
        responseType: "blob"
      });

  }

  getTasksByUserAndState(user: String, state: String): Observable<Task[]> {
    let t = this.token;
    return this.http.get<Task[]>(this.baseURL + 'tasksByState/' + state + '/' + user,
      { headers: new HttpHeaders({ "Authorization": "Bearer " + t }) });
  }

  changeStateTask(task: Task, state: string): Observable<Task> {

    let tk = this.token;

    const headers: HttpHeaders = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Access-Control-Allow-Headers', '*')
      .append('Access-Control-Allow-Methods', '*')
      .append('Access-Control-Allow-Origin', '*')
      .append('Authorization', 'Bearer ' + tk);

    task.state = state;

    const body = JSON.stringify(task);

    return this.http.put<Task>(this.baseURL + 'task', body,
      { headers: headers });

  }


  getAllUsers(): Observable<UserResponse[]> {

    let t = this.token;
    return this.http.get<UserResponse[]>(this.baseURL + 'allUsers',
      { headers: new HttpHeaders({ "Authorization": "Bearer " + t }) });
  }


  addOrUpdateTaskWithFile(form: FormGroup): Observable<any> {

    let t: Task = Object.assign(new Task(), form.value);
    if (!t.state) {
      t.state = 'INITIALIZED';
    }
    let tk = this.token;
    const formModel = this.prepareSave(form);

    const headers: HttpHeaders = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Access-Control-Allow-Headers', '*')
      .append('Access-Control-Allow-Methods', '*')
      .append('Access-Control-Allow-Origin', '*')
      .append('Authorization', 'Bearer ' + tk);

    const headersImage: HttpHeaders = new HttpHeaders()
      .append('Access-Control-Allow-Headers', '*')
      .append('Access-Control-Allow-Methods', '*')
      .append('Access-Control-Allow-Origin', '*')
      .append('Authorization', 'Bearer ' + tk);


    const body = JSON.stringify(t);

    const post = this.http.post<any>(this.baseURL + 'task', body,
      { headers: headers });

    const postImage = this.http.post(this.baseURLImage + 'taskImage', formModel,
      { headers: headersImage });

    //const postImage = this.http.post(this.urlresourceserver + '/upload', formModel,
    //  { headers: headersImage });

    const put = this.http.put(this.baseURL + 'task', body,
      { headers: headers });

    //server is delete and insert or just insert
    const putImage = this.http.put(this.baseURLImage + 'taskImage', formModel,
      { headers: headersImage });


    if (!form.get('id').value) {
      return post.pipe(
        mergeMap(task => {
          formModel.append('id', task.id);
          if (form.get('avatar').value) {
            return postImage;
          } else {
            return of(null);
          }
        }),
        catchError(err => {
          console.log(err);
          return err;
        }
        ));
    } else {

      return put.pipe(
        mergeMap(task => {
          if (form.get('avatar').value) {
            return putImage;
          } else {
            return of(null);
          }
        }),
        catchError(err => {
          console.log(err);
          return err;
        }
        ));

    }
  }

}