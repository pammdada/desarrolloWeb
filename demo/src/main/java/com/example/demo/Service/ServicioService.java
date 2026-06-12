package com.example.demo.Service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.demo.Model.Servicio;
import com.example.demo.Repository.ServicioRepository;
import com.example.demo.DTO.RespuestaApi;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServicioService {

    private final ServicioRepository servicioRepository;

    @Transactional(readOnly = true)
    public List<Servicio> listarServiciosActivos() {
        return servicioRepository.findByActivoTrue();
    }

    @Transactional
    public RespuestaApi crearServicio(Servicio servicio) {
        servicio.setActivo(true);
        servicioRepository.save(servicio);
        return RespuestaApi.exito("Servicio creado correctamente", servicio);
    }
}