package com.example.demo.Services;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.Model.Usuario;
import com.example.demo.Repositories.UsuarioRepository;

@Service
public class AutenticacionService {

    private UsuarioRepository usuarioRepository = null;
    private PasswordEncoder passwordEncoder = null;


    public AutenticacionService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Usuario registrarUsuario(Usuario usuario) {
        String passwordCifrada = passwordEncoder.encode(usuario.getPassword());
        usuario.setPassword(passwordCifrada);
        
        return usuarioRepository.save(usuario);
    }
    
    public Usuario login(String email, String password) {
    Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    if (passwordEncoder.matches(password, usuario.getPassword())) {
        return usuario;
    } else {
        throw new RuntimeException("Contraseña incorrecta");
    }
}
}