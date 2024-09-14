import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';

import { interval, Subscription } from 'rxjs';
import { ContainerComponent } from './container/container.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    standalone: true,
    imports: [ContainerComponent, RouterOutlet]
})
export class AppComponent {

  title = 'todo-team';

  subscription: Subscription;

  constructor(
    private auth: AuthenticationService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    let url: string = '';
    let provider: string = localStorage.getItem('oauthProvider');

    if (provider) {
      if (provider === 'google') {
        url = '/auth/callback?code=';
      }
      if (provider === 'github') {
        url = '/auth/github/callback?code=';
      }
    }

    this.route.queryParams
      .subscribe(params => {
        if (params["code"] !== undefined) {
          this.auth.getTokenOAuth(params["code"], url).subscribe(result => {
            console.log('OAuth' + result);
            window.location.reload();
          });
        }
      }
      );

    const source = interval(60000); //60 secs

    this.subscription = source.subscribe(val => {

      console.log('el val es: ' + val);

      let refreshToken: string = localStorage.getItem('tokenRefresh');

      if (refreshToken) {

        let expires = +localStorage.getItem('expires') - 120000;
        let now = Date.now();
        if (true) {  //expires<now)
          this.auth.getTokenOAuth(refreshToken, '/auth/refresh?refreshToken=').subscribe(ok => console.log(ok));
        }
      }
    }
    );


  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    //localStorage.removeItem('tokenJwt');
    //localStorage.removeItem('tokenOAuth');
  }

  @HostListener('window:beforeunload')
  async ngOnDestroy() {

    //localStorage.removeItem('tokenJwt');
    //localStorage.removeItem('tokenOAuth');
    this.subscription.unsubscribe();

  }

}