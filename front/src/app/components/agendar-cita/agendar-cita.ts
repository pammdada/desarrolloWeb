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

  // Objeto para almacenar errores de validacion por campo
  errores: any = {
    mascota: '',
    fechaHora: '',
    motivo: ''
  };

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

  // Valida que la fecha sea a partir de manana, en horario 08:00-23:00,
  // y con al menos 1 hora de antelacion desde el momento actual
  validarFechaHora(): boolean {
    const dateTimeValue: string = this.cita.fechaHora;
    if (!dateTimeValue) {
      this.errores.fechaHora = 'Selecciona una fecha y hora';
      return false;
    }

    const ahora = new Date();
    const seleccionada = new Date(dateTimeValue);

    if (seleccionada <= ahora) {
      this.errores.fechaHora = 'La fecha y hora debe ser futura (min. 1 hora de antelacion)';
      return false;
    }

    const diffHoras = (seleccionada.getTime() - ahora.getTime()) / (1000 * 60 * 60);
    if (diffHoras < 1) {
      this.errores.fechaHora = 'La cita debe tener al menos 1 hora de antelacion';
      return false;
    }

    const partes = dateTimeValue.split('T');
    const horaStr = partes[1];
    const hora = parseInt(horaStr.split(':')[0], 10);
    const minutos = parseInt(horaStr.split(':')[1], 10);

    if (hora < 9 || hora > 22) {
      this.errores.fechaHora = 'La hora debe estar entre 09:00 y 22:00';
      return false;
    }

    this.errores.fechaHora = '';
    return true;
  }

  // Valida que el motivo tenga al menos 10 caracteres y solo caracteres validos
  validarMotivo(): boolean {
    const motivo = this.cita.motivo.trim();
    if (!motivo) {
      this.errores.motivo = 'Describe el motivo de la consulta';
      return false;
    }
    if (motivo.length < 10) {
      this.errores.motivo = 'El motivo debe tener al menos 10 caracteres';
      return false;
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,;:!?¿¡\-]+$/.test(motivo)) {
      this.errores.motivo = 'Solo se permiten letras, numeros y puntuacion basica';
      return false;
    }
    this.errores.motivo = '';
    return true;
  }

  // Valida que se haya seleccionado una mascota
  validarMascota(): boolean {
    if (!this.cita.mascota || !this.cita.mascota.id) {
      this.errores.mascota = 'Selecciona una mascota';
      return false;
    }
    this.errores.mascota = '';
    return true;
  }

  // Ejecuta todas las validaciones antes de enviar
  formularioValido(): boolean {
    this.errores = { mascota: '', fechaHora: '', motivo: '' };
    const mascotaOk = this.validarMascota();
    const fechaOk = this.validarFechaHora();
    const motivoOk = this.validarMotivo();
    return mascotaOk && fechaOk && motivoOk;
  }

  enviarCita() {
    if (!this.formularioValido()) {
      return;
    }

    const dateTimeValue: string = this.cita.fechaHora;
    const partes = dateTimeValue.split('T');
    const fecha = partes[0];
    const hora = partes[1] + ':00';

    const datosParaJava = {
      mascotaId: this.cita.mascota.id,
      fecha: fecha,
      hora: hora,
      problema: this.cita.motivo.trim()
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