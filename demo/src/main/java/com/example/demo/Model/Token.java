package com.example.demo.Model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "token_verificacion")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Token {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "correo", nullable = false, length = 100)
    private String correo;
    
    @Column(nullable = false, length = 10)
    private String token;
    
    @Column(name = "expira_en", nullable = false)
    private LocalDateTime expiraEn;
    
    @Column(nullable = false)
    private Boolean usado = false;
    
    @Column(name = "creado_en", nullable = false, updatable = false)
    private LocalDateTime creadoEn;

    @PrePersist
    public void prePersist() {
        if (this.creadoEn == null) {
            this.creadoEn = LocalDateTime.now();
        }
    }
}
