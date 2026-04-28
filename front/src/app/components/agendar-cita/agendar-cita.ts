import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Mascota } from '../../services/Mascotas/mascota';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { Citas } from '../../services/Citas/citas';

@Component({
  selector: 'app-agendar-cita',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterOutlet, RouterLink],
  templateUrl: './agendar-cita.html',
  styleUrl: './agendar-cita.css',
})
export class AgendarCita implements OnInit {
  listaMascotas: any[] = [];
  cita = { fechaHora: '', motivo: '', mascotaId: null, estado: 'PENDIENTE' };

  constructor(private Mascota: Mascota, private citas: Citas, private router: Router) { }

  ngOnInit() {
    this.cargarMascotas();
  }

  cargarMascotas() {
    const clienteId = localStorage.getItem('clienteId');

    if (clienteId) {
      const usuario = JSON.parse(clienteId);
      this.Mascota.listarPorCliente(clienteId).subscribe((data) => {
        this.listaMascotas = data;
      },
        (error) => {
          console.error('Error al cargar mascotas', error);
        }
      );
    }
  }

  enviarCita() {
    this.citas.agendarCita(this.cita).subscribe({
      next: (res) => {
        alert('¡Cita solicitada con éxito! Espera a que el veterinario la confirme.');
        this.router.navigate(['/cliente']);
      },
      error: (err) => {
        console.error('Error al agendar cita', err);
        alert('Hubo un problema al agendar la cita.');
      }
    });
  }
}