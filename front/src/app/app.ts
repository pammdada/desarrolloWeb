import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Footer } from "./components/generales/footer/footer";
import { Sidebar } from "./components/generales/sidebar/sidebar";
import { Navbar } from "./components/generales/navbar/navbar";
import { autenticacion } from './services/Autenticacion/autenticacion';
import { InactivityService } from './services/inactivity/inactivity.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Sidebar, Navbar],
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
    private authService: autenticacion,
    private inactivityService: InactivityService
  ) {}

  ngOnInit(): void {
    this.subs.push(
      this.authService.currentUser$.subscribe((user) => {
        this.updateSidebar();
        if (user) {
          this.inactivityService.startMonitoring();
        } else {
          this.inactivityService.stopMonitoring();
        }
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
