package com.example.demo.Controller;

import java.security.Principal;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.DTO.ReagendarSolicitud;
import com.example.demo.DTO.ReporteCitaSolicitud;
import com.example.demo.DTO.RespuestaApi;
import com.example.demo.Service.CitaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/veterinario")
@RequiredArgsConstructor
@PreAuthorize("hasRole('VETERINARIO')")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class VeterinarioControlador {
    
    private final CitaService CitaService;
    
    @GetMapping("/citas/pendientes")
    public ResponseEntity<RespuestaApi> citasPendientes() {
        return ResponseEntity.ok(CitaService.citasPendientes());
    }
    
    @GetMapping("/citas/aceptadas")
    public ResponseEntity<RespuestaApi> citasAceptadas(@RequestParam String estado) {  // ← String
        return ResponseEntity.ok(CitaService.citasAceptadas(estado));
    }
    
    @PatchMapping("/citas/{id}/aceptar")
    public ResponseEntity<RespuestaApi> aceptarCita(@PathVariable Integer id) {
        return ResponseEntity.ok(CitaService.aceptarCita(id));
    }
    
    @PatchMapping("/citas/{id}/rechazar")
    public ResponseEntity<RespuestaApi> rechazarCita(@PathVariable Integer id) {
        return ResponseEntity.ok(CitaService.rechazarCita(id));
    }
    
    @PatchMapping("/citas/{id}/reagendar")
    public ResponseEntity<RespuestaApi> reagendarCita(
            @PathVariable Integer id,
            @Valid @RequestBody ReagendarSolicitud solicitud,
            Principal principal) {
        String correoVet = principal.getName();
        return ResponseEntity.ok(CitaService.reagendarCita(id, solicitud, correoVet));
    }
    
    @PatchMapping("/citas/{id}/reporte")
    public ResponseEntity<RespuestaApi> agregarReporte(
            @PathVariable Integer id,
            @Valid @RequestBody ReporteCitaSolicitud solicitud) {
        return ResponseEntity.ok(CitaService.agregarReporte(id, solicitud));
    }
    
    @PatchMapping("/citas/{id}/atender")
    public ResponseEntity<RespuestaApi> marcarAtendida(@PathVariable Integer id) {
        return ResponseEntity.ok(CitaService.marcarAtendida(id));
    }
}