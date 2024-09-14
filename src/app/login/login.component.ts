import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { RegisterComponent } from '../register/register.component';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { NgIf } from '@angular/common';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule,
        DividerModule,
        RegisterComponent,
    ],
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  isLoggedin: boolean = false;

  urlGoogleCode: string = "";
  urlGithubCode: string = "";

  email: string = "usuario1";
  password: string = "password1";
  registration: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit() {

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.auth.getOauth2Code("/auth/url").subscribe((data: any) => {
      this.urlGoogleCode = data.authURL;
    });

    this.auth.getOauth2Code("/auth/github/url").subscribe((data: any) => {
      this.urlGithubCode = data.authURL;
    });

  }

  setOauth2Provider(provider: string) {
    localStorage.setItem('oauthProvider', provider);
  }

  loginWithCustomJwt() {

    let mail: string = this.loginForm.get('email').value;
    let password: string = this.loginForm.get('password').value;

    this.auth.getTokenJwt(mail, password).
      subscribe((tokenJwt: string | null) => {
        console.log(tokenJwt);
        window.location.reload();// window.location.assign(this.urllocalserver); AGREGAR ESTO
      }
      )
  }

  register(): void {
    this.registration = true;
  }

}
