import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Footer } from "./components/footer/footer";
import { Sidebar } from "./components/sidebar/sidebar";
import { autenticacion } from './services/Autenticacion/autenticacion';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Sidebar],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  protected readonly showSidebar = signal(false);
  private subs: Subscription[] = [];
  private publicRoutes = ['/', '/login', '/registro', '/verificar-token'];

  constructor(
    private router: Router,
    private authService: autenticacion
  ) {}

  ngOnInit(): void {
    this.subs.push(
      this.authService.currentUser$.subscribe(() => {
        this.updateSidebar();
      })
    );
    this.subs.push(
      this.router.events
        .pipe(filter((e) => e instanceof NavigationEnd))
        .subscribe(() => {
          this.updateSidebar();
        })
    );
  }

  private updateSidebar(): void {
    const user = this.authService.getCurrentUser();
    const url = this.router.url.split('?')[0];
    const isPublic = this.publicRoutes.includes(url);
    this.showSidebar.set(!!user && !isPublic);
  }

  protected isAuthenticated(): boolean {
    return !!this.authService.getCurrentUser();
  }

  protected isPublicRoute(): boolean {
    const url = this.router.url.split('?')[0];
    return this.publicRoutes.includes(url);
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
