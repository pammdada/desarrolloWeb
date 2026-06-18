import { Component, OnInit } from '@angular/core';
import { autenticacion } from '../../services/Autenticacion/autenticacion';
import {RouterModule, Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente',
  imports: [CommonModule, RouterModule],
  standalone: true,
  templateUrl: './cliente.html',
  styleUrl: './cliente.css',
})
export class Cliente implements OnInit {
  nombreUsuario: string = '';

  constructor(private autenticacion: autenticacion, private router: Router) {}

  ngOnInit() {
    const user = this.autenticacion.getCurrentUser();
    if (user) {
      this.nombreUsuario = user.nombre;
    }
  }

  pagos(){
    this.router.navigate(['/pagos']);
  }

  //Para cerrar sesión:
  cerrarSesionUsuario() {
    Swal.fire({
      title: "Cerrar sesión",
      text: "Cerrar sesión de la cuenta actual.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "rgb(39, 204, 75)",
      confirmButtonText: "Cerrar sesión",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        //Esto limpia el LocalStorage y redirige a la pantalla principal.
        localStorage.clear();
        this.router.navigate(['/home']);
      };
    });
  }
}
