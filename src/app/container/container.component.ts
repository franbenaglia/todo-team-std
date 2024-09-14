import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { LoginComponent } from '../login/login.component';
import { MenuComponent } from '../menu/menu.component';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-container',
    templateUrl: './container.component.html',
    styleUrl: './container.component.scss',
    standalone: true,
    imports: [NgIf, MenuComponent, LoginComponent]
})
export class ContainerComponent {

  menuVisible :boolean = false;
  
  constructor(private auth : AuthenticationService) { }

  ngOnInit() {
      this.menuVisible = this.auth.isLogged();
  }

}
