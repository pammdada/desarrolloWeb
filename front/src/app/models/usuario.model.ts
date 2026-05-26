// Modelo que representa los datos del perfil del usuario
export interface PerfilUsuario {
  id: number;
  correo: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  dni: string;
  rol: string;
  activo: boolean;
  creadoEn: string;
  totalMascotas: number;
}

// Datos editables del perfil (coincide con ActualizarPerfilSolicitud del backend)
export interface ActualizarPerfilData {
  nombre?: string;
  apellidos?: string;
  telefono?: string;
  dni?: string;
}

// Solicitud de cambio de contrasena (coincide con CambiarContrasenaSolicitud del backend)
export interface CambiarContrasenaData {
  contrasenaActual: string;
  nuevaContrasena: string;
}
