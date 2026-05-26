import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { autenticacion } from '../../services/Autenticacion/autenticacion';
import { PerfilUsuario, ActualizarPerfilData, CambiarContrasenaData } from '../../models/usuario.model';
import { verificarRequisitosContrasena, validarContrasena } from '../../utils/validacion-contrasena';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {

  // Datos completos del perfil cargados desde el backend
  perfil: PerfilUsuario = {} as PerfilUsuario;

  // Indica si el formulario de edicion de datos personales esta activo
  editando: boolean = false;

  // Copia editable de los datos del perfil para modificacion
  perfilEdit: ActualizarPerfilData = {};

  // Indica si el formulario de cambio de contrasena esta expandido dentro de la edicion
  mostrarCambioContrasena: boolean = false;

  // Datos para el cambio de contrasena
  cambioContrasena: CambiarContrasenaData = {
    contrasenaActual: '',
    nuevaContrasena: ''
  };

  // Confirmacion de la nueva contrasena (solo validacion local, no se envia al backend)
  confirmarContrasena: string = '';

  // Objeto que refleja en tiempo real que requisitos de la nueva contrasena se cumplen
  passwordChecks = {
    longitud: false,
    mayuscula: false,
    minuscula: false,
    numero: false,
    especial: false
  };

  // Indica si los datos estan cargando
  cargando: boolean = true;

  // Indica si hay un error al cargar el perfil
  errorCarga: boolean = false;

  constructor(private autenticacion: autenticacion) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  // Obtiene los datos del perfil desde el backend
  cargarPerfil(): void {
    this.cargando = true;
    this.errorCarga = false;

    this.autenticacion.obtenerPerfil().subscribe({
      next: (res: any) => {
        if (res?.exito && res?.datos) {
          this.perfil = res.datos;
        } else {
          this.errorCarga = true;
        }
        this.cargando = false;
      },
      error: () => {
        this.errorCarga = true;
        this.cargando = false;
      }
    });
  }

  // Genera las iniciales del usuario para el avatar circular
  obtenerIniciales(): string {
    if (!this.perfil.nombre) return '?';
    const partes = this.perfil.nombre.trim().split(/\s+/);
    const primera = partes[0]?.charAt(0)?.toUpperCase() || '';
    const segunda = partes[1]?.charAt(0)?.toUpperCase() || '';
    return primera + (segunda || (this.perfil.apellidos?.charAt(0)?.toUpperCase() || ''));
  }

  // Activa el modo edicion de datos personales y copia los valores actuales al formulario
  activarEdicion(): void {
    this.perfilEdit = {
      nombre: this.perfil.nombre,
      apellidos: this.perfil.apellidos,
      telefono: this.perfil.telefono,
      dni: this.perfil.dni
    };
    this.editando = true;
    this.mostrarCambioContrasena = false;
  }

  // Cancela la edicion de datos personales y resetea el formulario de contrasena
  cancelarEdicion(): void {
    this.editando = false;
    this.mostrarCambioContrasena = false;
    this.perfilEdit = {};
    this.cambioContrasena = { contrasenaActual: '', nuevaContrasena: '' };
    this.confirmarContrasena = '';
    this.passwordChecks = { longitud: false, mayuscula: false, minuscula: false, numero: false, especial: false };
  }

  // Guarda los cambios del perfil en el backend
  guardarPerfil(): void {
    // Si el modo de cambio de contrasena esta activo, valida y envia tambien la contrasena
    if (this.mostrarCambioContrasena) {
      // Valida la nueva contrasena usando la funcion compartida
      const errorContrasena = validarContrasena(this.cambioContrasena.nuevaContrasena);
      if (errorContrasena) {
        Swal.fire({
          icon: 'error',
          title: 'Contrasena invalida',
          text: errorContrasena
        });
        return;
      }

      // Valida que ambas contrasenas coincidan
      if (this.cambioContrasena.nuevaContrasena !== this.confirmarContrasena) {
        Swal.fire({
          icon: 'error',
          title: 'Contrasenas no coinciden',
          text: 'La nueva contrasena y la confirmacion no son iguales'
        });
        return;
      }

      // Valida que la contrasena actual no este vacia
      if (!this.cambioContrasena.contrasenaActual) {
        Swal.fire({
          icon: 'error',
          title: 'Campo requerido',
          text: 'Debes ingresar tu contrasena actual'
        });
        return;
      }
    }

    // Filtra solo los campos de datos personales que cambiaron
    const datosEnviar: ActualizarPerfilData = {};
    if (this.perfilEdit.nombre !== this.perfil.nombre) {
      datosEnviar.nombre = this.perfilEdit.nombre;
    }
    if (this.perfilEdit.apellidos !== this.perfil.apellidos) {
      datosEnviar.apellidos = this.perfilEdit.apellidos;
    }
    if (this.perfilEdit.telefono !== this.perfil.telefono) {
      datosEnviar.telefono = this.perfilEdit.telefono;
    }
    if (this.perfilEdit.dni !== this.perfil.dni) {
      datosEnviar.dni = this.perfilEdit.dni;
    }

    // Si no hay cambios en datos personales ni cambio de contrasena, cierra el modo edicion
    if (Object.keys(datosEnviar).length === 0 && !this.mostrarCambioContrasena) {
      this.cancelarEdicion();
      return;
    }

    // Primero actualiza los datos personales si hay cambios
    const actualizarDatos = Object.keys(datosEnviar).length > 0
      ? this.autenticacion.actualizarPerfil(datosEnviar).toPromise()
      : Promise.resolve({ exito: true });

    actualizarDatos.then((res: any) => {
      if (res?.exito === false) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: res?.mensaje || 'No se pudo actualizar el perfil'
        });
        return;
      }

      // Actualiza los datos locales con la respuesta del backend
      if (res?.datos) {
        this.perfil = res.datos;
      }

      // Si hay cambio de contrasena pendiente, lo ejecuta
      if (this.mostrarCambioContrasena) {
        this.autenticacion.cambiarContrasena({
          contrasenaActual: this.cambioContrasena.contrasenaActual,
          nuevaContrasena: this.cambioContrasena.nuevaContrasena
        }).subscribe({
          next: (resPw: any) => {
            if (resPw?.exito) {
              this.cancelarEdicion();
              Swal.fire({
                icon: 'success',
                title: 'Perfil y contrasena actualizados',
                timer: 1500,
                showConfirmButton: false,
                position: 'top-end'
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error al cambiar contrasena',
                text: resPw?.mensaje || 'No se pudo cambiar la contrasena'
              });
            }
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error de conexion',
              text: 'No se pudo cambiar la contrasena'
            });
          }
        });
      } else {
        this.cancelarEdicion();
        Swal.fire({
          icon: 'success',
          title: 'Perfil actualizado',
          timer: 1500,
          showConfirmButton: false,
          position: 'top-end'
        });
      }
    }).catch(() => {
      Swal.fire({
        icon: 'error',
        title: 'Error de conexion',
        text: 'No se pudo conectar con el servidor'
      });
    });
  }

  // Expande el formulario de cambio de contrasena dentro del modo edicion
  activarCambioContrasena(): void {
    this.mostrarCambioContrasena = true;
  }

  // Cancela el cambio de contrasena y limpia los campos
  cancelarCambioContrasena(): void {
    this.mostrarCambioContrasena = false;
    this.cambioContrasena = { contrasenaActual: '', nuevaContrasena: '' };
    this.confirmarContrasena = '';
    this.passwordChecks = { longitud: false, mayuscula: false, minuscula: false, numero: false, especial: false };
  }

  // Actualiza los checks de la nueva contrasena en tiempo real usando la funcion compartida
  actualizarChecksNuevaContrasena(): void {
    this.passwordChecks = verificarRequisitosContrasena(this.cambioContrasena.nuevaContrasena);
  }

  // Formatea la fecha ISO a un formato legible en espanol
  formatearFecha(iso: string): string {
    if (!iso) return '';
    const fecha = new Date(iso);
    return fecha.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
