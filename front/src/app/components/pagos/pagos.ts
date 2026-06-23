import { Component, OnInit } from '@angular/core';
import { ServicioService, Servicio } from '../../services/Servicios/servicios'; 
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagos',
  imports: [DecimalPipe, FormsModule, CommonModule],
  templateUrl: './pagos.html',
  styleUrl: './pagos.css'
})
export class Pagos implements OnInit {
  servicios: Servicio[] = [];
  servicioSeleccionado: Servicio | null = null;

  mostrarModalPago: boolean = false;
  metodoSeleccionado: string = ''; 
  
  // Formularios de Pago
  datosTarjeta = { numero: '', nombre: '', expiracion: '', cvc: '' };
  numeroCuentaClinica: string = 'BCP: 191-98765432-0-99 (CCI: 00219119876543209995)';
  voucherBase64: string = '';

  constructor(
    private servicioService: ServicioService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.cargarServicios();
    const usuarioAc = localStorage.getItem('currentUser');

    if (usuarioAc) {
      const usuario = JSON.parse(usuarioAc);
      const cliente = usuario.id;
    }
  }

  cargarServicios(): void {
    this.servicioService.listarServicios().subscribe({
      next: (res) => { if (res.exito) this.servicios = res.datos; },
      error: () => Swal.fire('Error', 'No se pudieron cargar los servicios', 'error')
    });
  }

  abrirPasarela(servicio: Servicio): void {
    this.servicioSeleccionado = servicio;
    this.mostrarModalPago = true;
    this.metodoSeleccionado = '';
    this.voucherBase64 = '';
  }

  cerrarPasarela(): void {
    this.mostrarModalPago = false;
    this.servicioSeleccionado = null;
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.voucherBase64 = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  procesarPago(): void {
    if (!this.metodoSeleccionado) {
      Swal.fire('Atención', 'Selecciona un método de pago', 'warning');
      return;
    }

    

    // Datos paa enviar a Java
    const objetoVenta: any = {
      total: this.servicioSeleccionado?.precio,
      metodoPago: this.metodoSeleccionado,
      clienteId: null,
      citaId: null,
      tarjeta: null,
      voucher: null,
    };

    if (this.metodoSeleccionado === 'TARJETA') {
    objetoVenta.tarjeta = {
      numeroTarjeta: this.datosTarjeta.numero,
      expiracion: this.datosTarjeta.expiracion
    };
  }

  
  if (this.metodoSeleccionado === 'TRANSACCION') {
    objetoVenta.voucher = {
      imagenBase64: this.voucherBase64
    };
  }

    this.http.post('http://localhost:8080/api/ventas/procesar', objetoVenta, { withCredentials: true })
      .subscribe({
        next: (res: any) => {
          if (res.exito) {
            this.cerrarPasarela();
            if (this.metodoSeleccionado === 'LOCAL') {
              Swal.fire('Ticket Generado', 'Tu orden está PENDIENTE. Paga en la caja del local al recibir el servicio.', 'info');
            } else {
              Swal.fire('¡Pago Realizado!', 'El pago en línea se procesó con éxito. Estado: PAGADA.', 'success');
            }
            this.cargarServicios(); 
          }
        },
        error: () => Swal.fire('Error', 'No se pudo procesar la transacción', 'error')
      });
  }
}