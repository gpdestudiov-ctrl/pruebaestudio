/* Central de Gestión Videla — control de acceso por Términos de uso.
   Corre antes de servir cualquier archivo del sitio:
   1. Verifica el token de Cloudflare Access (quién inició sesión).
   2. Si esa cuenta no firmó la versión vigente de los términos, solo muestra
      la página de aceptación; el resto del sitio no se entrega.
   3. La firma se registra en Google Sheets a través de Apps Script, con un
      secreto compartido (TERMS_SECRET) que solo conocen este Worker y el script.
   4. Según el perfil de la persona (perfiles.js) decide qué secciones puede abrir
      y le pasa a la página la lista de tarjetas que tiene que mostrar.
      Los super administradores pueden "ver como" cualquier perfil. */

import { PERFILES, SECCIONES, USUARIOS, PERFIL_POR_DEFECTO, perfilDe } from './perfiles.js';

const COOKIE = 'cg_terminos';
const VERCOMO = 'cg_vercomo';      // perfil elegido por un super administrador para "ver como"
const LIBRES = ['/', '/index.html', '/perfil/', '/acerca/', '/aprendizaje/']; // rutas que ve cualquier perfil (acerca y aprendizaje están en la base)
const PUBLIC_PATHS = new Set(['/assets/site.css', '/assets/terminos.js']); // necesarios para la página de términos

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const user = await verifyAccess(request, env).catch(() => null);
    if (!user || !user.email) return text('Acceso no autorizado.', 403);
    const email = String(user.email).toLowerCase();
    const version = env.TERMS_VERSION;
    if (!env.TERMS_SECRET || !env.APPS_SCRIPT_URL) return text('Falta configurar el sitio (TERMS_SECRET).', 500);

    if (url.pathname === '/api/terminos') {
      if (request.method !== 'POST') return text('Método no permitido', 405);
      return sign(request, env, email, version);
    }

    if (PUBLIC_PATHS.has(url.pathname)) return env.ASSETS.fetch(request);

    // ¿Ya firmó? Primero la cookie firmada; si no está, se consulta la planilla.
    const expected = await cookieValue(env, email, version);
    if (getCookie(request, COOKIE) === expected) return serve(request, env, email, url);

    // Registro propio de firmas (KV): no depende de la planilla.
    let signed = !!(await leerFirma(env, email, version));
    if (!signed) try {
      const r = await callScript(env, { action: 'check', email, version });
      if (!r.ok) throw new Error(r.error || 'check failed');
      signed = !!r.signed;
    } catch (e) {
      return html(errorPage(), 503);
    }
    if (signed) {
      const res = await serve(request, env, email, url);
      const out = new Response(res.body, res);
      out.headers.append('Set-Cookie', setCookie(expected));
      return out;
    }

    const wantsHtml = request.method === 'GET' && (request.headers.get('Accept') || '').includes('text/html');
    if (!wantsHtml) return text('Tenés que aceptar los Términos de uso para acceder.', 403);
    return html(gatePage(email, version), 200);
  }
};

/* ── Perfiles: qué ve cada uno ── */
function quienEs(request, email) {
  const real = perfilDe(email);
  const esSuper = !!PERFILES[real].super;
  const vc = esSuper ? getCookie(request, VERCOMO) : null;
  const efectivo = vc && PERFILES[vc] ? vc : real;
  return { real, esSuper, efectivo, viendoComo: efectivo !== real ? efectivo : null };
}

function puedeVer(pathname, perfil) {
  const p = pathname.endsWith('/') ? pathname : pathname.replace(/\/index\.html$/, '/');
  if (/^\/(perfiles|worker)\.js$|^\/wrangler\.jsonc$/.test(p)) return false;
  if (p.startsWith('/assets/') || LIBRES.includes(p)) return true;
  if (p.startsWith('/admin')) return !!PERFILES[perfil].super;
  const secs = PERFILES[perfil].secciones;
  for (const [id, s] of Object.entries(SECCIONES)) {
    if (!s.ruta) continue;
    const base = s.ruta.replace(/\/$/, '');
    if (p === base || p.startsWith(base + '/')) return secs.includes(id);
  }
  return true; // otros archivos sueltos del sitio
}

