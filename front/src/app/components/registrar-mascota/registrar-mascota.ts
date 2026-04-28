import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Mascota } from '../../services/Mascotas/mascota';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar-mascota',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-mascota.html',
  styleUrl: './registrar-mascota.css'
})
export class RegistrarMascota {

  nuevaMascota: any = {
    nombre: '',
    especie: '',
    raza: '',
    edad: 0,
    clienteId: null
  }

  constructor(private mascotaService: Mascota, private router: Router) {}

  guardarMascota() {
    const clienteId = localStorage.getItem('clienteId');
    this.nuevaMascota.clienteId = clienteId;

    this.mascotaService.registrar(this.nuevaMascota).subscribe({
      next: () => {
        alert('Mascota registrada exitosamente');
        this.router.navigate(['/cliente']);
      },
      error: (err) => alert('Error al registrar mascota')
  });
  }
}
