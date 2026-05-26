import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { autenticacion } from '../../services/Autenticacion/autenticacion';
import { AdminService } from '../../services/Admin/adminservice';


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit {
  
  veterinarians: any[] = [];
  filterStatus: string = 'ACTIVO';
  showForm: boolean = false;
  
  vetForm = {
    correo: '',
    contrasena: '',
    nombre: '',
    apellidos: '',
    especialidad: '',
    sueldo: 0,
    telefono: ''
  };
  
  constructor(
    private adminService: AdminService,
    private authService: autenticacion,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    // ====== VERIFICACION SIMPLE CON IF ======
    const user = this.authService.getCurrentUser();
    
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    
    const rol = user.rol.toUpperCase();
    if (rol !== 'ADMIN') {
      if (rol === 'VETERINARIO') this.router.navigate(['/vet']);
      else if (rol === 'CLIENTE') this.router.navigate(['/client']);
      else this.router.navigate(['/login']);
      return;
    }
    // =========================================
    
    this.cargarVeterinarios();
  }
  
  cargarVeterinarios(): void {
    this.adminService.getVeterinarios(this.filterStatus).subscribe({
      next: (response) => {
        if (response.exito) this.veterinarians = response.datos;
      }
    });
  }
  
  createVet(): void {
    this.adminService.createVeterinario(this.vetForm).subscribe({
      next: (response) => {
        if (response.exito) {
          this.showForm = false;
          this.resetForm();
          this.cargarVeterinarios();
        }
      }
    });
  }
  
  fireVet(id: number): void {
    if (confirm('¿Despedir veterinario?')) {
      this.adminService.fireVeterinario(id).subscribe(() => this.cargarVeterinarios());
    }
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  
  resetForm(): void {
    this.vetForm = { correo: '', contrasena: '', nombre: '', apellidos: '', especialidad: '', sueldo: 0, telefono: '' };
  }
}