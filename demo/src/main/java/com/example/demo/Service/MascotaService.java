package com.example.demo.Service;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.DTO.MascotaSolicitud;
import com.example.demo.DTO.RespuestaApi;
import com.example.demo.Model.Mascota;
import com.example.demo.Model.Usuario;
import com.example.demo.Repository.MascotaRepository;
import com.example.demo.Repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MascotaService {
    
    private final MascotaRepository mascotaRepository;
    private final UsuarioRepository usuarioRepository;
    
    @Transactional
    public RespuestaApi registrarMascota(MascotaSolicitud solicitud, String correo) {
        // Usamos el correo recibido del Principal en vez de SecurityContextHolder
        Usuario cliente = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        
        if (!"CLIENTE".equals(cliente.getRol())) {
            return RespuestaApi.error("Solo los clientes pueden registrar mascotas");
        }
        
        if (mascotaRepository.existsByClienteIdAndNombre(cliente.getId(), solicitud.getNombre())) {
            return RespuestaApi.error("Ya tienes una mascota con ese nombre");
        }
        
        Mascota mascota = Mascota.builder()
                .cliente(cliente)
                .nombre(solicitud.getNombre())
                .tipo(solicitud.getTipo().toUpperCase()) //  Se convierte a mayúsculas para uniformidad
                .raza(solicitud.getRaza())
                .edad(solicitud.getEdad())
                .fotoUrl(solicitud.getFotoUrl())
                .build();
        
        mascotaRepository.save(mascota);
        
        // Retornamos solo datos seguros (evita serializar la entidad con @ManyToOne)
        return RespuestaApi.exito("Mascota registrada exitosamente",
                java.util.Map.of("id", mascota.getId(), "nombre", mascota.getNombre()));
    }
    
    public RespuestaApi listarMisMascotas(String correo) {
        Usuario cliente = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        
        List<Mascota> mascotas = mascotaRepository.findByClienteId(cliente.getId());
        
        return RespuestaApi.exito("Mascotas obtenidas", mascotas);
    }
}