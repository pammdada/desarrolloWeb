import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { autenticacion } from '../../../services/Autenticacion/autenticacion';
import { AdminService } from '../../../services/Admin/adminservice';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit {

  // lista completa de veterinarios obtenidos del backend
  veterinarians: any[] = [];
  // filtro actual: ACTIVO o INACTIVO
  filterStatus: string = 'ACTIVO';
  // controla la visibilidad del modal de registro
  showForm: boolean = false;
  // indica si se estan cargando los datos (muestra spinner)
  loading: boolean = false;
  // id del veterinario que se esta eliminando (activa animacion fade-out)
  deletingId: number | null = null;

  // controla si el modal de formulario opera en modo edicion
  isEditing: boolean = false;
  // id del veterinario que se esta editando
  editingId: number | null = null;
  // visibilidad del modal de detalle
  showDetail: boolean = false;
  // datos del veterinario en el modal de detalle
  detailVet: any = null;
  // indica si se estan cargando los datos del detalle
  loadingDetail: boolean = false;

  // modelo del formulario de registro de veterinario
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
    this.cargarVeterinarios();
  }

  // cantidad de veterinarios con estado distinto a INACTIVO
  get activeCount(): number {
    return this.veterinarians.filter(v => v.estadoVet !== 'INACTIVO').length;
  }

  // cantidad de veterinarios con estado INACTIVO
  get inactiveCount(): number {
    return this.veterinarians.filter(v => v.estadoVet === 'INACTIVO').length;
  }

  // obtiene veterinarios del backend segun el filtro seleccionado
  cargarVeterinarios(): void {
    this.loading = true;
    this.adminService.getVeterinarios(this.filterStatus).subscribe({
      next: (response) => {
        if (response.exito) this.veterinarians = response.datos;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los veterinarios'
        });
      }
    });
  }

  // abre el modal en modo registro
  openCreate(): void {
    this.isEditing = false;
    this.editingId = null;
    this.resetForm();
    this.showForm = true;
  }

  // abre el modal en modo edicion, cargando los datos del veterinario
  openEdit(vet: any): void {
    this.isEditing = true;
    this.editingId = vet.id;
    this.vetForm = {
      correo: vet.correo || '',
      contrasena: '',
      nombre: vet.nombre || '',
      apellidos: vet.apellidos || '',
      especialidad: vet.especialidad || '',
      sueldo: vet.sueldo || 0,
      telefono: vet.telefono || ''
    };
    this.showForm = true;
  }

  servicios(){
    this.router.navigate(['/admin/servicios']);
  }

  // guarda el veterinario: crea o actualiza segun el modo
  saveVet(): void {
    if (this.isEditing) {
      const datos: any = { ...this.vetForm };
      if (!datos.contrasena) {
        delete datos.contrasena;
      }

      this.adminService.updateVeterinario(this.editingId!, datos).subscribe({
        next: (response) => {
          if (response.exito) {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Veterinario actualizado",
              text: "Los datos se guardaron correctamente",
              showConfirmButton: false,
              timer: 2000,
              toast: true
            });
            this.showForm = false;
            this.resetForm();
            this.cargarVeterinarios();
          }
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar el veterinario. Verifique los datos.'
          });
        }
      });
    } else {
      this.adminService.createVeterinario(this.vetForm).subscribe({
        next: (response) => {
          if (response.exito) {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Veterinario registrado",
              text: "El veterinario se creo correctamente",
              showConfirmButton: false,
              timer: 2000,
              toast: true
            });
            this.showForm = false;
            this.resetForm();
            this.cargarVeterinarios();
          }
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo registrar el veterinario. Verifique los datos.'
          });
        }
      });
    }
  }

  // muestra dialogo de confirmacion SweetAlert2 antes de despedir
  confirmFire(vet: any): void {
    Swal.fire({
      title: 'Despedir veterinario?',
      html: `
        <div class="text-left text-sm">
          <p class="mb-2">Se cambiara el estado de <strong>${vet.nombre} ${vet.apellidos}</strong> a inactivo.</p>
          <p class="text-gray-500">Esta accion se puede revertir despues.</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Si, despedir',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.fireVet(vet.id);
      }
    });
  }

  //   // ejecuta el despido: activa animacion, espera 400ms, luego llama al API
  fireVet(id: number): void {
    this.deletingId = id;
    setTimeout(() => {
      this.adminService.fireVeterinario(id).subscribe({
        next: (response) => {
          if (response.exito) {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Veterinario despedido",
              showConfirmButton: false,
              timer: 1500,
              toast: true
            });
            this.deletingId = null;
            this.cargarVeterinarios();
          }
        },
        error: () => {
          this.deletingId = null;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo despedir al veterinario'
          });
        }
      });
    }, 400);
  }

  // abre el modal de detalle con los datos completos del veterinario
  openDetail(vet: any): void {
    this.loadingDetail = true;
    this.showDetail = true;
    this.detailVet = null;
    this.adminService.getVeterinarioById(vet.id).subscribe({
      next: (response) => {
        if (response.exito) {
          this.detailVet = response.datos;
        }
        this.loadingDetail = false;
      },
      error: () => {
        this.loadingDetail = false;
        this.showDetail = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los datos del veterinario'
        });
      }
    });
  }

  // cierra el modal de detalle
  closeDetail(): void {
    this.showDetail = false;
    this.detailVet = null;
  }

  logout() {
      Swal.fire({
        title: "Cerrar sesión",
        text: "Salir del panel de administrador.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "rgb(39, 204, 75)",
        confirmButtonText: "Cerrar sesión",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          this.authService.logout();
        };
      });
    }

  // cierra el modal del formulario y reinicia el estado
  closeForm(): void {
    this.showForm = false;
    this.isEditing = false;
    this.editingId = null;
    this.resetForm();
  }

  // reinicia los valores del formulario a su estado inicial
  resetForm(): void {
    this.vetForm = { correo: '', contrasena: '', nombre: '', apellidos: '', especialidad: '', sueldo: 0, telefono: '' };
  }
}
