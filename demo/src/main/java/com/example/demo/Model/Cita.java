package com.example.demo.Model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

/**
 * ENTIDAD CITA
 * 
 * USO FRONTEND:
 * - Cliente solicita cita
 * - Veterinario acepta/rechaza/reagenda
 * - Veterinario marca como atendida
 */
@Entity
@Table(name = "citas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cita {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Usuario cliente;
    
    @ManyToOne
    @JoinColumn(name = "mascota_id", nullable = false)
    private Mascota mascota;
    
    @ManyToOne
    @JoinColumn(name = "veterinario_id")
    private Usuario veterinario;
    
    @Column(nullable = false)
    private LocalDate fecha;
    
    @Column(nullable = false)
    private LocalTime hora;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String problema;
    
    @Column(nullable = false, length = 20)
    private String estado = "PENDIENTE";
    
    @Column(columnDefinition = "TEXT")
    private String reporte;
    
    @Column(name = "rechazada_por", length = 255)
    private String rechazadaPor;
    
    @Column(name = "nueva_fecha")
    private LocalDate nuevaFecha;
    
    @Column(name = "nueva_hora")
    private LocalTime nuevaHora;
    
    @Column(name = "fecha_solicitud_reagendacion")
    private LocalDateTime fechaSolicitudReagendacion;
    
    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn = LocalDateTime.now();
}