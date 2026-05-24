package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.Model.Mascota;

@Repository
public interface MascotaRepository extends JpaRepository<Mascota, Long> {

    List<Mascota> findByClienteId(Integer clienteId);

    boolean existsByClienteIdAndNombre(Integer clienteId, String nombre);
}