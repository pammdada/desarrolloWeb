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
    cliente: null
  }

  constructor(private mascotaService: Mascota, private router: Router) { }

  guardarMascota() {
    const usuario = localStorage.getItem('currentUser');

    if (usuario) {
      const usuarioObj = JSON.parse(usuario);
      this.nuevaMascota.cliente = { id: Number(usuarioObj.id) };

      const mascotaParaJava = {
        nombre: this.nuevaMascota.nombre,
        especie: this.nuevaMascota.especie,
        raza: this.nuevaMascota.raza,
        edad: this.nuevaMascota.edad,
        cliente: { id: usuarioObj.id }
      };

      console.log("ID recuperado con éxito:", this.nuevaMascota.cliente);
    } else {
      alert('No se encontró la sesión del usuario');
      return;
    }


    this.mascotaService.registrar(this.nuevaMascota).subscribe({
      next: () => {
        alert('Mascota registrada exitosamente');
        this.router.navigate(['/mascotas']);
      },
      error: (err) => {
        console.log("Error 400 - Datos enviados:", this.nuevaMascota);
        console.error("Detalle del error:", err);
      }
    });
  }
}
