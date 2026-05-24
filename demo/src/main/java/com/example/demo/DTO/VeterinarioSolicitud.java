package com.example.demo.DTO;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VeterinarioSolicitud {
    
    @NotBlank
    private String correo;
    
    @NotBlank
    private String contrasena;
    
    @NotBlank
    private String nombre;
    
    @NotBlank
    private String apellidos;
    
    private String especialidad;
    
    @NotNull
    private BigDecimal sueldo;
    
    private String telefono;
}