package com.example.demo.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Model.Cita;
import com.example.demo.Repositories.CitaRepository;

@Service
public class CitasService {
    
    @Autowired
    private CitaRepository citaRepository;

    public Cita guardar(Cita cita) {
        if (cita.getEstado() == null) {
            cita.setEstado("Pendiente");
        }
        return citaRepository.save(cita);
    }

    public List<Cita> obtenerCitasPendientes() {
        return citaRepository.findByEstado("Pendiente");
    }


}
