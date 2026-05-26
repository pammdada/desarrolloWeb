package com.example.demo.Service;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.DTO.ActualizarPerfilSolicitud;
import com.example.demo.DTO.CambiarContrasenaSolicitud;
import com.example.demo.DTO.LoginSolicitud;
import com.example.demo.DTO.RegistroClienteSolicitud;
import com.example.demo.DTO.RespuestaApi;
import com.example.demo.DTO.VerificarTokenSolicitud;
import com.example.demo.Model.Token;
import com.example.demo.Model.Usuario;
import com.example.demo.Repository.TokenRepository;
import com.example.demo.Repository.UsuarioRepository;

import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepositorio;
    private final TokenRepository tokenRepositorio;
    private final CorreoService correoServicio;
    private final PasswordEncoder codificadorPassword;

    private final SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();

    private final java.util.Map<String, RegistroClienteSolicitud> registrosPendientes = new java.util.HashMap<>();

    /**
     * Obtiene todos los datos del perfil del usuario autenticado,
     * excluyendo informacion sensible como la contrasena.
     * Usa HashMap mutable para que el controlador pueda agregar campos adicionales.
     */
    public RespuestaApi obtenerPerfilCompleto() {
        // Obtiene el correo del usuario desde la sesion activa de Spring Security
        String correo = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepositorio.findByCorreo(correo).orElse(null);

        if (usuario == null) {
            return RespuestaApi.error("No hay sesion activa");
        }

        // Retorna un HashMap mutable con todos los campos relevantes del perfil
        java.util.Map<String, Object> datos = new java.util.HashMap<>();
        datos.put("id", usuario.getId());
        datos.put("correo", usuario.getCorreo());
        datos.put("nombre", usuario.getNombre());
        datos.put("apellidos", usuario.getApellidos() != null ? usuario.getApellidos() : "");
        datos.put("telefono", usuario.getTelefono() != null ? usuario.getTelefono() : "");
        datos.put("dni", usuario.getDni() != null ? usuario.getDni() : "");
        datos.put("rol", usuario.getRol());
        datos.put("activo", usuario.getActivo());
        datos.put("creadoEn", usuario.getCreadoEn() != null ? usuario.getCreadoEn().toString() : "");

        return RespuestaApi.exito("Perfil obtenido", datos);
    }

    /**
     * Busca el ID de un usuario por su correo.
     * Usado por el controlador para obtener datos relacionados (ej. conteo de mascotas).
     */
    public Integer buscarIdPorCorreo(String correo) {
        Usuario usuario = usuarioRepositorio.findByCorreo(correo).orElse(null);
        return usuario != null ? usuario.getId() : null;
    }

    /**
     * Actualiza los datos editables del perfil del usuario autenticado.
     * Solo se actualizan los campos que vienen en la solicitud.
     */
    @Transactional
    public RespuestaApi actualizarPerfil(ActualizarPerfilSolicitud solicitud) {
        String correo = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepositorio.findByCorreo(correo).orElse(null);

        if (usuario == null) {
            return RespuestaApi.error("No hay sesion activa");
        }

        // Actualiza el nombre si se proporciono uno nuevo
        if (solicitud.getNombre() != null && !solicitud.getNombre().isBlank()) {
            usuario.setNombre(solicitud.getNombre().trim());
        }

        // Actualiza los apellidos si se proporcionaron
        if (solicitud.getApellidos() != null && !solicitud.getApellidos().isBlank()) {
            usuario.setApellidos(solicitud.getApellidos().trim());
        }

        // Actualiza el telefono si se proporciono
        if (solicitud.getTelefono() != null) {
            usuario.setTelefono(solicitud.getTelefono().trim());
        }

        // Actualiza el DNI si se proporciono uno diferente al actual
        if (solicitud.getDni() != null && !solicitud.getDni().equals(usuario.getDni())) {
            // Verifica que el nuevo DNI no este en uso por otro usuario
            if (usuarioRepositorio.existsByDni(solicitud.getDni().trim())) {
                return RespuestaApi.error("El DNI ya esta registrado por otro usuario");
            }
            usuario.setDni(solicitud.getDni().trim());
        }

        usuarioRepositorio.save(usuario);

        // Retorna el perfil actualizado completo
        return obtenerPerfilCompleto();
    }

    /**
     * Cambia la contrasena del usuario autenticado.
     * La contrasena actual se usa como token de verificacion de identidad.
     */
    @Transactional
    public RespuestaApi cambiarContrasena(CambiarContrasenaSolicitud solicitud) {
        String correo = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepositorio.findByCorreo(correo).orElse(null);

        if (usuario == null) {
            return RespuestaApi.error("No hay sesion activa");
        }

        // Verifica que la contrasena actual sea correcta (funciona como token)
        if (!codificadorPassword.matches(solicitud.getContrasenaActual(), usuario.getContrasena())) {
            return RespuestaApi.error("La contrasena actual no es correcta");
        }

        // Actualiza a la nueva contrasena
        usuario.setContrasena(codificadorPassword.encode(solicitud.getNuevaContrasena()));
        usuarioRepositorio.save(usuario);

        return RespuestaApi.exito("Contrasena actualizada exitosamente", null);
    }

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

    public RespuestaApi login(LoginSolicitud solicitud, HttpServletRequest request, HttpServletResponse response) {
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

        // Guardamos el contexto de seguridad en la sesion usando el repositorio oficial
        // (garantiza que Spring Security lo restaure correctamente en peticiones siguientes)
        securityContextRepository.saveContext(
                org.springframework.security.core.context.SecurityContextHolder.getContext(),
                request, response);

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
