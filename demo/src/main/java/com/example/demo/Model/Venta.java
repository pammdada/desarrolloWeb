package com.example.demo.Model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "ventas")
@Data
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private LocalDateTime fecha = LocalDateTime.now();

    @Column(nullable = false)
    private Double total;

    @Column(name = "metodo_pago", nullable = false)
    private String metodoPago;

    @Column(name = "numero_cuenta")
    private String numeroCuenta;

    @Column(name = "estado_pago", nullable = false)
    private String estadoPago;

    @Column(name = "cliente_id", nullable = false)
    private Integer clienteId;

    @Column(name = "cita_id")
    private Integer citaId;
}