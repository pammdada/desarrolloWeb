package com.example.demo.Controller;

import java.security.Principal;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.DTO.CitaSolicitud;
import com.example.demo.DTO.MascotaSolicitud;
import com.example.demo.DTO.RespuestaApi;
import com.example.demo.Service.CitaService;
import com.example.demo.Service.MascotaService;

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
}