package com.example.demo.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.Model.Token;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {

    Optional<Token> findTopByCorreoAndUsadoFalseOrderByCreadoEnDesc(String correo);

    Optional<Token> findTopByCorreoAndTokenAndUsadoFalseOrderByCreadoEnDesc(String correo, String token);

    boolean existsByCorreoAndUsadoFalse(String correo);
}
