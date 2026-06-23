package com.example.demo.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.DTO.RespuestaApi;
import com.example.demo.Model.Cita;
import com.example.demo.Repository.CitaRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/citas")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@PreAuthorize("hasAnyRole('VETERINARIO', 'ADMIN')")
public class CitaController {

    private final CitaRepository citaRepository;

    @PutMapping("/atender/{id}")
    public ResponseEntity<RespuestaApi> finalizarAtencion(
            @PathVariable Integer id, 
            @RequestBody Cita datosClínicos) {
        
        final Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));
        
        cita.setReporte("DIAGNÓSTICO: " + datosClínicos.getReporte() + " | RECETA: " + datosClínicos.getProblema());
        cita.setEstado("ATENDIDA"); 
        
        citaRepository.save(cita);
        return ResponseEntity.ok(RespuestaApi.exito("Atención médica registrada e historial actualizado", cita));
    }
}
