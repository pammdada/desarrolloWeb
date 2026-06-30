package com.example.demo.Controller;

import java.security.Principal;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.DTO.ActualizarPerfilSolicitud;
import com.example.demo.DTO.CambiarContrasenaSolicitud;
import com.example.demo.DTO.CitaSolicitud;
import com.example.demo.DTO.MascotaSolicitud;
import com.example.demo.DTO.RespuestaApi;
import com.example.demo.Service.CitaService;
import com.example.demo.Service.MascotaService;
import com.example.demo.Service.UsuarioService;
import com.example.demo.Service.VeterinarioService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cliente")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@PreAuthorize("hasRole('CLIENTE')") 
public class ClienteController {
    
    private final MascotaService mascotaServicio;
    private final CitaService citaServicio;
    private final UsuarioService usuarioServicio;

        @PostMapping("/mascotas")
    public ResponseEntity<RespuestaApi> registrarMascota(
            @Valid @RequestBody MascotaSolicitud solicitud,
            Principal principal) {
        
        String correo = principal.getName();
        return ResponseEntity.ok(mascotaServicio.registrarMascota(solicitud, correo));
    }
    
    @GetMapping("/mascotas")
    public ResponseEntity<RespuestaApi> listarMisMascotas(Principal principal) {
        String correo = principal.getName();
        return ResponseEntity.ok(mascotaServicio.listarMisMascotas(correo));
    }

    @PostMapping("/citas")
    public ResponseEntity<RespuestaApi> solicitarCita(
            @Valid @RequestBody CitaSolicitud solicitud,
            Principal principal) {
        
        String correo = principal.getName();
        return ResponseEntity.ok(citaServicio.solicitarCita(solicitud, correo));
    }
    
    @GetMapping("/citas")
    public ResponseEntity<RespuestaApi> misCitas(Principal principal) {
        String correo = principal.getName();
        return ResponseEntity.ok(citaServicio.misCitas(correo));
    }
    
    @PatchMapping("/citas/{id}/aceptar-reagendacion")
    public ResponseEntity<RespuestaApi> aceptarReagendacion(@PathVariable Integer id) {
        return ResponseEntity.ok(citaServicio.aceptarReagendacion(id));
    }
    
    @PatchMapping("/citas/{id}/rechazar-reagendacion")
    public ResponseEntity<RespuestaApi> rechazarReagendacion(@PathVariable Integer id) {
        return ResponseEntity.ok(citaServicio.rechazarReagendacion(id));
    }

    @GetMapping("/perfil")
    public ResponseEntity<RespuestaApi> obtenerPerfil(Principal principal) {
        RespuestaApi respuesta = usuarioServicio.obtenerPerfilCompleto();

        if (respuesta.getExito() && respuesta.getDatos() instanceof java.util.Map) {
            @SuppressWarnings("unchecked")
            java.util.Map<String, Object> datos = (java.util.Map<String, Object>) respuesta.getDatos();
            Integer userId = usuarioServicio.buscarIdPorCorreo(principal.getName());
            if (userId != null) {
                long totalMascotas = mascotaServicio.contarMascotasPorCliente(userId);
                datos.put("totalMascotas", totalMascotas);
            }
        }

        return ResponseEntity.ok(respuesta);
    }

    @PutMapping("/perfil")
    public ResponseEntity<RespuestaApi> actualizarPerfil(
            @Valid @RequestBody ActualizarPerfilSolicitud solicitud) {
        return ResponseEntity.ok(usuarioServicio.actualizarPerfil(solicitud));
    }

    @PutMapping("/perfil/cambiar-contrasena")
    public ResponseEntity<RespuestaApi> cambiarContrasena(
            @Valid @RequestBody CambiarContrasenaSolicitud solicitud) {
        return ResponseEntity.ok(usuarioServicio.cambiarContrasena(solicitud));
    }

}