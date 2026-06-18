package com.example.demo.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.DTO.RespuestaApi;
import com.example.demo.DTO.VeterinarioSolicitud;
import com.example.demo.Service.VeterinarioService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class AdminController {
    
    private final VeterinarioService veterinarioServicio;
    
    @GetMapping("/veterinarios")
    public ResponseEntity<RespuestaApi> listarVeterinarios(
            @RequestParam(required = false) String estado) { 
        return ResponseEntity.ok(RespuestaApi.exito(
                "Veterinarios obtenidos", 
                veterinarioServicio.listarVeterinarios(estado)
        ));
    }
    
    @PostMapping("/veterinarios")
    public ResponseEntity<RespuestaApi> crearVeterinario(@Valid @RequestBody VeterinarioSolicitud solicitud) {
        return ResponseEntity.ok(veterinarioServicio.crearVeterinario(solicitud));
    }
    
    @PutMapping("/veterinarios/{id}")
    public ResponseEntity<RespuestaApi> actualizarVeterinario(
            @PathVariable Integer id,
            @Valid @RequestBody VeterinarioSolicitud solicitud) {
        return ResponseEntity.ok(veterinarioServicio.actualizarVeterinario(id, solicitud));
    }
    
    @DeleteMapping("/veterinarios/{id}")
    public ResponseEntity<RespuestaApi> despedirVeterinario(@PathVariable Integer id) {
        return ResponseEntity.ok(veterinarioServicio.despedirVeterinario(id));
    }
    
    @GetMapping("/veterinarios/{id}")
    public ResponseEntity<RespuestaApi> obtenerVeterinario(@PathVariable Integer id) {
        return ResponseEntity.ok(veterinarioServicio.obtenerPorId(id));
    }
}