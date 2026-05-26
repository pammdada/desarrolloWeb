// Funciones compartidas de validacion de contrasena
// Reutilizadas por Registro y Perfil para mantener consistencia y evitar duplicacion

export interface PasswordChecks {
  longitud: boolean;
  mayuscula: boolean;
  minuscula: boolean;
  numero: boolean;
  especial: boolean;
}

// Verifica todos los requisitos de seguridad y retorna el estado de cada uno
export function verificarRequisitosContrasena(pw: string): PasswordChecks {
  return {
    longitud: pw.length >= 8,
    mayuscula: /[A-Z]/.test(pw),
    minuscula: /[a-z]/.test(pw),
    numero: /[0-9]/.test(pw),
    especial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw)
  };
}

// Valida la contrasena contra todos los requisitos
// Retorna null si es valida, o un mensaje de error si no cumple
export function validarContrasena(pw: string): string | null {
  if (pw.length < 8) return 'La contrasena debe tener al menos 8 caracteres';
  if (!/[A-Z]/.test(pw)) return 'La contrasena debe tener al menos una mayuscula';
  if (!/[a-z]/.test(pw)) return 'La contrasena debe tener al menos una minuscula';
  if (!/[0-9]/.test(pw)) return 'La contrasena debe tener al menos un numero';
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw))
    return 'La contrasena debe tener al menos un caracter especial';
  return null; // contrasena valida
}
