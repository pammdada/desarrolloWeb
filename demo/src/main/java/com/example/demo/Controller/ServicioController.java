package com.example.demo.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.DTO.RespuestaApi;
import com.example.demo.Model.Servicio;
import com.example.demo.Service.ServicioService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/servicios")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class ServicioControlador {

    private final ServicioService servicioService;

    // Cualquier usuario logueado (Cliente, Vet, Admin) puede ver la lista
    @GetMapping
    public ResponseEntity<RespuestaApi> listar() {
        return ResponseEntity.ok(RespuestaApi.exito(
                "Servicios obtenidos", 
                servicioService.listarServiciosActivos()
        ));
    }

    // REGLA: Solo el Administrador puede agregar nuevos servicios a la BD
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RespuestaApi> crear(@RequestBody Servicio servicio) {
        return ResponseEntity.ok(servicioService.crearServicio(servicio));
    }
}