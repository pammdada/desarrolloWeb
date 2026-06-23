import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Admin } from './components/admin/admin';
import { Veterinario } from './components/veterinario/veterinario';
import { Cliente } from './components/cliente/cliente';
import { Home } from './components/home/home';
import { Registro } from './components/registro/registro';
import { AgendarCita } from './components/agendar-cita/agendar-cita';
import { RegistrarMascota } from './components/registrar-mascota/registrar-mascota';
import { VerificarToken } from './components/verificar-token/verificar-token';
import { Perfil } from './components/perfil/perfil';
import { Servicios } from './components/servicios/servicios';
import { Pagos } from './components/pagos/pagos';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'verificar-token', component: VerificarToken },
  {
    path: 'admin',
    component: Admin,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'admin/servicios',
    component: Servicios,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'cliente',
    component: Cliente,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['CLIENTE'] }
  },
  {
    path: 'veterinario',
    component: Veterinario,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['VETERINARIO'] }
  },
  {
    path: 'agendar-cita',
    component: AgendarCita,
    canActivate: [authGuard]
  },
  {
    path: 'registrar-mascota',
    component: RegistrarMascota,
    canActivate: [authGuard]
  },
  {
    path: 'perfil',
    component: Perfil,
    canActivate: [authGuard]
  },
  {
    path: 'pagos',
    component: Pagos,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' }
];
