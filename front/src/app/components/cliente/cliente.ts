import { Component, OnInit } from '@angular/core';
import { autenticacion } from '../../services/Autenticacion/autenticacion';
import {RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cliente',
  imports: [CommonModule, RouterModule],
  standalone: true,
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
