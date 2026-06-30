import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class Pdf {

  constructor() { }

  /**
   * Genera y descarga la Receta Médica Corporativa en formato A5
   * @param cita Objeto completo de la cita médica
   */
  // DISEÑO DEL PDF
  descargarRecetaPDF(cita: any): void {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' }); // Formato A5

    // 1. OBTENER EL STRING COMPLETO EN MINÚSCULAS PARA BUSCAR SIN ERRORES
    // Concatenamos reporte y problema por si tu backend guardó la receta en cualquiera de los dos campos
    const textoOriginal = `${cita.reporte || ''} \n ${cita.problema || ''}`;
    const textoMinusculas = textoOriginal.toLowerCase();

    let diagnosticoTexto = '';
    let recetaTexto = '';

    // 2. ENCONTRAR LAS POSICIONES CLAVE EN EL STRING
    const posDiag = textoMinusculas.indexOf('diagnóstico:');
    const posReceta = textoMinusculas.indexOf('receta:');

    // 3. CORTAR QUIRÚRGICAMENTE LAS SECCIONES
    if (posDiag !== -1 && posReceta !== -1) {
      // Si existen ambos prefijos en la cadena
      if (posDiag < posReceta) {
        // Lo normal: Diagnóstico va antes que Receta
        diagnosticoTexto = textoOriginal.substring(posDiag, posReceta);
        recetaTexto = textoOriginal.substring(posReceta);
      } else {
        // Caso inverso por si acaso
        recetaTexto = textoOriginal.substring(posReceta, posDiag);
        diagnosticoTexto = textoOriginal.substring(posDiag);
      }
    } else if (posDiag !== -1) {
      // Solo se encontró la palabra Diagnóstico
      diagnosticoTexto = textoOriginal.substring(posDiag);
    } else if (posReceta !== -1) {
      // Solo se encontró la palabra Receta
      recetaTexto = textoOriginal.substring(posReceta);
    } else {
      // Si no encontró ninguna palabra clave, usamos los campos por defecto de la BD
      diagnosticoTexto = cita.reporte || '';
      recetaTexto = cita.problema || '';
    }

    // ==========================================
    // 🧹 LIMPIEZA ABSOLUTA DE REPETICIONES Y PIPES
    // ==========================================
    // Reemplazamos CUALQUIER variante de la palabra (mayúsculas, minúsculas, con o sin tilde, seguidas de dos puntos)
    diagnosticoTexto = diagnosticoTexto
      .replace(/diagnóstico:/gi, '')
      .replace(/diagnostico:/gi, '')
      .replace(/\|/g, '')
      .trim();

    recetaTexto = recetaTexto
      .replace(/receta:/gi, '')
      .replace(/\|/g, '')
      .trim();

    // Control de respaldos por si el texto quedó vacío tras la limpieza
    if (!diagnosticoTexto) diagnosticoTexto = 'Estable en observación clínica.';
    if (!recetaTexto) recetaTexto = 'No se prescribieron medicamentos en esta sesión.';


    // ==========================================
    // 🎨 MAQUETACIÓN ESTÉTICA PROFESIONAL (A5)
    // ==========================================

    // Encabezado Corporativo Verde Veterinario
    doc.setFillColor(34, 197, 94);
    doc.rect(0, 0, 148, 15, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('🐾 VETERINARIA SAN JOSÉ', 10, 10);

    // Metadata / Sub-encabezado
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Atención Médica Integral | Emergencias 24/7', 10, 22);
    doc.text(`Fecha: ${cita.fecha}`, 105, 22);

    doc.setDrawColor(230, 230, 230);
    doc.line(10, 25, 138, 25);

    // Bloque de Información del Paciente
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(70, 70, 70);
    doc.text(`Paciente: ${cita.mascota?.nombre || 'Paciente'} (${cita.mascota?.tipo || 'Mascota'})`, 10, 32);
    doc.text(`Dueño: ${cita.cliente?.nombre || ''} ${cita.cliente?.apellidos || ''}`, 10, 37);
    doc.text(`Médico Veterinario: Dr(a). ${cita.veterinario?.nombre || 'Especialista'}`, 10, 42);

    doc.line(10, 47, 138, 47);

    // Sección 1: DIAGNÓSTICO EN SU LUGAR
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 197, 94);
    doc.text('DIAGNÓSTICO MÉDICO:', 10, 55);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const txtReporte = doc.splitTextToSize(diagnosticoTexto, 128);
    doc.text(txtReporte, 10, 61);

    // Sección 2: RECETA EN SU LUGAR (Garantizado multilinea)
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 197, 94);
    doc.text('RECETA / TRATAMIENTO:', 10, 85);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const txtReceta = doc.splitTextToSize(recetaTexto, 128);
    doc.text(txtReceta, 10, 91);

    // Pie de Impresión / Firma Estilizada
    doc.setDrawColor(200, 200, 200);
    doc.line(40, 180, 108, 180);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 100, 100);
    doc.text('Firma y Sello del Médico Veterinario', 50, 184);

    // Descarga directa del archivo PDF
    doc.save(`Receta_${cita.mascota?.nombre || 'Mascota'}_${cita.fecha}.pdf`);
  }
}