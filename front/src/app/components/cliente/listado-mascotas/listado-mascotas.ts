import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MascotaService, MascotaResponse } from '../../../services/Mascotas/mascota';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-listado-mascotas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listado-mascotas.html',
})
export class ListadoMascotas implements OnInit {
  readonly mascotas = signal<MascotaResponse[]>([]);
  readonly loading = signal(true);
  readonly modalAbierto = signal(false);
  readonly guardando = signal(false);

  formData = {
    nombre: '',
    tipo: '',
    raza: '',
    edad: 0,
  };

  errores: Record<string, string> = {};

  constructor(private mascotaService: MascotaService) {}

  ngOnInit(): void {
    this.cargarMascotas();
  }

  cargarMascotas(): void {
    this.loading.set(true);
    this.mascotaService.listarPorCliente().subscribe({
      next: (res) => {
        this.mascotas.set(res.datos ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        Swal.fire('Error', 'No se pudieron cargar tus mascotas', 'error');
      },
    });
  }



  abrirModal(): void {
    this.formData = { nombre: '', tipo: 'Perro', raza: '', edad: 0 };
    this.errores = {};
    this.modalAbierto.set(true);
  }

  cerrarModal(): void {
    this.modalAbierto.set(false);
  }

  guardarMascota(): void {
    this.errores = {};

    if (!this.formData.nombre?.trim()) {
      this.errores['nombre'] = 'El nombre es obligatorio';
      return;
    }
    const edad = Number(this.formData.edad);
    if (isNaN(edad) || edad < 0 || edad > 40) {
      this.errores['edad'] = 'La edad debe estar entre 0 y 40 años';
      return;
    }

    this.guardando.set(true);
    const payload = {
      nombre: this.formData.nombre.trim(),
      tipo: this.formData.tipo,
      raza: this.formData.raza?.trim() || '',
      edad: edad,
      fotoUrl: null,
    };

    this.mascotaService.registrar(payload).subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarModal();
        Swal.fire({
          icon: 'success',
          title: 'Mascota registrada',
          text: 'La mascota se registró correctamente',
          timer: 1500,
          showConfirmButton: false,
        });
        this.cargarMascotas();
      },
      error: () => {
        this.guardando.set(false);
        Swal.fire('Error', 'No se pudo registrar la mascota', 'error');
      },
    });
  }
}
