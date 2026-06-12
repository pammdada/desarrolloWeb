package com.example.demo.Service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.DTO.RespuestaApi;
import com.example.demo.Model.Venta;
import com.example.demo.Repository.VentaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VentaService {

    private final VentaRepository ventaRepository;

    // Registro de venta
    @Transactional
    public RespuestaApi registrarVenta(Venta venta) {
        if ("LOCAL".equalsIgnoreCase(venta.getMetodoPago())) {
            venta.setEstadoPago("PENDIENTE");
        } else {
            venta.setEstadoPago("PAGADA");
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