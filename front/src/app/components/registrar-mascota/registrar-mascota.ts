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
    tipo: '',
    raza: '',
    edad: 0,
    cliente: null
  }

  constructor(private mascotaService: Mascota, private router: Router) { }

  guardarMascota() {
    const usuario = localStorage.getItem('currentUser');
    let mascotaParaJava: any;

    if (usuario) {
      const usuarioObj = JSON.parse(usuario);
      this.nuevaMascota.cliente = { id: Number(usuarioObj.id) };

      mascotaParaJava = {
        nombre: this.nuevaMascota.nombre,
        tipo: this.nuevaMascota.tipo,
        raza: this.nuevaMascota.raza,
        edad: this.nuevaMascota.edad,
        fotoUrl: this.nuevaMascota.fotoUrl || null,
        clienteId: Number(usuarioObj.id)
      };

      console.log("ID recuperado con éxito:", this.nuevaMascota.cliente);
    } else {
      alert('No se encontró la sesión del usuario');
      return;
    }


    this.mascotaService.registrar(mascotaParaJava).subscribe({
      next: () => {
        alert('Mascota registrada exitosamente');
        this.router.navigate(['/cliente']);
      },
      error: (err) => {
        console.log("Error al registrar mascota - Datos enviados:", mascotaParaJava, "Status:", err.status);
      }
    });
  }
}
