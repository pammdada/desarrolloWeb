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
        this.listaMascotas = data;
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

    const datosParaJava = {
    fechaHora: this.cita.fechaHora, 
    estado: "PENDIENTE",
    motivo: this.cita.motivo,
    mascota: { id: this.cita.mascota.id },
    veterinario: { id: 20} 
    };
    
    const usuarioAc = localStorage.getItem('currentUser');
    if(usuarioAc) {
      const usuario = JSON.parse(usuarioAc);
      const clienteId = usuario.id;
      this.citas.agendarCita(datosParaJava).subscribe({
      next: (res) => {
        alert('¡Cita solicitada con éxito! Espera a que el veterinario la confirme.');
        this.router.navigate(['/cliente']);
      },
      error: (err) => {
        console.error('Error al agendar cita:', err);
      }
      });
    }
  }
}