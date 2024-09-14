import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TokenJwt } from '../model/TokenJwt';
import { Token } from '../model/Token';
import { CardService } from './card.service';
import { UserResponse } from '../model/UserResponse';
import { EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  tokenJwt: string;
  tokenOAuth: string = "";

  urlsecurityserver: string = environment.securityserver;
  urlresourceserver: string = environment.resourceserver;
  securitypath: string = environment.securitypath;
  login: string = environment.login;

  constructor(private http: HttpClient, private card: CardService) {

  }

  logout(): void {
    localStorage.removeItem('tokenJwt');
    localStorage.removeItem('tokenOAuth');
    localStorage.removeItem('oauthProvider');
    localStorage.removeItem('tokenRefresh');
    localStorage.removeItem('expires');
    this.card.token = '';
  }

  isLogged(): boolean {

    let g = (localStorage.getItem('tokenJwt') !== null && localStorage.getItem('tokenJwt').length > 0) ||
      (localStorage.getItem('tokenOAuth') !== null && localStorage.getItem('tokenOAuth').length > 0);

    return g;
  }

  getRefreshToken(): string | null {

    return localStorage.getItem('tokenRefresh');

  }

  getTokenExpires(): number | null {

    return +localStorage.getItem('expires');

  }

  getOauth2Code(url: string): any {
    return this.http.get(this.urlresourceserver + url);
  }

  getTokenJwt(login: string, password: string): Observable<string | null> {

    const headers = { 'Content-Type': 'application/json' };

    const body = {
      [this.login]: login,
      "password": password
    };

    return this.http.post<any>(this.urlsecurityserver + this.securitypath, body, { headers, observe: "response" },)
      .pipe(map((response: HttpResponse<TokenJwt>) => {
        if (response.status === 200 && response.body !== null) {
          if (response.body.jwt) { this.tokenJwt = response.body.jwt; }
          else { this.tokenJwt = response.body.token; }

          localStorage.setItem('tokenJwt', this.tokenJwt);
          return this.tokenJwt;
        } else {
          return null;
        }
      }));
  }

  getTokenOAuth(codeOrRefreshToken: string, url: string): Observable<boolean> {
    return this.http.get<Token>(this.urlresourceserver + url + codeOrRefreshToken, { observe: "response" })
      .pipe(map((response: HttpResponse<Token>) => {
        if (response.status === 200 && response.body !== null) {
          this.tokenOAuth = response.body.token;
          localStorage.setItem('tokenOAuth', this.tokenOAuth);
          if (response.body.refresh_token) {
            localStorage.setItem('tokenRefresh', response.body.refresh_token);
            let expires = response.body.expires * 1000 + Date.now();
            localStorage.setItem('expires', expires.toString());
          }
          return true;
        } else {
          return false;
        }
      }));
  }

  getUserData(): Observable<UserResponse> {

    let t = localStorage.getItem('tokenJwt');
    let type: string = localStorage.getItem('oauthProvider');

    if (t) {

      return this.http.get<UserResponse>(this.urlresourceserver + '/api/task/fullUser',
        { headers: new HttpHeaders({ "Authorization": "Bearer " + t }) });
    }

    else if (type === 'google') {

      let token = localStorage.getItem('tokenOAuth');

      return this.http.get<UserResponse>(this.urlresourceserver + '/auth/fullUser',
        { headers: new HttpHeaders({ "Authorization": "Bearer " + token }) });

    }

    else if (type === 'github') {

      let token = localStorage.getItem('tokenOAuth');

      return this.http.get<UserResponse>(this.urlresourceserver + '/auth/github/fullUser',
        { headers: new HttpHeaders({ "Authorization": "Bearer " + token }) });

    }
    else {
      return EMPTY;
    }
  }

  register(login: string, password: string, name: string): Observable<any> {

    const headers = { 'Content-Type': 'application/json' };

    const body = {
      "userName": login,
      "password": password,
      "name": name
    };

    return this.http.post<any>(this.urlsecurityserver + '/auth/register', body, { headers, observe: "response" });

  }

}
