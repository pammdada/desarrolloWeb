import { Component, OnInit } from '@angular/core';
import { Citas } from '../../../services/Citas/citas'; 
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-citas',
  templateUrl: './mis-citas.html',
  standalone: true, 
  imports: [CommonModule],
})
export class MisCitas implements OnInit {
  listadoCitas: any[] = [];
  citaSeleccionada: any = null; 

  constructor(private citasService: Citas) {} 

  ngOnInit(): void {
    this.cargarCitas();
  }

  cargarCitas(): void {
    this.citasService.misCitas().subscribe({
      next: (res: any) => { 
        if (res && res.exito) {
          this.listadoCitas = res.datos; 
        } else {
          this.listadoCitas = res; 
        }
      },
      error: () => Swal.fire('Error', 'No se pudo cargar tu historial de citas', 'error')
    });
  }

  verDetalles(cita: any): void {
    this.citaSeleccionada = cita;
  }

  responderSolicitud(citaId: number, aceptar: boolean): void {
    const accion = aceptar ? 'aceptar' : 'rechazar';
    const peticion$ = aceptar 
      ? this.citasService.aceptarReagendacion(citaId) 
      : this.citasService.rechazarReagendacion(citaId);

    Swal.fire({
      title: '¿Confirmar decisión?',
      text: `¿Estás seguro de que deseas ${accion} la propuesta del veterinario?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        peticion$.subscribe({
          next: (res: any) => {
            if (res && res.exito) {
              Swal.fire('Éxito', res.mensaje, 'success');
              this.citaSeleccionada = null;
              this.cargarCitas(); 
            } else {
              Swal.fire('Atención', res.mensaje || 'Operación procesada', 'info');
              this.citaSeleccionada = null;
              this.cargarCitas();
            }
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'Hubo un problema al procesar la respuesta', 'error');
          }
        });
      }
    });
  }

  // DISEÑO DE RECETA VETERINARIA PROFESIONAL
  descargarRecetaPDF(cita: any): void {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' });

    let diagnosticoTexto = 'Estable. Sin hallazgos graves clínicos.';
    let recetaTexto = 'No se prescribieron medicamentos.';

    if (cita.reporte && cita.reporte.includes('|')) {
      const partes = cita.reporte.split('|');
      diagnosticoTexto = partes[0].replace('DIAGNÓSTICO:', '').trim();
      recetaTexto = partes[1].replace('RECETA:', '').trim();
    } else if (cita.reporte) {
      diagnosticoTexto = cita.reporte;
    }

    // Encabezado Verde Médico
    doc.setFillColor(34, 197, 94); 
    doc.rect(0, 0, 148, 15, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('VET PRO', 10, 10);

    // Metadata de la Clínica
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Atención Médica Integral | Horario de Atención: L-D 9:00 AM - 22:00 PM', 10, 22);
    doc.text(`Fecha: ${cita.fecha}`, 105, 22);

    doc.setDrawColor(220, 220, 220);
    doc.line(10, 25, 138, 25);

    // Datos de la Mascota y Dueño
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.text(`Paciente: ${cita.mascota?.nombre || 'Paciente'} (${cita.mascota?.tipo || 'Mascota'})`, 10, 32);
    doc.text(`Raza: ${cita.mascota?.raza || 'N/A'}`, 10, 37);
    doc.text(`Médico: Dr(a). ${cita.veterinario?.nombre || 'Especialista'}`, 10, 42);

    doc.line(10, 47, 138, 47);

    //Diagnóstico
    doc.setFont('helvetica', 'bold');
    doc.text('DIAGNÓSTICO MÉDICO:', 10, 55);
    doc.setFont('helvetica', 'normal');
    const txtReporte = doc.splitTextToSize(diagnosticoTexto, 128);
    doc.text(txtReporte, 10, 60);

    //RECETA
    doc.setFont('helvetica', 'bold');
    doc.text('RECETA / TRATAMIENTO:', 10, 85);
    doc.setFont('helvetica', 'normal');
    const txtReceta = doc.splitTextToSize(recetaTexto, 128);

    // Línea de Firma de Validación
    doc.line(40, 180, 108, 180);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('Firma y Sello del Médico Veterinario', 50, 185);

    // Descarga el PDF
    doc.save(`Receta_${cita.mascota?.nombre || 'Mascota'}_${cita.fecha}.pdf`);
  }
}