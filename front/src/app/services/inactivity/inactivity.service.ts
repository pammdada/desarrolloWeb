import { Injectable, OnDestroy, NgZone } from '@angular/core';
import { fromEvent, merge, Subject, timer } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { autenticacion } from '../Autenticacion/autenticacion';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class InactivityService implements OnDestroy {
  private readonly INACTIVITY_LIMIT = 30 * 60 * 1000;
  private activity$ = new Subject<void>();
  private destroy$ = new Subject<void>();
  private monitoring = false;

  constructor(
    private authService: autenticacion,
    private ngZone: NgZone
  ) {}

  startMonitoring(): void {
    if (this.monitoring) return;
    this.monitoring = true;

    this.ngZone.runOutsideAngular(() => {
      const events$ = merge(
        fromEvent(window, 'mousemove'),
        fromEvent(window, 'keydown'),
        fromEvent(window, 'click'),
        fromEvent(window, 'scroll'),
        fromEvent(window, 'touchstart')
      );

      events$
        .pipe(
          debounceTime(500),
          takeUntil(this.destroy$)
        )
        .subscribe(() => this.activity$.next());

      this.activity$
        .pipe(
          switchMap(() => timer(this.INACTIVITY_LIMIT)),
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          this.ngZone.run(() => this.onInactivity());
        });

      // Start the first timer immediately
      this.activity$.next();
    });
  }

  stopMonitoring(): void {
    this.monitoring = false;
    this.destroy$.next();
  }

  private onInactivity(): void {
    this.stopMonitoring();
    Swal.fire({
      icon: 'info',
      title: 'Sesión expirada',
      text: 'Tu sesión ha expirado por inactividad.',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#3085d6'
    }).then(() => {
      this.authService.logout();
    });
  }

  ngOnDestroy(): void {
    this.stopMonitoring();
  }
}
