import { Component, OnInit } from '@angular/core';
import { ServicioService, Servicio } from '../../services/Servicios/servicios'; 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-servicios',
  templateUrl: './admin-servicios.component.html'
})
export class AdminServiciosComponent implements OnInit {
  servicios: Servicio[] = [];
  loading: boolean = false;

  nuevoServicio: Servicio = {
    nombre: '',
    descripcion: '',
    precio: null
  };

  constructor(private servicioService: ServicioService) {}

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios(): void {
    this.loading = true;
    this.servicioService.listarServicios().subscribe({
      next: (response) => {
        if (response.exito) {
          this.servicios = response.datos;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'No se pudieron cargar los servicios', 'error');
      }
    });
  }

  registrarServicio(): void {
    if (!this.nuevoServicio.nombre || !this.nuevoServicio.precio) {
      Swal.fire('Atención', 'Nombre y Precio son campos obligatorios', 'warning');
      return;
    }

    this.servicioService.crearServicio(this.nuevoServicio).subscribe({
      next: (response) => {
        if (response.exito) {
          Swal.fire('¡Éxito!', 'Servicio agregado correctamente', 'success');
          this.cargarServicios(); 
          this.nuevoServicio = { nombre: '', descripcion: '', precio: null };
        }
      },
      error: (err) => {
        Swal.fire('Error', 'No tienes permisos o el servidor falló', 'error');
      }
    });
  }
}