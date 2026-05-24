package com.example.demo.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RespuestaApi {
    
    private Boolean exito;
    private String mensaje;
    private Object datos;
    
    public static RespuestaApi exito(String mensaje, Object datos) {
        return RespuestaApi.builder()
                .exito(true)
                .mensaje(mensaje)
                .datos(datos)
                .build();
    }
    
    public static RespuestaApi error(String mensaje) {
        return RespuestaApi.builder()
                .exito(false)
                .mensaje(mensaje)
                .datos(null)
                .build();
    }
}
