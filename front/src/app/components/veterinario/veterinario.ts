import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Citas } from '../../services/Citas/citas';

@Component({
  selector: 'app-veterinario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './veterinario.html',
  styleUrl: './veterinario.css',
})
export class Veterinario {
  citasPendientes: any[] = [];

  constructor(private citas: Citas) { }

  ngOnInit(): void {
    this.obtenerCitasPendientes();
  }

  obtenerCitasPendientes() {
    this.citas.listarPendientes().subscribe({
      next: (data) => {
        this.citasPendientes = data;
      },
      error: (err) => {
        console.error('Error al obtener citas pendientes', err);
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
    this.citas.actualizarEstado(idReal, nuevoEstado).subscribe({
      next: () => {
        alert(`La cita ha sido ${nuevoEstado.toLowerCase()} con éxito.`);
        this.obtenerCitasPendientes();
      },
      error: (err) => {
        console.error(`Error al ${nuevoEstado.toLowerCase()} la cita`, err);
        alert(`Erro al actualizar la cita`);
      }
    });
  }

}

