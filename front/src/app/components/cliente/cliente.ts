import { Component, OnInit } from '@angular/core';
import { autenticacion } from '../../services/autenticacion';

@Component({
  selector: 'app-cliente',
  imports: [],
  templateUrl: './cliente.html',
  styleUrl: './cliente.css',
})
export class Cliente implements OnInit {
  nombreUsuario: string = '';

  constructor(private autenticacion: autenticacion) {}

  ngOnInit() {
    const user = this.autenticacion.getCurrentUser();
    if (user) {
      this.nombreUsuario = user.nombre;
    }
  }
}
