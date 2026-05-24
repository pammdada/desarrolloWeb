package com.example.demo.Service;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.DTO.LoginSolicitud;
import com.example.demo.DTO.RegistroClienteSolicitud;
import com.example.demo.DTO.RespuestaApi;
import com.example.demo.DTO.VerificarTokenSolicitud;
import com.example.demo.Model.Token;
import com.example.demo.Model.Usuario;
import com.example.demo.Repository.TokenRepository;
import com.example.demo.Repository.UsuarioRepository;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepositorio;
    private final TokenRepository tokenRepositorio;
    private final CorreoService correoServicio;
    private final PasswordEncoder codificadorPassword;

    private final java.util.Map<String, RegistroClienteSolicitud> registrosPendientes = new java.util.HashMap<>();

    @Transactional
    public RespuestaApi registrarCliente(RegistroClienteSolicitud solicitud) {
        String correoNormalizado = solicitud.getCorreo().trim().toLowerCase();
        solicitud.setCorreo(correoNormalizado);

        if (usuarioRepositorio.existsByCorreo(correoNormalizado)) {
            return RespuestaApi.error("El email ya está registrado");
        }

        String token = String.format("%06d", new Random().nextInt(999999));

        Token tokenV = Token.builder()
                .correo(correoNormalizado)
                .token(token)
                .expiraEn(LocalDateTime.now().plusMinutes(15))
                .usado(false)
                .creadoEn(LocalDateTime.now())
                .build();
        tokenRepositorio.save(tokenV);

        registrosPendientes.put(correoNormalizado, solicitud);

        String mensaje = "Se ha enviado un código de verificación a tu email";
        Object datos = null;

        try {
            correoServicio.enviarCorreoVerificacion(
                    solicitud.getCorreo(),
                    token,
                    solicitud.getNombres()
            );
        } catch (Exception ex) {
            System.err.println("ERROR: No se pudo enviar el correo de verificación: " + ex.getMessage());
            mensaje = "Registro creado. No se pudo enviar el correo, usa este código para verificar:";
            datos = java.util.Map.of("token", token);
        }

        return RespuestaApi.exito(mensaje, datos);
    }

    @Transactional
    public RespuestaApi verificarToken(VerificarTokenSolicitud solicitud) {
        String correoNormalizado = solicitud.getCorreo().trim().toLowerCase();
        solicitud.setCorreo(correoNormalizado);
        String tokenIngresado = solicitud.getToken().trim();
        solicitud.setToken(tokenIngresado);

        Token tokenGuardado = tokenRepositorio
                .findTopByCorreoAndTokenAndUsadoFalseOrderByCreadoEnDesc(correoNormalizado, tokenIngresado)
                .orElse(null);

        if (tokenGuardado == null) {
            boolean hayTokensPendientes = tokenRepositorio.existsByCorreoAndUsadoFalse(correoNormalizado);
            if (hayTokensPendientes) {
                return RespuestaApi.error("Código incorrecto");
            }
            return RespuestaApi.error("No hay token pendiente para este email");
        }

        if (tokenGuardado.getExpiraEn().isBefore(LocalDateTime.now())) {
            return RespuestaApi.error("El código ha expirado. Solicita uno nuevo");
        }

        RegistroClienteSolicitud datosRegistro = registrosPendientes.get(solicitud.getCorreo());
        if (datosRegistro == null) {
            return RespuestaApi.error("Datos de registro no encontrados");
        }

        Usuario usuario = Usuario.builder()
                .correo(datosRegistro.getCorreo())
                .contrasena(codificadorPassword.encode(datosRegistro.getContrasena()))
                .nombre(datosRegistro.getNombres())
                .apellidos(datosRegistro.getApellidos())
                .telefono(datosRegistro.getTelefono())
                .dni(datosRegistro.getDni())
                .rol("CLIENTE")
                .activo(true)
                .build();
        usuarioRepositorio.save(usuario);

        tokenGuardado.setUsado(true);
        tokenRepositorio.save(tokenGuardado);

        registrosPendientes.remove(solicitud.getCorreo());

        return RespuestaApi.exito("Registro completado exitosamente", null);
    }

    public RespuestaApi login(LoginSolicitud solicitud, HttpServletRequest request) {
        System.out.println("=== LOGIN DEBUG ===");
        System.out.println("Correo recibido: [" + solicitud.getCorreo() + "]");
        System.out.println("Contrasena recibida: [" + solicitud.getContrasena() + "]");

        String correoNormalizado = solicitud.getCorreo().trim().toLowerCase();
        solicitud.setCorreo(correoNormalizado);

        Usuario usuario = usuarioRepositorio.findByCorreo(correoNormalizado)
                .orElse(null);

        if (usuario == null) {
            System.out.println("ERROR: Usuario no encontrado");
            return RespuestaApi.error("Credenciales incorrectas");
        }

        System.out.println("Usuario encontrado: " + usuario.getCorreo());
        System.out.println("Activo: " + usuario.getActivo());
        System.out.println("Hash en BD: " + usuario.getContrasena());

        boolean matches = codificadorPassword.matches(
                solicitud.getContrasena(),
                usuario.getContrasena()
        );
        System.out.println("Password match: " + matches);

        if (!usuario.getActivo()) {
            System.out.println("ERROR: Usuario inactivo");
            return RespuestaApi.error("Credenciales incorrectas");
        }

        if (!matches) {
            System.out.println("ERROR: Password no coincide");
            return RespuestaApi.error("Credenciales incorrectas");
        }

        String rolSinPrefijo = usuario.getRol();
        if (rolSinPrefijo != null && rolSinPrefijo.startsWith("ROLE_")) {
            rolSinPrefijo = rolSinPrefijo.substring(5);
        }

        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(usuario.getCorreo())
                .password(usuario.getContrasena())
                .roles(rolSinPrefijo)
                .build();

        org.springframework.security.core.Authentication authentication
                = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                );

        org.springframework.security.core.context.SecurityContextHolder.getContext()
                .setAuthentication(authentication);

        jakarta.servlet.http.HttpSession session = request.getSession(true);
        session.setAttribute("SPRING_SECURITY_CONTEXT",
                org.springframework.security.core.context.SecurityContextHolder.getContext());

        System.out.println("SUCCESS: Login exitoso");
        return RespuestaApi.exito("Login exitoso", java.util.Map.of(
                "id", usuario.getId(),
                "rol", usuario.getRol(),
                "nombre", usuario.getNombre(),
                "email", usuario.getCorreo()
        ));
    }

    public RespuestaApi logout() {
        return RespuestaApi.exito("Sesión cerrada", null);
    }

    public RespuestaApi obtenerPerfil() {
        String correo = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepositorio.findByCorreo(correo).orElse(null);

        if (usuario == null) {
            return RespuestaApi.error("No hay sesión activa");
        }

        return RespuestaApi.exito("Perfil obtenido", java.util.Map.of(
                "rol", usuario.getRol(),
                "nombre", usuario.getNombre(),
                "email", usuario.getCorreo()
        ));
    }
}
