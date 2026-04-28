package com.example.demo.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Model.Cita;
import com.example.demo.Services.CitasService;

@RestController
@RequestMapping("/api/citas")
@CrossOrigin(origins = "http://localhost:4200")
public class CitasController {

    @Autowired
    private CitasService citasService;

    @PostMapping("/registrar")
    public ResponseEntity<Cita> RegistrarCita(@RequestBody Cita cita) {
        Cita nuevaCita = citasService.guardar(cita);
        return ResponseEntity.ok(nuevaCita);
    }

    @GetMapping("/pendientes")
    public List<Cita> listarPendientes() {
        return citasService.obtenerCitasPendientes("PENDIENTE");
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<Cita> actualizarEstado(
            @PathVariable Integer id,
            @RequestBody Map<String, String> body) {

        String nuevoEstado = body.get("estado");
        Cita citaActualizada = citasService.cambiarEstadoCita(id, nuevoEstado);
        return ResponseEntity.ok(citaActualizada);
    }

}
