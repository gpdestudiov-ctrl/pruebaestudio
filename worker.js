/* Central de Gestión Videla — control de acceso por Términos de uso.
   Corre antes de servir cualquier archivo del sitio:
   1. Verifica el token de Cloudflare Access (quién inició sesión).
   2. Si esa cuenta no firmó la versión vigente de los términos, solo muestra
      la página de aceptación; el resto del sitio no se entrega.
   3. La firma se registra en Google Sheets a través de Apps Script, con un
      secreto compartido (TERMS_SECRET) que solo conocen este Worker y el script. */

const COOKIE = 'cg_terminos';
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
    if (getCookie(request, COOKIE) === expected) return env.ASSETS.fetch(request);

    let signed;
    try {
      const r = await callScript(env, { action: 'check', email, version });
      if (!r.ok) throw new Error(r.error || 'check failed');
      signed = r.signed;
    } catch (e) {
      return html(errorPage(), 503);
    }
    if (signed) {
      const res = await env.ASSETS.fetch(request);
      const out = new Response(res.body, res);
      out.headers.append('Set-Cookie', setCookie(expected));
      return out;
    }

    const wantsHtml = request.method === 'GET' && (request.headers.get('Accept') || '').includes('text/html');
    if (!wantsHtml) return text('Tenés que aceptar los Términos de uso para acceder.', 403);
    return html(gatePage(email, version), 200);
  }
};

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
  return json({ ok: true }, 200, { 'Set-Cookie': setCookie(await cookieValue(env, email, version)) });
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
