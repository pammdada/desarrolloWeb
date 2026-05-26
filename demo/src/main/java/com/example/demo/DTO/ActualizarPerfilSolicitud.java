package com.example.demo.DTO;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

// DTO con los campos que el usuario puede modificar desde la seccion de perfil
@Data
public class ActualizarPerfilSolicitud {

    // Nombre del usuario, solo letras y espacios permitidos
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$", message = "El nombre solo puede contener letras y espacios")
    private String nombre;

    // Apellidos del usuario, solo letras y espacios
    @Size(max = 100, message = "Los apellidos no pueden exceder 100 caracteres")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$", message = "Los apellidos solo pueden contener letras y espacios")
    private String apellidos;

    // Telefono, solo digitos entre 7 y 15 caracteres
    @Pattern(regexp = "^[0-9]{7,15}$", message = "El telefono debe contener solo digitos (7-15)")
    private String telefono;

    // DNI, exactamente 8 digitos
    @Pattern(regexp = "^[0-9]{8}$", message = "El DNI debe tener 8 digitos")
    private String dni;
}
