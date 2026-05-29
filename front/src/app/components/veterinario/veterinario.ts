import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Citas } from '../../services/Citas/citas';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { autenticacion } from '../../services/Autenticacion/autenticacion';

@Component({
  selector: 'app-veterinario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './veterinario.html',
  styleUrl: './veterinario.css',
})
export class Veterinario {
  citasPendientes: any[] = [];
  myAppointments: any[] = [];
  activeTab: string = 'pending';
  filterStatus: string = 'ACEPTADA';

  showRescheduleModal: boolean = false;
  selectedAppointment: any = null;
  rescheduleData = { nuevaFecha: '', nuevaHora: '' };

  showReportModal: boolean = false;
  reportText: string = '';

  constructor(
    private citas: Citas,
    private authService: autenticacion,
    private router: Router) { }

  ngOnInit(): void {
    this.obtenerCitasPendientes();
    this.loadMyAppointments();
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

  loadMyAppointments(): void {
    // Reutiliza tu servicio de citas pasando el filtro 'ACEPTADA' o 'ATENDIDA'
    this.citas.getMyAppointments(this.filterStatus).subscribe({
      next: (response) => {
        if (response && response.datos) {
          this.myAppointments = response.datos;
        } else {
          this.myAppointments = [];
        }
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

  saveReport(): void {
    this.citas.addReport(this.selectedAppointment.id, this.reportText)
      .subscribe(() => {
        this.showReportModal = false;
        this.loadMyAppointments();
      });
  }
  openReschedule(app: any): void {
    this.selectedAppointment = app;
    this.rescheduleData.nuevaFecha = app.fecha || '';
    this.rescheduleData.nuevaHora = app.hora || '';
    this.showRescheduleModal = true;
  }

  confirmReschedule(): void {
    if (!this.rescheduleData.nuevaFecha || !this.rescheduleData.nuevaHora) {
      Swal.fire('Error', 'Debe seleccionar fecha y hora', 'error');
      return;
    }

    this.citas.rescheduleAppointment(this.selectedAppointment.id, {
      nuevaFecha: this.rescheduleData.nuevaFecha,
      nuevaHora: this.rescheduleData.nuevaHora + ':00'
    }).subscribe({
      next: (response) => {
        if (response && response.exito) {
          Swal.fire('Reagendado', 'La cita se movió con éxito', 'success');
          this.showRescheduleModal = false;
          this.obtenerCitasPendientes();
        }
      },
      error: (err) => console.error(err)
    });
  }

  markAttended(id: number): void {
    Swal.fire({
      title: "¿Finalizar atención?",
      text: "La cita cambiará a estado ATENDIDA",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, finalizar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.citas.markAsAttended(id).subscribe(() => this.loadMyAppointments());
      }
    });
  }

  cerrarSesion() {
    Swal.fire({
      title: "Cerrar sesión",
      text: "Salir del panel de veterinario.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "rgb(39, 204, 75)",
      confirmButtonText: "Cerrar sesión",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        //Aquí cierra sesión y te dirige a la pantalla de inicio.
        this.authService.logout();
        this.router.navigate(['/home']);
      };
    });
  }
}
