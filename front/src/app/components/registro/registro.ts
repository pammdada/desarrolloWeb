import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { autenticacion } from '../../services/Autenticacion/autenticacion';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  //  Objeto con los datos esenciales para el registro (sin DNI ni teléfono)
  nuevoUsuario = {
    nombres: '',
    apellidos: '',
    correo: '',
    contrasena: '',
    rol: 'CLIENTE'
  };

  //  Campo adicional para confirmar la contraseña (no se envía al backend)
  confirmarContrasena: string = '';

  //  Objeto para almacenar errores de validación por campo (solo esenciales)
  errores: any = {
    nombres: '',
    apellidos: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: ''
  };

  // Objeto que refleja en tiempo real qué requisitos de contraseña se cumplen
  passwordChecks = {
    longitud: false,
    mayuscula: false,
    minuscula: false,
    numero: false,
    especial: false
  };

  //  Actualiza los checks de contraseña en cada pulsación del usuario
  // Se ejecuta con el evento (input) en el campo de contraseña
  actualizarChecksContrasena(): void {
    const pw = this.nuevoUsuario.contrasena;
    this.passwordChecks.longitud = pw.length >= 8;
    this.passwordChecks.mayuscula = /[A-Z]/.test(pw);
    this.passwordChecks.minuscula = /[a-z]/.test(pw);
    this.passwordChecks.numero = /[0-9]/.test(pw);
    this.passwordChecks.especial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw);
  }

  constructor(private autenticacion: autenticacion, private router: Router) {}

  //  Valida que la contraseña cumpla requisitos mínimos de seguridad
  // - Mínimo 8 caracteres
  // - Al menos una letra mayúscula
  // - Al menos una letra minúscula
  // - Al menos un número
  // - Al menos un carácter especial (!@#$%^&*)
  validarContrasena(): boolean {
    const pw = this.nuevoUsuario.contrasena;
    if (pw.length < 8) {
      this.errores.contrasena = 'La contraseña debe tener al menos 8 caracteres';
      return false;
    }
    if (!/[A-Z]/.test(pw)) {
      this.errores.contrasena = 'La contraseña debe tener al menos una mayúscula';
      return false;
    }
    if (!/[a-z]/.test(pw)) {
      this.errores.contrasena = 'La contraseña debe tener al menos una minúscula';
      return false;
    }
    if (!/[0-9]/.test(pw)) {
      this.errores.contrasena = 'La contraseña debe tener al menos un número';
      return false;
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw)) {
      this.errores.contrasena = 'La contraseña debe tener al menos un carácter especial';
      return false;
    }
    this.errores.contrasena = '';
    return true;
  }

  //  Verifica que la contraseña y su confirmación coincidan
  contrasenasCoinciden(): boolean {
    if (this.nuevoUsuario.contrasena !== this.confirmarContrasena) {
      this.errores.confirmarContrasena = 'Las contraseñas no coinciden';
      return false;
    }
    this.errores.confirmarContrasena = '';
    return true;
  }

  //  Valida campos obligatorios (nombres, apellidos, correo)
  validarCamposObligatorios(): boolean {
    let valido = true;
    if (!this.nuevoUsuario.nombres.trim()) {
      this.errores.nombres = 'El nombre es obligatorio';
      valido = false;
    } else {
      this.errores.nombres = '';
    }
    if (!this.nuevoUsuario.apellidos.trim()) {
      this.errores.apellidos = 'Los apellidos son obligatorios';
      valido = false;
    } else {
      this.errores.apellidos = '';
    }
    if (!this.nuevoUsuario.correo.trim()) {
      this.errores.correo = 'El correo es obligatorio';
      valido = false;
    } else {
      this.errores.correo = '';
    }
    return valido;
  }

  //  Orquesta todas las validaciones antes de enviar el registro
  formularioValido(): boolean {
    this.errores = { nombres: '', apellidos: '', correo: '', contrasena: '', confirmarContrasena: '' };
    const obligatoriosOk = this.validarCamposObligatorios();
    const contrasenaOk = this.validarContrasena();
    const coincidenOk = this.contrasenasCoinciden();
    return obligatoriosOk && contrasenaOk && coincidenOk;
  }

  onRegistro() {
    // Ejecuta validación del lado del cliente antes de enviar
    if (!this.formularioValido()) {
      return;
    }

    this.autenticacion.registrar(this.nuevoUsuario).subscribe({
      next: (res: any) => {
        if (res?.exito === false) {
          alert('Error de registro: ' + (res.mensaje || res.message || 'No se pudo registrar'));
          return;
        }

        let mensaje = res.mensaje || res.message || "¡Cuenta creada! Revisa tu correo y verifica el código enviado.";
        const token = res.datos?.token || res.data?.token;
        if (token) {
          mensaje += "\nCódigo de verificación: " + token;
        }
        alert(mensaje);
        this.router.navigate(['/verificar-token'], {
          queryParams: { correo: this.nuevoUsuario.correo }
        });
      },
      error: (err: any) => {
        console.error("Detalle del error:", err);
        const mensaje = err.error?.mensaje || err.error?.message || 'Error en el servidor';
        alert('Error de registro: ' + mensaje);
      }
    });
  }

  // Navega directamente a la pantalla de inicio de sesión sin pasar por home
  irALogin() {
    this.router.navigate(['/login']);
  }
}
