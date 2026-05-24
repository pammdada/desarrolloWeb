import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { autenticacion } from '../../services/Autenticacion/autenticacion';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verificar-token',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './verificar-token.html',
  styleUrl: './verificar-token.css',
})
export class VerificarToken {
  data = {
    correo: '',
    token: ''
  };

  constructor(
    private autenticacion: autenticacion,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['correo']) {
        this.data.correo = params['correo'];
      }
    });
  }

  verificarToken() {
    const requestData = {
      correo: this.data.correo.trim().toLowerCase(),
      token: this.data.token.trim()
    };

    this.autenticacion.verificarToken(requestData).subscribe({
      next: (res: any) => {
        if (res?.exito === false) {
          alert('Error al verificar el código: ' + (res.mensaje || res.message || 'Código incorrecto'));
          return;
        }
        alert('Código verificado correctamente. Ahora puedes iniciar sesión.');
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        const mensaje = err.error?.mensaje || err.error?.message || 'Error al verificar el código';
        alert('Error al verificar el código: ' + mensaje);
      }
    });
  }
}
