import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { autenticacion } from '../services/Autenticacion/autenticacion';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(autenticacion);
  const router = inject(Router);

  const user = authService.getCurrentUser();
  const allowedRoles: string[] = route.data?.['roles'] ?? [];

  if (!user || !allowedRoles.includes(user.rol?.toUpperCase())) {
    router.navigate(['/']);
    return false;
  }
  return true;
};
