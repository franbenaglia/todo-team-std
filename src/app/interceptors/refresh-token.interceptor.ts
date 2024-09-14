import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {

  constructor(private auth: AuthenticationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from the service.

    if (this.auth.getTokenExpires()) {

      const refreshToken = this.auth.getRefreshToken();

      // Clone the request and replace the original headers with
      // cloned headers, updated with the authorization.
     // const authReq = req.clone({
      //  headers: req.headers.set('Authorization', refr//});

      const authReq = req.clone();

      // send cloned request with header to the next handler.
      return next.handle(authReq);

    }

    return next.handle(req);
  }
}