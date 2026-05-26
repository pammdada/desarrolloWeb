import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Citas } from '../../services/Citas/citas';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-veterinario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './veterinario.html',
  styleUrl: './veterinario.css',
})
export class Veterinario {
  citasPendientes: any[] = [];

  constructor(private citas: Citas) {}

  ngOnInit(): void {
    this.obtenerCitasPendientes();
  }

  obtenerCitasPendientes() {
    this.citas.listarPendientes().subscribe({
      next: (response) => {
        console.log('Respuesta completa:', response);
        if (response && response.datos) {
          this.citasPendientes = response.datos;
          console.log('Citas cargadas:', this.citasPendientes);
        } else {
          this.citasPendientes = [];
          console.warn('No hay datos en la respuesta');
        }
      },
      error: (err) => {
        console.error('Error al obtener citas pendientes', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las citas pendientes'
        });
      }
    });
  }

  gestionarCita(cita: any, nuevoEstado: string) {
    console.log("Objeto cita recibido:", cita);
    const idReal = cita.id;

    if (!idReal) {
      console.error("No se encontró el ID de la cita. Atributos disponibles:", Object.keys(cita));
      return;
    }

    if (nuevoEstado === "RECHAZADA") {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción rechazará la cita",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "rgb(39, 204, 75)",
        confirmButtonText: "Sí, rechazar",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          this.actualizarEstadoCita(idReal, nuevoEstado);
        }
      });
    } else {
      this.actualizarEstadoCita(idReal, nuevoEstado);
    }
  }

  actualizarEstadoCita(id: number, estado: string) {
    this.citas.actualizarEstado(id, estado).subscribe({
      next: (response) => {
        if (response && response.exito) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `Cita ${estado.toLowerCase()} correctamente`,
            showConfirmButton: false,
            timer: 1500
          });
          this.obtenerCitasPendientes();
        } else {
          console.error('Error en la respuesta:', response?.mensaje);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: response?.mensaje || "No se pudo actualizar la cita"
          });
        }
      },
      error: (err) => {
        console.error(`Error al ${estado.toLowerCase()} la cita`, err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo actualizar la cita"
        });
      }
    });
  }
}

