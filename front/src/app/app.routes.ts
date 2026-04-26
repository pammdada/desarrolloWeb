import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Admin } from './components/admin/admin';
import { Veterinario } from './components/veterinario/veterinario';
import { Cliente } from './components/cliente/cliente';
import { Home } from './components/home/home';
import { Registro } from './components/registro/registro';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro},
  { path: 'admin', component: Admin },
  { path: 'cliente', component: Cliente },
  { path: 'veterinario', component: Veterinario },
  { path: '**', redirectTo: '' }
];
