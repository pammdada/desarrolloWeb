package com.example.demo.Service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.DTO.RespuestaApi;
import com.example.demo.DTO.VeterinarioSolicitud;
import com.example.demo.Model.Usuario;
import com.example.demo.Repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VeterinarioService {
    
    private final UsuarioRepository usuarioRepositorio;
    private final PasswordEncoder codificadorPassword;

    public List<Usuario> listarVeterinarios(String estado) {
        if (estado != null) {
            return usuarioRepositorio.findByRolAndEstadoVet("VETERINARIO", estado);
        }
        return usuarioRepositorio.findByRol("VETERINARIO");
    }

    @Transactional
    public RespuestaApi crearVeterinario(VeterinarioSolicitud solicitud) {
        if (usuarioRepositorio.existsByCorreo(solicitud.getCorreo())) {
            return RespuestaApi.error("El correo ya está registrado");
        }

        Usuario veterinario = Usuario.builder()
                .correo(solicitud.getCorreo())
                .contrasena(codificadorPassword.encode(solicitud.getContrasena()))
                .nombre(solicitud.getNombre())
                .apellidos(solicitud.getApellidos())
                .especialidad(solicitud.getEspecialidad())
                .sueldo(solicitud.getSueldo())
                .telefono(solicitud.getTelefono())
                .rol("VETERINARIO")
                .estadoVet("ACTIVO")  
                .activo(true)
                .build();
        
        usuarioRepositorio.save(veterinario);
        
        return RespuestaApi.exito("Veterinario registrado exitosamente", null);
    }

    @Transactional
    public RespuestaApi actualizarVeterinario(Integer id, VeterinarioSolicitud solicitud) {
        Usuario veterinario = usuarioRepositorio.findById(id).orElse(null);
        
        if (veterinario == null || !"VETERINARIO".equals(veterinario.getRol())) {
            return RespuestaApi.error("Veterinario no encontrado");
        }
        
        veterinario.setNombre(solicitud.getNombre());
        veterinario.setApellidos(solicitud.getApellidos());
        veterinario.setEspecialidad(solicitud.getEspecialidad());
        veterinario.setSueldo(solicitud.getSueldo());
        veterinario.setTelefono(solicitud.getTelefono());
        
        usuarioRepositorio.save(veterinario);
        
        return RespuestaApi.exito("Veterinario actualizado exitosamente", null);
    }
    
    @Transactional
    public RespuestaApi despedirVeterinario(Integer id) {
        Usuario veterinario = usuarioRepositorio.findById(id).orElse(null);
        
        if (veterinario == null || !"VETERINARIO".equals(veterinario.getRol())) {
            return RespuestaApi.error("Veterinario no encontrado");
        }
        
        veterinario.setEstadoVet("INACTIVO");
        usuarioRepositorio.save(veterinario);
        
        return RespuestaApi.exito("Veterinario despedido exitosamente", null);
    }

    public RespuestaApi obtenerPorId(Integer id) {
        Usuario veterinario = usuarioRepositorio.findById(id).orElse(null);
        
        if (veterinario == null || !"VETERINARIO".equals(veterinario.getRol())) {
            return RespuestaApi.error("Veterinario no encontrado");
        }
        
        return RespuestaApi.exito("Veterinario encontrado", veterinario);
    }
}