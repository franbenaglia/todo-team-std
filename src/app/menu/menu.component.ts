import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router, RouterLink } from '@angular/router';
import { MenuItem, SharedModule } from 'primeng/api';
import { environment } from '../../environments/environment';
import { MenubarModule } from 'primeng/menubar';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.scss',
    standalone: true,
    imports: [MenubarModule, SharedModule, RouterLink]
})
export class MenuComponent {


  urlfrontserver: string = environment.frontserver;


  constructor(
    private auth: AuthenticationService, private router: Router
  ) { }

  userName: String = '';
  email: String = '';
  role: String = '';

  items: MenuItem[] | undefined;

  ngOnInit() {

    this.auth.getUserData().subscribe(user => {
      this.userName = user.username;
      this.email = user.name
      this.role = user.role;
    }
    );

    this.items = [
      { label: 'List', icon: 'pi pi-list', route: '/task-list' },
      { label: 'Carousel', icon: 'pi pi-chevron-circle-down', route: '/carousel' },
      { label: 'Carousel d\'n\'d', icon: 'pi pi-server', route: '/carousel-min' },
      {
        label: 'Logout', icon: 'pi pi-sign-out', command: () => {
          this.logout();
        }
      }
    ];

  }

  logout() {
    this.auth.logout();
    window.location.assign(this.urlfrontserver);
    //window.location.reload();
    //this.router.navigateByUrl('/');
  }

}
