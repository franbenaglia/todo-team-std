import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map } from 'rxjs';



export const AuthGuard: CanActivateFn = (
  route,
  state
) => {
  //const loginService = inject(LoginService);
  //const router = inject(Router);

  /*
  return loginService.isLogged().pipe(
    map((res) => true),
    catchError((err) => {
      console.log('redireccion no logueado' + err);
      return router.navigate(['/login']);
    })
  );

  */

   return true;

};