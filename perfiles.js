/* Central de Gestión Videla — PERFILES Y USUARIOS
   ───────────────────────────────────────────────
   Acá se asigna qué ve cada persona. Este archivo NO se publica en el sitio:
   lo lee solo el Worker. Para sumar a alguien, agregá una línea en USUARIOS
   con su mail (en minúsculas) y la clave del perfil. */

/* Secciones (cada una es una tarjeta de la home; algunas además son una página del sitio). */
export const SECCIONES = {
  'acerca':        { nombre: 'Acerca de',                          ruta: '/acerca/' },
  'central-inicios': { nombre: 'Central de Inicios' },
  'ganancias':     { nombre: 'Profesionales: Ganancias',           ruta: '/ganancias/' },
  'seg-social':    { nombre: 'Profesionales: Seguridad Social',    ruta: '/seguridad-social/' },
  'atencion':      { nombre: 'Atención al Cliente' },
  'carpeta-inicios': { nombre: 'Carpeta Inicios' },
  'case-tracking': { nombre: 'Case Tracking' },
  'ventas':        { nombre: 'Portal Ventas',                      ruta: '/comercial/' },
  'pjn':           { nombre: 'PJN Consultas' },
  'webmail':       { nombre: 'Webmail Estudio' },
  'seguimiento':   { nombre: 'Gestiones Especiales: Seguimiento' },
  'cobranzas':     { nombre: 'Portal Cobranzas' },
  'aprendizaje':   { nombre: 'Canal de Aprendizaje',               ruta: '/aprendizaje/' },
};

const BASE = ['acerca', 'aprendizaje'];
const TODO = Object.keys(SECCIONES);

/* Perfiles: qué secciones ve cada uno. */
export const PERFILES = {
  base:       { nombre: 'Base (todos)',                        secciones: BASE },
  prof_a:     { nombre: 'Profesionales A · Seguridad Social',  secciones: [...BASE, 'seg-social'] },
  prof_b:     { nombre: 'Profesionales B · Ganancias',         secciones: [...BASE, 'ganancias'] },
  prof_c:     { nombre: 'Profesionales C · Mix (SS + Ganancias)', secciones: [...BASE, 'seg-social', 'ganancias'] },
  ventas:     { nombre: 'Vendedoras',                          secciones: [...BASE, 'ventas'] },
  admin:      { nombre: 'Plataforma administrativa',           secciones: TODO },
  superadmin: { nombre: 'Super administrador',                 secciones: TODO, super: true },
};

/* Perfil para quien entra y todavía no está en la lista. */
export const PERFIL_POR_DEFECTO = 'base';

/* Personas → perfil. Mail en minúsculas. */
export const USUARIOS = {
  // ── Super administradores (ven todo y pueden "ver como" cualquier perfil)
  'joaquinavidela@gmail.com': 'superadmin',
  'gpd.estudiov@gmail.com':   'superadmin',
  'diego@somosfuco.com.ar':   'superadmin',   // Diego Moscato

  // ── Plataforma administrativa: Lucas / Adriel / Florencia / Malvina / Diego / Joaqui / etc.
  // 'lucas@...':     'admin',
  // 'adriel@...':    'admin',
  // 'florencia@...': 'admin',
  // 'malvina@...':   'admin',

  // ── Vendedoras: Vanesa / Patricia
  // 'vanesa@...':   'ventas',
  // 'patricia@...': 'ventas',

  // ── Profesionales A (solo Seguridad Social): Dalila
  // 'dalila@...': 'prof_a',

  // ── Profesionales B (solo Ganancias): el resto de los profesionales
  // 'nombre@...': 'prof_b',

  // ── Profesionales C (Mix): Sabrina / Soledad
  // 'sabrina@...': 'prof_c',
  // 'soledad@...': 'prof_c',
};

export function perfilDe(email) {
  const p = USUARIOS[String(email || '').toLowerCase()];
  return PERFILES[p] ? p : PERFIL_POR_DEFECTO;
}
