package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.Model.Servicio;

@Repository
public interface ServicioRepository extends JpaRepository<Servicio, Integer> {    
    List<Servicio> findByActivoTrue();
}