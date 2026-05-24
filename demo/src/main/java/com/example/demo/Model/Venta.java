package com.example.demo.Model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ventas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Venta {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Usuario cliente;
    
    @ManyToOne
    @JoinColumn(name = "cita_id")
    private Cita cita;

    @Column(name = "metodo_pago", nullable = false, length = 30)
    private String metodoPago;
    
    @Column(name = "numero_cuenta", length = 50)
    private String numeroCuenta;
    
    @Column(name = "qr_url", length = 255)
    private String qrUrl;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    @Column(name = "estado_pago", nullable = false, length = 20)
    private String estadoPago = "PENDIENTE";
    
    @Column(name = "fecha", updatable = false)
    private LocalDateTime fecha = LocalDateTime.now();
}