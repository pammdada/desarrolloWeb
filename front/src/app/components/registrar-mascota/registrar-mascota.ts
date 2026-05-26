import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Mascota } from '../../services/Mascotas/mascota';

@Component({
  selector: 'app-registrar-mascota',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
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

  // Objeto para almacenar errores de validacion por campo
  errores: any = {
    nombre: '',
    raza: '',
    edad: ''
  };

  constructor(private mascotaService: Mascota, private router: Router) { }

  // Valida que el nombre solo contenga letras y espacios
  validarNombre(): boolean {
    const nombre = this.nuevaMascota.nombre.trim();
    if (!nombre) {
      this.errores.nombre = 'El nombre es obligatorio';
      return false;
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
      this.errores.nombre = 'Solo se permiten letras y espacios';
      return false;
    }
    this.errores.nombre = '';
    return true;
  }

  // Valida que la raza solo contenga letras, espacios, guiones y apostrofes
  validarRaza(): boolean {
    const raza = this.nuevaMascota.raza.trim();
    if (raza && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-']+$/.test(raza)) {
      this.errores.raza = 'Solo se permiten letras, espacios, guiones y apostrofes';
      return false;
    }
    this.errores.raza = '';
    return true;
  }

  // Valida que la edad sea un numero entero entre 0 y 40
  validarEdad(): boolean {
    const edad = Number(this.nuevaMascota.edad);
    if (isNaN(edad) || !Number.isInteger(edad)) {
      this.errores.edad = 'Debe ser un numero entero';
      return false;
    }
    if (edad < 0 || edad > 40) {
      this.errores.edad = 'La edad debe estar entre 0 y 40 anios';
      return false;
    }
    this.errores.edad = '';
    return true;
  }

  // Ejecuta todas las validaciones antes de enviar
  formularioValido(): boolean {
    this.errores = { nombre: '', raza: '', edad: '' };
    const nombreOk = this.validarNombre();
    const razaOk = this.validarRaza();
    const edadOk = this.validarEdad();
    return nombreOk && razaOk && edadOk;
  }

  guardarMascota() {
    if (!this.formularioValido()) {
      return;
    }

    const usuario = localStorage.getItem('currentUser');
    let mascotaParaJava: any;

    if (usuario) {
      const usuarioObj = JSON.parse(usuario);
      this.nuevaMascota.cliente = { id: Number(usuarioObj.id) };

      // Se convierte el tipo a mayusculas antes de enviarlo al backend
      const tipoUpper = this.nuevaMascota.tipo.toUpperCase();

      mascotaParaJava = {
        nombre: this.nuevaMascota.nombre.trim(),
        tipo: tipoUpper,
        raza: this.nuevaMascota.raza.trim(),
        edad: Number(this.nuevaMascota.edad),
        fotoUrl: this.nuevaMascota.fotoUrl || "null",
        clienteId: Number(usuarioObj.id)
      };

    } else {
      alert('No se encontro la sesion del usuario');
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
