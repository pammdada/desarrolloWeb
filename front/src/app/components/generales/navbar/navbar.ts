import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { autenticacion } from '../../../services/Autenticacion/autenticacion';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {
  protected readonly user = signal<any>(null);
  protected readonly mobileMenuOpen = signal(false);
  protected readonly activeSection = signal('');
  private observer: IntersectionObserver | null = null;
  private sub: Subscription;

  constructor(private authService: autenticacion) {
    this.sub = this.authService.currentUser$.subscribe((u) => {
      this.user.set(u);
    });
  }

  ngOnInit(): void {
    ['nosotros', 'servicios', 'personal'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        if (!this.observer) {
          this.observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  this.activeSection.set(entry.target.id);
                }
              });
            },
            { threshold: 0.5 }
          );
        }
        this.observer.observe(el);
      }
    });
  }

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
  }

  protected getDashboardRoute(): string {
    const rol = this.user()?.rol?.toUpperCase();
    if (rol === 'ADMIN') return '/admin';
    if (rol === 'VETERINARIO') return '/veterinario';
    if (rol === 'CLIENTE') return '/cliente';
    return '/';
  }

  protected getUserInitials(): string {
    const u = this.user();
    if (!u) return '?';
    return (u.nombre?.charAt(0) || '') + (u.apellidos?.charAt(0) || '');
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.sub.unsubscribe();
  }
}
