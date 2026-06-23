package com.example.demo.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.DTO.CitaSolicitud;
import com.example.demo.DTO.ReagendarSolicitud;
import com.example.demo.DTO.ReporteCitaSolicitud;
import com.example.demo.DTO.RespuestaApi;
import com.example.demo.Model.Cita;
import com.example.demo.Model.Usuario;
import com.example.demo.Repository.CitaRepository;
import com.example.demo.Repository.MascotaRepository;
import com.example.demo.Repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CitaService {

    private final CitaRepository citaRepository;
    private final UsuarioRepository usuarioRepository;
    private final MascotaRepository mascotaRepository;

    // ========== CLIENTE ==========
    @Transactional
    public RespuestaApi solicitarCita(CitaSolicitud solicitud, String correo) {
        correo = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario cliente = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        if (!"CLIENTE".equals(cliente.getRol())) {
            return RespuestaApi.error("Solo los clientes pueden solicitar citas");
        }

        var mascota = mascotaRepository.findById(solicitud.getMascotaId())
                .orElseThrow(() -> new RuntimeException("Mascota no encontrada"));

        if (!mascota.getCliente().getId().equals(cliente.getId())) {
            return RespuestaApi.error("La mascota no pertenece al cliente");
        }

        if (!solicitud.getFecha().isAfter(LocalDate.now())) {
            return RespuestaApi.error("La fecha debe ser desde manana en adelante");
        }

        LocalTime horaMinima = LocalTime.of(9, 0);
        LocalTime horaMaxima = LocalTime.of(22, 0);
        if (solicitud.getHora().isBefore(horaMinima) || solicitud.getHora().isAfter(horaMaxima)) {
            return RespuestaApi.error("La hora debe estar entre 09:00 y 22:00");
        }

        if (citaRepository.existsByMascotaIdAndFechaAndHora(
                solicitud.getMascotaId().intValue(), solicitud.getFecha(), solicitud.getHora())) {
            return RespuestaApi.error("Ya tienes una cita agendada para esa mascota en esa fecha y hora");
        }

        Cita cita = Cita.builder()
                .cliente(cliente)
                .mascota(mascota)
                .fecha(solicitud.getFecha())
                .hora(solicitud.getHora())
                .problema(solicitud.getProblema())
                .estado("PENDIENTE")
                .build();

        citaRepository.save(cita);

        return RespuestaApi.exito("Cita solicitada exitosamente", cita);
    }

    public RespuestaApi misCitas(String correo) {
        correo = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario cliente = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        List<Cita> citas = citaRepository.findByClienteId(cliente.getId());
        return RespuestaApi.exito("Citas obtenidas", citas);
    }

    @Transactional
    public RespuestaApi aceptarReagendacion(Integer citaId) {
        Cita cita = citaRepository.findById(citaId)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));

        if (!"REAGENDADA".equals(cita.getEstado())) {
            return RespuestaApi.error("La cita no esta en estado reagendada");
        }

        cita.setFecha(cita.getNuevaFecha());
        cita.setHora(cita.getNuevaHora());
        cita.setEstado("ACEPTADA");
        cita.setNuevaFecha(null);
        cita.setNuevaHora(null);

        citaRepository.save(cita);

        return RespuestaApi.exito("Reagendacion aceptada", cita);
    }

    @Transactional
    public RespuestaApi rechazarReagendacion(Integer citaId) {
        Cita cita = citaRepository.findById(citaId)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));

        if (!"REAGENDADA".equals(cita.getEstado())) {
            return RespuestaApi.error("La cita no esta en estado reagendada");
        }

        cita.setEstado("RECHAZADA");
        citaRepository.save(cita);

        return RespuestaApi.exito("Reagendacion rechazada", cita);
    }

    // ========== VETERINARIO ==========
    public RespuestaApi citasPendientes() {
        List<Cita> citas = citaRepository.findByEstadoAndVeterinarioIsNull("PENDIENTE");

        String correo = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario veterinario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Veterinario no encontrado"));

        List<Cita> citasFiltradas = citas.stream()
                .filter(c -> {
                    if (c.getRechazadaPor() == null) {
                        return true;
                    }
                    return !c.getRechazadaPor().contains(veterinario.getId().toString());
                })
                .toList();

        return RespuestaApi.exito("Citas pendientes", citasFiltradas);
    }

    public RespuestaApi citasAceptadas(String estado) {
        String correo = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario veterinario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Veterinario no encontrado"));

        List<Cita> citas = citaRepository.findByVeterinarioIdAndEstado(veterinario.getId(), estado);
        return RespuestaApi.exito("Citas obtenidas", citas);
    }

    @Transactional
    public RespuestaApi aceptarCita(Integer citaId) {
        String correo = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario veterinario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Veterinario no encontrado"));

        Cita cita = citaRepository.findById(citaId)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));

        if (!"PENDIENTE".equals(cita.getEstado())) {
            return RespuestaApi.error("La cita no esta pendiente");
        }
        cita.setVeterinario(veterinario);
        cita.setEstado("ACEPTADA");
        citaRepository.save(cita);

        return RespuestaApi.exito("Cita aceptada", cita);
    }

    @Transactional
    public RespuestaApi rechazarCita(Integer citaId) {
        String correo = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario veterinario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Veterinario no encontrado"));

        Cita cita = citaRepository.findById(citaId)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));

        if (!"PENDIENTE".equals(cita.getEstado())) {
            return RespuestaApi.error("La cita no esta pendiente");
        }

        String rechazos = cita.getRechazadaPor();
        if (rechazos == null || rechazos.isEmpty()) {
            rechazos = veterinario.getId().toString();
        } else {
            rechazos += "," + veterinario.getId();
        }
        cita.setRechazadaPor(rechazos);

        citaRepository.save(cita);

        return RespuestaApi.exito("Cita rechazada", cita);
    }

    @Transactional
    public RespuestaApi reagendarCita(Integer citaId, ReagendarSolicitud solicitud, String correoVet) {
        Usuario veterinario = usuarioRepository.findByCorreo(correoVet)
            .orElseThrow(() -> new RuntimeException("Veterinario no encontrado"));
        Cita cita = citaRepository.findById(citaId)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));

        if (!"PENDIENTE".equals(cita.getEstado()) && !"ACEPTADA".equals(cita.getEstado())) {
            return RespuestaApi.error("No se puede reagendar esta cita");
        }

        if (!solicitud.getNuevaFecha().isAfter(LocalDate.now())) {
            return RespuestaApi.error("La nueva fecha debe ser desde manana");
        }

        LocalTime horaMinima = LocalTime.of(8, 0);
        LocalTime horaMaxima = LocalTime.of(23, 0);
        if (solicitud.getNuevaHora().isBefore(horaMinima) || solicitud.getNuevaHora().isAfter(horaMaxima)) {
            return RespuestaApi.error("La hora debe estar entre 08:00 y 23:00");
        }
        if (cita.getVeterinario() != null) {
        if (!cita.getVeterinario().getCorreo().equals(correoVet)) {
            throw new RuntimeException("No eres el veterinario asignado a esta cita");
        }
    } else {
        cita.setVeterinario(veterinario);
    }

        cita.setNuevaFecha(solicitud.getNuevaFecha());
        cita.setNuevaHora(solicitud.getNuevaHora());
        cita.setFechaSolicitudReagendacion(java.time.LocalDateTime.now());
        cita.setEstado("REAGENDADA");

        citaRepository.save(cita);

        return RespuestaApi.exito("Reagendacion solicitada al cliente", cita);
    }

    @Transactional
    public RespuestaApi agregarReporte(Integer citaId, ReporteCitaSolicitud solicitud) {
        Cita cita = citaRepository.findById(citaId)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));

        cita.setReporte(solicitud.getReporte());
        citaRepository.save(cita);

        return RespuestaApi.exito("Reporte agregado", cita);
    }

    @Transactional
    public RespuestaApi marcarAtendida(Integer citaId) {
        Cita cita = citaRepository.findById(citaId)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));

        if (!"ACEPTADA".equals(cita.getEstado())) {
            return RespuestaApi.error("Solo se pueden atender citas aceptadas");
        }

        cita.setEstado("ATENDIDA");
        citaRepository.save(cita);

        return RespuestaApi.exito("Cita marcada como atendida", cita);
    }
}
