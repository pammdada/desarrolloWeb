import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Mascota } from '../../services/Mascotas/mascota';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { Citas } from '../../services/Citas/citas';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agendar-cita',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterOutlet, RouterLink],
  templateUrl: './agendar-cita.html',
  styleUrl: './agendar-cita.css',
})
export class AgendarCita implements OnInit {
  listaMascotas: any[] = [];
  cita: any = { fechaHora: '', motivo: '', mascota: null, estado: 'PENDIENTE' };

  constructor(private Mascota: Mascota, private citas: Citas, private router: Router) { }

  ngOnInit() {
    this.cargarMascotas();
  }

  cargarMascotas() {
    const usuarioAc = localStorage.getItem('currentUser');

    if (usuarioAc) {
      const usuario = JSON.parse(usuarioAc);
      const clienteId = usuario.id;

      this.Mascota.listarPorCliente(clienteId).subscribe((data) => {
        this.listaMascotas = data.datos || data;
      },
        (error) => {
          console.error('Error al cargar mascotas', error);
        }
      );
    }
  }

  enviarCita() {
    if (!this.cita.mascota) {
      alert('Por favor, selecciona una mascota');
      return;
    }

    // Cambio: se parsea el datetime-local a fecha (YYYY-MM-DD) y hora (HH:mm)
    // para coincidir con CitaSolicitud.java que espera LocalDate + LocalTime separados
    const dateTimeValue: string = this.cita.fechaHora;
    if (!dateTimeValue) {
      alert('Selecciona una fecha y hora');
      return;
    }
    const partes = dateTimeValue.split('T');
    const fecha = partes[0];
    const hora = partes[1] + ':00';

    // Cambio: estructura corregida para coincidir con CitaSolicitud.java:
    // - mascotaId (Long) en vez de mascota: { id }
    // - fecha + hora separados en vez de fechaHora combinado
    // - problema en vez de motivo
    // - se elimina veterinario (no lo espera CitaSolicitud)
    const datosParaJava = {
      mascotaId: this.cita.mascota.id,
      fecha: fecha,
      hora: hora,
      problema: this.cita.motivo
    };

    const usuarioAc = localStorage.getItem('currentUser');
    if (usuarioAc) {
      this.citas.agendarCita(datosParaJava).subscribe({
        next: (res) => {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Cita confirmada!",
            showConfirmButton: false,
            timer: 1500,
          });
          this.router.navigate(['/cliente']);
        },
        error: (err) => {
          console.error('Error al agendar cita:', err);
        }
      });
    }
  }
}