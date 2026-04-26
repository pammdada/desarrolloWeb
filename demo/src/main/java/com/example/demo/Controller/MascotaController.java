package com.example.demo.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Model.Mascota;
import com.example.demo.Services.MascotaService;

@RestController
@RequestMapping("/api/cliente/mascotas")
public class MascotaController {

    private final MascotaService mascotaService;

    public MascotaController(MascotaService mascotaService) {
        this.mascotaService = mascotaService;
    }

    @PostMapping("/registrar")
    public ResponseEntity<Mascota> registrarMascota(@RequestBody Mascota mascota) {
        return ResponseEntity.ok(mascotaService.guardarMascota(mascota));
    }

    @GetMapping("/mis-mascotas/{clienteId}")
    public ResponseEntity<List<Mascota>> listarMascotas(@PathVariable Integer clienteId) {
        return ResponseEntity.ok(mascotaService.listarPorCliente(clienteId));
    }
}
