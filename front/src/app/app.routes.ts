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
import { ListadoMascotas } from './components/listado-mascotas/listado-mascotas';
import { ComprasPrevias } from './components/compras-previas/compras-previas';
import { ListaClientes } from './components/lista-clientes/lista-clientes';
import { HistorialMascotas } from './components/historial-mascotas/historial-mascotas';
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
    path: 'admin/clientes',
    component: ListaClientes,
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
    path: 'cliente/mascotas',
    component: ListadoMascotas,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['CLIENTE'] }
  },
  {
    path: 'cliente/compras',
    component: ComprasPrevias,
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
    path: 'veterinario/historial',
    component: HistorialMascotas,
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