async function serve(request, env, email, url) {
  const q = quienEs(request, email);

  if (url.pathname === '/api/vercomo') {
    if (request.method !== 'POST' || !q.esSuper) return text('No autorizado', 403);
    let d = {}; try { d = await request.json(); } catch (e) {}
    const p = PERFILES[d.perfil] && d.perfil !== q.real ? d.perfil : null;
    return json({ ok: true }, 200, { 'Set-Cookie': p
      ? `${VERCOMO}=${p}; Path=/; Max-Age=28800; HttpOnly; Secure; SameSite=Lax`
      : `${VERCOMO}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax` });
  }

  if (url.pathname === '/api/perfil') {
    let firma = await leerFirma(env, email, env.TERMS_VERSION);
    if (!firma) try {
      const r = await callScript(env, { action: 'perfil', email, version: env.TERMS_VERSION });
      if (r && r.ok) firma = r.firma || r.data || null;
    } catch (e) {}
    return json({ ok: true, email, version: env.TERMS_VERSION, perfil: q.real, perfilNombre: PERFILES[q.real].nombre, firmado: true, firma });
  }

  if (url.pathname === '/api/usuarios') {
    if (!PERFILES[q.efectivo].super) return text('No autorizado', 403);
    return json({ ok: true, perfiles: PERFILES, secciones: SECCIONES, usuarios: USUARIOS, porDefecto: PERFIL_POR_DEFECTO });
  }

  if (!puedeVer(url.pathname, q.efectivo)) {
    return new Response(null, { status: 302, headers: { Location: '/', 'Cache-Control': 'no-store' } });
  }

  const res = await env.ASSETS.fetch(request);
  if (!(res.headers.get('Content-Type') || '').includes('text/html')) return res;

  const CG = {
    email,
    perfil: q.efectivo,
    perfilNombre: PERFILES[q.efectivo].nombre,
    perfilEtiqueta: PERFILES[q.efectivo].etiqueta || PERFILES[q.efectivo].nombre,
    secciones: PERFILES[q.efectivo].secciones,
    admin: !!PERFILES[q.efectivo].super,
    super: q.esSuper,
    viendoComo: q.viendoComo,
    perfiles: q.esSuper ? Object.fromEntries(Object.entries(PERFILES).map(([k, v]) => [k, v.nombre])) : null,
  };
  const script = `<script>window.CG=${JSON.stringify(CG).replace(/</g, '\\u003c')};</script>`;
  const out = new HTMLRewriter().on('head', { element(e) { e.append(script, { html: true }); } }).transform(res);
  const h = new Response(out.body, out);
  h.headers.set('Cache-Control', 'no-store');
  return h;
}

async function sign(request, env, email, version) {
  let d;
  try { d = await request.json(); } catch (e) { return json({ ok: false, error: 'Datos inválidos' }, 400); }
  const payload = {
    action: 'sign', email, version,
    nombre: String(d.nombre || '').slice(0, 120),
    dni: String(d.dni || '').replace(/\D/g, '').slice(0, 12),
    domicilio: String(d.domicilio || '').slice(0, 200),
    ciudadFecha: String(d.ciudadFecha || '').slice(0, 120),
  };
  let r;
  try { r = await callScript(env, payload); } catch (e) { return json({ ok: false, error: 'No se pudo registrar' }, 502); }
  if (!r.ok) return json({ ok: false, error: r.error || 'No se pudo registrar' }, 400);
  await guardarFirma(env, email, version, {
    nombre: payload.nombre, dni: payload.dni, domicilio: payload.domicilio, ciudadFecha: payload.ciudadFecha,
    fechaRegistro: new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', hour12: false }),
  });
  return json({ ok: true }, 200, { 'Set-Cookie': setCookie(await cookieValue(env, email, version)) });
}

