package com.example.demo.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

// DTO para cambiar la contrasena desde el perfil
// La contrasena actual funciona como token de verificacion de identidad
@Data
public class CambiarContrasenaSolicitud {

    // Contrasena actual del usuario, requerida como verificacion de identidad
    @NotBlank(message = "La contrasena actual es obligatoria")
    private String contrasenaActual;

    // Nueva contrasena con los mismos requisitos que el registro
    @NotBlank(message = "La nueva contrasena es obligatoria")
    @Size(min = 8, max = 20, message = "La contrasena debe tener entre 8 y 20 caracteres")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?\":{}|<>]).{8,20}$",
             message = "La contrasena debe tener mayuscula, minuscula, digito y caracter especial")
    private String nuevaContrasena;
}
