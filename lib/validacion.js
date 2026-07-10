// Validadores de contenido compartidos entre el cliente (feedback
// inmediato en los formularios) y el servidor (Server Actions).
// No alcanza con validar longitudes: acá se valida QUÉ contiene el campo
// (una ciudad no puede ser "123", una dirección necesita calle y número).

// Letras de cualquier idioma + espacios, puntos, apóstrofos y guiones
const SOLO_LETRAS = /^[\p{L}][\p{L}\s.'’-]*$/u
const TIENE_LETRAS = /\p{L}/u
const TIENE_NUMERO = /\d/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validarNombrePersona(valor, { etiqueta = 'El nombre', requerido = true, min = 2 } = {}) {
  const s = valor?.trim() ?? ''
  if (!s) return requerido ? `${etiqueta} es requerido` : ''
  if (s.length < min) return `Mínimo ${min} caracteres`
  if (!SOLO_LETRAS.test(s)) return 'Solo puede contener letras y espacios'
  return ''
}

export function validarDireccion(valor) {
  const s = valor?.trim() ?? ''
  if (!s) return 'La dirección es requerida'
  if (s.length < 5) return 'Ingresá una dirección completa'
  if (!TIENE_LETRAS.test(s)) return 'Ingresá el nombre de la calle'
  if (!TIENE_NUMERO.test(s)) return 'Ingresá calle y número (ej: San Martín 1250)'
  return ''
}

export function validarCiudad(valor, { etiqueta = 'La ciudad', requerido = true } = {}) {
  const s = valor?.trim() ?? ''
  if (!s) return requerido ? `${etiqueta} es requerida` : ''
  if (s.length < 2) return 'Mínimo 2 caracteres'
  if (!SOLO_LETRAS.test(s)) return 'Solo puede contener letras (ej: Mendoza)'
  return ''
}

export function validarEmail(valor) {
  const s = valor?.trim() ?? ''
  if (!s) return 'El email es requerido'
  if (!EMAIL.test(s)) return 'Ingresá un email válido'
  return ''
}

export function validarPassword(valor) {
  if (!valor) return 'La contraseña es requerida'
  if (valor.length < 6) return 'Mínimo 6 caracteres'
  if (!/[A-Za-z]/.test(valor) || !/[0-9]/.test(valor)) return 'Debe contener letras y números'
  return ''
}

export function validarTelefono(valor, { requerido = false } = {}) {
  const s = valor?.trim() ?? ''
  if (!s) return requerido ? 'El teléfono es requerido' : ''
  if (!/^\+?[\d\s()-]{6,20}$/.test(s) || !TIENE_NUMERO.test(s)) {
    return 'Ingresá un teléfono válido (solo números, ej: 011 4555-1234)'
  }
  return ''
}

export function validarCodigoPostal(valor, { requerido = false } = {}) {
  const s = valor?.trim() ?? ''
  if (!s) return requerido ? 'El código postal es requerido' : ''
  if (!/^[A-Za-z]?\d{4}[A-Za-z]{0,3}$/.test(s)) {
    return 'Ingresá un código postal válido (ej: 5500 o M5500)'
  }
  return ''
}
