package com.example.demo.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.Model.Cita;

@Repository
public interface CitaRepository extends JpaRepository<Cita, Integer> {
    List<Cita> findByEstado(String estado);
}