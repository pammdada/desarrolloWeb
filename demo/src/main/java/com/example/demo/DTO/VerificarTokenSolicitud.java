package com.example.demo.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VerificarTokenSolicitud {
    
    @NotBlank
    @Email
    private String correo;
    
    @NotBlank(message = "El token es obligatorio")
    private String token;
}
