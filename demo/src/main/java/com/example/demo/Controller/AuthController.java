package com.example.demo.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.DTO.LoginSolicitud;
import com.example.demo.DTO.RegistroClienteSolicitud;
import com.example.demo.DTO.RespuestaApi;
import com.example.demo.DTO.VerificarTokenSolicitud;
import com.example.demo.Service.UsuarioService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class AuthController {

    private final UsuarioService usuarioServicio;
    @PostMapping("/registro")
    public ResponseEntity<RespuestaApi> registrar(@Valid @RequestBody RegistroClienteSolicitud solicitud) {
        return ResponseEntity.ok(usuarioServicio.registrarCliente(solicitud));
    }
    @PostMapping("/verificar-token")
    public ResponseEntity<RespuestaApi> verificarToken(@Valid @RequestBody VerificarTokenSolicitud solicitud) {
        return ResponseEntity.ok(usuarioServicio.verificarToken(solicitud));
    }

    @PostMapping("/login")
    public ResponseEntity<RespuestaApi> login(@Valid @RequestBody LoginSolicitud solicitud,
            jakarta.servlet.http.HttpServletRequest request,
            jakarta.servlet.http.HttpServletResponse response) {
        return ResponseEntity.ok(usuarioServicio.login(solicitud, request, response));
    }

    @PostMapping("/logout")
    public ResponseEntity<RespuestaApi> logout(HttpServletRequest request, HttpServletResponse response) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }
        return ResponseEntity.ok(usuarioServicio.logout());
    }
    @GetMapping("/perfil")
    public ResponseEntity<RespuestaApi> obtenerPerfil() {
        return ResponseEntity.ok(usuarioServicio.obtenerPerfil());
    }
}
