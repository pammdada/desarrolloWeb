import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { autenticacion } from '../../services/Autenticacion/autenticacion';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  protected readonly isExpanded = signal(true);
  protected readonly isHidden = signal(false);
  protected readonly user = signal<any>(null);

  protected readonly userName = computed(() => this.user()?.nombre ?? '');
  protected readonly userRole = computed(() => {
    const rol = this.user()?.rol ?? '';
    const map: Record<string, string> = {
      ADMIN: 'Administrador',
      VETERINARIO: 'Veterinario',
      CLIENTE: 'Cliente',
    };
    return map[rol.toUpperCase()] || rol;
  });

  protected readonly userInitials = computed(() => {
    const u = this.user();
    if (!u) return '?';
    const nombre = u.nombre || '';
    const apellidos = u.apellidos || '';
    return (nombre.charAt(0) + apellidos.charAt(0)).toUpperCase() || '?';
  });

  protected sections = computed<NavSection[]>(() => {
    const rol = this.user()?.rol?.toUpperCase() ?? '';
    switch (rol) {
      case 'ADMIN':
        return [
          {
            label: 'Operaciones',
            items: [
              { label: 'Dashboard', route: '/admin', icon: 'chart' },
              { label: 'Clientes', route: '/admin/clientes', icon: 'group' },
              { label: 'Servicios', route: '/admin/servicios', icon: 'tools' },
            ],
          },
          {
            label: 'Configuración',
            items: [
              { label: 'Perfil', route: '/perfil', icon: 'user' },
            ],
          },
        ];
      case 'VETERINARIO':
        return [
          {
            label: 'Operaciones',
            items: [
              { label: 'Citas asignadas', route: '/veterinario', icon: 'calendar' },
              { label: 'Citas en cola', route: '/veterinario', icon: 'inbox' },
              { label: 'Historial mascotas', route: '/veterinario/historial', icon: 'history' },
            ],
          },
          {
            label: 'Configuración',
            items: [
              { label: 'Perfil', route: '/perfil', icon: 'user' },
            ],
          },
        ];
      case 'CLIENTE':
        return [
          {
            label: 'Operaciones',
            items: [
              { label: 'Landing Page', route: '/', icon: 'home' },
              {
                label: 'Mascotas',
                route: '/cliente/mascotas',
                icon: 'paw',
              },
              { label: 'Agendar cita', route: '/agendar-cita', icon: 'calendar' },
            ],
          },
          {
            label: 'Configuración',
            items: [
              { label: 'Perfil', route: '/perfil', icon: 'user' },
              { label: 'Compras previas', route: '/cliente/compras', icon: 'cart' },
            ],
          },
        ];
      default:
        return [];
    }
  });

  protected readonly sidebarWidth = computed(() => {
    if (this.isHidden()) return 'w-0';
    return this.isExpanded() ? 'w-60' : 'w-16';
  });

  constructor(private authService: autenticacion) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.user.set(user);
    });
  }

  protected toggleExpand(): void {
    if (this.isHidden()) return;
    this.isExpanded.update((v) => !v);
  }

  protected toggleFocus(): void {
    this.isHidden.update((v) => !v);
  }

  protected logout(): void {
    this.authService.logoutFront();
  }

  protected getSvg(icon: string): string {
    const icons: Record<string, string> = {
      home: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg>`,
      chart: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 3H12v8.5l5.5 3.5L13.5 3Z"/></svg>`,
      group: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"/></svg>`,
      tools: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.636m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.087 4.113"/></svg>`,
      user: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21c-2.676 0-5.216-.584-7.499-1.882Z"/></svg>`,
      calendar: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"/></svg>`,
      inbox: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3"/></svg>`,
      history: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>`,
      paw: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5 0H7.5a2.25 2.25 0 0 1-2.25-2.25V6.108c0-1.135.845-2.098 1.976-2.192.374-.03.748-.057 1.124-.08m0 0a.75.75 0 0 1 .75.75v.75M12 12v.008M12 15v.008M15 12v.008M15 15v.008M9 12v.008M9 15v.008"/></svg>`,
      cart: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm9.75 0a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5M7.5 14.25h9.75M7.5 14.25l-1.444-4.886m0 0L4.227 4.5H2.25M6.056 9.75h11.888a.75.75 0 0 1 .721.521l1.286 4.5a.75.75 0 0 1-.72.979H7.5"/></svg>`,
    };
    return icons[icon] || icons['home'];
  }
}
