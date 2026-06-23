import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { autenticacion } from '../services/Autenticacion/autenticacion';

export const authGuard: CanActivateFn = () => {
  const authService = inject(autenticacion);
  const router = inject(Router);

  const user = authService.getCurrentUser();
  if (!user) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