/* ── Registro de firmas en Workers KV (binding FIRMAS). Clave: firma:<email>|<versión> ── */
async function leerFirma(env, email, version) {
  if (!env.FIRMAS) return null;
  try { return await env.FIRMAS.get(`firma:${email}|${version}`, 'json'); } catch (e) { return null; }
}
async function guardarFirma(env, email, version, data) {
  if (!env.FIRMAS) return;
  try { await env.FIRMAS.put(`firma:${email}|${version}`, JSON.stringify(data)); } catch (e) {}
}

async function callScript(env, body) {
  const r = await fetch(env.APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ ...body, secret: env.TERMS_SECRET }),
    redirect: 'follow',
  });
  return r.json();
}

/* ── Cloudflare Access JWT ── */
let jwks = null, jwksAt = 0;
async function verifyAccess(request, env) {
  const token = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!token) return null;
  const [h, p, s] = token.split('.');
  const header = JSON.parse(b64urlText(h));
  const payload = JSON.parse(b64urlText(p));
  if (!jwks || Date.now() - jwksAt > 3600e3) {
    jwks = (await (await fetch(`${env.ACCESS_TEAM_DOMAIN}/cdn-cgi/access/certs`)).json()).keys;
    jwksAt = Date.now();
  }
  const jwk = jwks.find(k => k.kid === header.kid);
  if (!jwk) { jwks = null; return null; }
  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
  const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64urlBytes(s), new TextEncoder().encode(`${h}.${p}`));
  if (!ok) return null;
  const aud = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!aud.includes(env.ACCESS_AUD)) return null;
  if (payload.iss !== env.ACCESS_TEAM_DOMAIN) return null;
  if (payload.exp && payload.exp * 1000 < Date.now()) return null;
  return payload;
}
function b64urlBytes(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '=';
  return Uint8Array.from(atob(s), c => c.charCodeAt(0));
}
function b64urlText(s) { return new TextDecoder().decode(b64urlBytes(s)); }

/* ── Cookie firmada (HMAC del email + versión) ── */
async function cookieValue(env, email, version) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.TERMS_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${email}|${version}`)));
  return btoa(String.fromCharCode(...mac)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function setCookie(v) { return `${COOKIE}=${v}; Path=/; Max-Age=31536000; HttpOnly; Secure; SameSite=Lax`; }
function getCookie(request, name) {
  const m = (request.headers.get('Cookie') || '').match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'));
  return m ? m[1] : null;
}

/* ── Respuestas ── */
function text(t, status) { return new Response(t, { status, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } }); }
function json(o, status, extra = {}) { return new Response(JSON.stringify(o), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...extra } }); }
function html(body, status) { return new Response(body, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } }); }
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

function shell(inner) {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Términos de uso · Central de Gestión Videla</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Roboto+Condensed:wght@600;700&family=Source+Sans+3:wght@400;600&display=swap">
<link rel="stylesheet" href="/assets/site.css"></head><body class="gate">
<header class="bar"><div class="bar-in"><span class="brand"><span class="brand-mark" aria-hidden="true"></span><span class="brand-word"><b>VIDELA</b><small>Estudio Jurídico</small></span></span><span class="bar-title">Central de Gestión</span></div></header>
${inner}</body></html>`;
}
function gatePage(email, version) {
  return shell(`<div id="terminos" data-email="${esc(email)}" data-version="${esc(version)}"></div><script src="/assets/terminos.js" defer></script>`);
}
function errorPage() {
  return shell(`<main><section class="intro"><h2>No pudimos verificar tu acceso</h2><p>No pudimos comprobar si aceptaste los Términos de uso. Esperá unos segundos y <a href="">volvé a intentar</a>. Si sigue pasando, avisá al Estudio.</p></section></main>`);
}
