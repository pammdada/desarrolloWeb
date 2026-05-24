package com.example.demo.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReporteCitaSolicitud {
    
    @NotBlank(message = "El reporte no puede estar vacío")
    private String reporte;
}