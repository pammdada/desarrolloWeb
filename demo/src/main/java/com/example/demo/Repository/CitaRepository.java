package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.Model.Cita;

@Repository
public interface CitaRepository extends JpaRepository<Cita, Integer> {
    
    List<Cita> findByEstadoAndVeterinarioIsNull(String estado);
    
    List<Cita> findByVeterinarioIdAndEstado(Integer veterinarioId, String estado);
    
    List<Cita> findByClienteId(Integer clienteId);
    
    List<Cita> findByEstado(String estado);
    
    boolean existsByMascotaIdAndFechaAndHora(Integer mascotaId, java.time.LocalDate fecha, java.time.LocalTime hora);

    long countByVeterinarioId(Integer veterinarioId);
}
