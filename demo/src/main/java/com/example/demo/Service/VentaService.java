package com.example.demo.Service;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.DTO.RespuestaApi;
import com.example.demo.Model.Usuario;
import com.example.demo.Model.Venta;
import com.example.demo.Repository.UsuarioRepository;
import com.example.demo.Repository.VentaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VentaService {

    private final VentaRepository ventaRepository;
    private final UsuarioRepository usuarioRepository;

    // Registro de venta
    @Transactional
    public RespuestaApi registrarVenta(Venta venta) {
        String emailLogueado = SecurityContextHolder.getContext().getAuthentication().getName();

        Usuario usuario = usuarioRepository.findByCorreo(emailLogueado)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado en sesión"));

        venta.setClienteId((int) usuario.getId().longValue()); 

        if ("LOCAL".equalsIgnoreCase(venta.getMetodoPago())) {
            venta.setEstadoPago("PENDIENTE");
            venta.setTarjeta(null);
            venta.setVoucher(null);
        } else {
            venta.setEstadoPago("PAGADA");
            if ("TRANSACCION".equalsIgnoreCase(venta.getMetodoPago())) {
                venta.setTarjeta(null);
                if (venta.getVoucher() == null || venta.getVoucher().getImagenBase64() == null) {
                return RespuestaApi.error("Debe adjuntar la captura del voucher");
            }
            } else if ("TARJETA".equalsIgnoreCase(venta.getMetodoPago())) {
                venta.setVoucher(null);
                if (venta.getTarjeta() == null || venta.getTarjeta().getNumeroTarjeta() == null) {
                return RespuestaApi.error("Datos de tarjeta incompletos");
            }
            }
        }

        Venta ventaGuardada = ventaRepository.save(venta);
        return RespuestaApi.exito("Procesando registro de venta", ventaGuardada);
    }

    // Cobro en local
    @Transactional
    public RespuestaApi cobrarEnLocal(Long ventaId) {
        Venta venta = ventaRepository.findById(ventaId)
                .orElseThrow(() -> new RuntimeException("La venta especificada no existe"));

        venta.setEstadoPago("PAGADA");
        ventaRepository.save(venta);

        return RespuestaApi.exito("Cobro procesado con éxito en caja. Venta PAGADA.", venta);
    }

    @Transactional(readOnly = true)
    public List<Venta> listarVentasPorCliente(Integer clienteId) {
        return ventaRepository.findByClienteId(clienteId);
    }
}
