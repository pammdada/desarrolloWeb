import { Injectable, Injector } from '@angular/core';
import { autenticacion } from '../Autenticacion/autenticacion';

@Injectable({ providedIn: 'root' })
export class SessionValidatorService {
  constructor(private authService: autenticacion) {}

  validateSession(): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.authService.validateCurrentSession().subscribe({
        next: () => resolve(),
        error: () => {
          this.authService.clearSession();
          resolve();
        }
      });
    });
  }
}
