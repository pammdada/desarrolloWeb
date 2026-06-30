import { Routes } from '@angular/router';
import { Login } from './components/generales/login/login';
import { Admin } from './components/admin/admin/admin';
import { Veterinario } from './components/veterinario/veterinario/veterinario';
import { Cliente } from './components/cliente/cliente/cliente';
import { Home } from './components/generales/home/home';
import { Registro } from './components/generales/registro/registro';
import { AgendarCita } from './components/generales/agendar-cita/agendar-cita';
import { RegistrarMascota } from './components/generales/registrar-mascota/registrar-mascota';
import { VerificarToken } from './components/generales/verificar-token/verificar-token';
import { Perfil } from './components/generales/perfil/perfil';
import { Servicios } from './components/admin/servicios/servicios';
import { Pagos } from './components/generales/pagos/pagos';
import { ListadoMascotas } from './components/cliente/listado-mascotas/listado-mascotas';
import { ComprasPrevias } from './components/cliente/compras-previas/compras-previas';
import { ListaClientes } from './components/admin/lista-clientes/lista-clientes';
import { HistorialMascotas } from './components/veterinario/historial-mascotas/historial-mascotas';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { MisCitas } from './components/cliente/mis-citas/mis-citas';

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
  {
    path: 'cliente/mis-citas',
    component: MisCitas,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['CLIENTE'] }
  },
  { path: '**', redirectTo: '' }
];
