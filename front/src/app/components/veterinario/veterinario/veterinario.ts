import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Citas } from '../../../services/Citas/citas';
import { Pdf } from '../../../services/pdf/pdf';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { autenticacion } from '../../../services/Autenticacion/autenticacion';
import { forkJoin } from 'rxjs';

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

  showRescheduleModal: boolean = false;
  selectedAppointment: any = null;
  rescheduleData = { nuevaFecha: '', nuevaHora: '' };

  showReportModal: boolean = false;
  reportText: string = '';
  recetaText: string = '';
  archivosAdjuntos: string[] = [];

  constructor(
    private citas: Citas,
    private authService: autenticacion,
    private router: Router,
    private pdfService: Pdf
  ) { }

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
    forkJoin({
      aceptadas: this.citas.getMyAppointments('ACEPTADA'),
      atendidas: this.citas.getMyAppointments('ATENDIDA')
    }).subscribe({
      next: (res) => {
        const aceptadas = res.aceptadas?.datos || [];
        const atendidas = res.atendidas?.datos || [];
        this.myAppointments = [...aceptadas, ...atendidas];
      },
      error: (err) => {
        console.error('Error al cargar citas asignadas', err);
        this.myAppointments = [];
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

  openReschedule(app: any): void {
    this.selectedAppointment = app;
    this.rescheduleData.nuevaFecha = app.fecha || '';
    this.rescheduleData.nuevaHora = app.hora?.substring(0, 5) || '';
    this.showRescheduleModal = true;
  }

  confirmReschedule(): void {
  if (!this.rescheduleData.nuevaFecha || !this.rescheduleData.nuevaHora) {
    Swal.fire('Error', 'Debe seleccionar fecha y hora', 'error');
    return;
  }

  this.citas.rescheduleAppointment(this.selectedAppointment.id, {
    nuevaFecha: this.rescheduleData.nuevaFecha,
    nuevaHora: this.rescheduleData.nuevaHora
  }).subscribe({
    next: (response) => {
      console.log("Respuesta del servidor:", response);
      
      if (response && response.exito) {
        Swal.fire('Reagendado', 'La cita se movió con éxito', 'success');
        this.showRescheduleModal = false;
        this.obtenerCitasPendientes();
        this.loadMyAppointments();
      } else {
        Swal.fire('Atención', response.mensaje || 'No se pudo reagendar', 'warning');
      }
    },
    error: (err) => {
      console.error('Error al reagendar', err);
      Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
    }
  });
}

  openReportModal(app: any): void {
  this.selectedAppointment = app;

  if (app.estado === 'ATENDIDA' && app.reporte) {
    if (app.reporte.includes('|')) {
      const partes = app.reporte.split('|');
      this.reportText = partes[0].trim();
      this.recetaText = app.problema?.trim() || 'No registrada';
    } else {
      this.reportText = app.reporte;
      this.recetaText = 'No registrada';
    }
  } else {
    this.reportText = '';
    this.recetaText = '';
    this.archivosAdjuntos = [];
  }
  this.showReportModal = true;
}

  cerrarReportModal(): void {
    this.showReportModal = false;
    this.reportText = '';
    this.recetaText = '';
  }

  openArchivoSeleccionado(event: any): void {
  const files: FileList = event.target.files;
  if (files) {
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.archivosAdjuntos.push(e.target.result as string);
      };
      reader.readAsDataURL(files[i]);
    }
  }
}

guardarAtencionMedica(): void {
  if (!this.reportText || !this.recetaText) {
    Swal.fire('Atención', 'Por favor, llene el diagnóstico y la receta', 'warning');
    return;
  }

  const datosEnvio = {
    reporte: `${this.reportText}`,
    problema: `: ${this.recetaText}` + 
              (this.archivosAdjuntos.length > 0 ? ` | IMAGENES: ${this.archivosAdjuntos.join(',')}` : '')
  };

  this.citas.finalizarAtencion(this.selectedAppointment.id, datosEnvio).subscribe({
    next: (res: any) => {
      Swal.fire('Éxito', 'Atención médica registrada y cita cerrada', 'success');
      this.cerrarReportModal();
      this.loadMyAppointments();
    },
    error: (err) => {
      console.error(err);
      Swal.fire('Error', 'No se pudo guardar la atención médica', 'error');
    }
  });
}
  descargarRecetaPDF(cita: any): void {
    this.pdfService.descargarRecetaPDF(cita);
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
        this.authService.logout();
        this.router.navigate(['/home']);
      };
    });
  }
}
