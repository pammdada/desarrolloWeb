import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { autenticacion } from '../services/Autenticacion/autenticacion';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(autenticacion);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        const skipRedirect = req.headers.get('X-Skip-Auth-Redirect');
        if (skipRedirect === 'true') {
          authService.clearSession();
        } else {
          authService.logout();
          router.navigate(['/login']);
        }
      } else if (error.status === 403) {
        router.navigate(['/']);
      }
      return throwError(() => error);
    })
  );
};
