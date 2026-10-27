/* Central de Gestión Videla — Términos de uso y acuerdo de confidencialidad.
   Esta página la entrega el Worker (worker.js) solo a quien inició sesión y
   todavía no firmó la versión vigente. Al firmar, el Worker registra los datos
   en Google Sheets y habilita el acceso al resto del sitio. */
(function(){
const root = document.getElementById('terminos');            // página de aceptación (la entrega el Worker)
const docEl = document.getElementById('documento-firmado');   // "Mi perfil": copia del documento firmado
if(!root && !docEl) return;
const src = root || docEl;
const ID = { email: src.dataset.email || '' };
const CONFIG = { version: src.dataset.version || '', fechaVersion: '19 oct 2026' };

const TEXT = `
<p>Antes de acceder a la Central de Gestión te pedimos que leas y aceptes estos términos, que tienen validez de acuerdo entre vos y el Estudio Jurídico Videla (en adelante, "el Estudio").</p>
<p>Estos términos aplican a toda persona que tenga una cuenta autorizada para acceder a la Central de Gestión o que, por cualquier motivo, esté relacionada con el Estudio y acceda a su información, sus sistemas o sus dispositivos, sin importar el vínculo que tenga con él (en adelante, "el Usuario" o "vos").</p>

<h3>Qué es la Central de Gestión</h3>
<p>Es el portal interno del Estudio que reúne los accesos a sistemas, portales, modelos, repositorios e información de trabajo, incluido el sistema de gestión de expedientes (Case Tracking). Todo lo que se ve, se carga o se descarga desde ahí o de los enlaces a los que dirige, es información del Estudio y de sus clientes.</p>
<p>El acceso se hace con una cuenta de Google que el Estudio autoriza previamente. Solo puede entrar la cuenta registrada por el Estudio para cada persona.</p>

<h3>Tu cuenta es personal e intransferible</h3>
<p>Tu cuenta de Google es la que te identifica ante la Central de Gestión. Todo lo que se haga con ella se considera hecho por vos. Por eso:</p>
<ul>
<li>No compartas la contraseña de tu cuenta de Google ni sus códigos de verificación con nadie, tampoco con otros integrantes del Estudio. Si alguien necesita un acceso, debe solicitarlo al Estudio.</li>
<li>No uses la cuenta de otra persona, ni siquiera con su permiso.</li>
<li>Usá una contraseña robusta y única en tu cuenta de Google (con letras, números y caracteres especiales) y cambiala periódicamente.</li>
<li>Mantené activada la verificación en dos pasos de tu cuenta de Google.</li>
<li>Mantené actualizados los datos de recuperación de la cuenta (teléfono y correo alternativo) y asegurate de que sean tuyos.</li>
<li>Usá solo la cuenta que el Estudio registró para vos. Si querés cambiarla, pedilo antes al Estudio.</li>
<li>No otorgues a aplicaciones o extensiones de terceros acceso a esa cuenta si eso puede exponer información del Estudio.</li>
<li>No guardes contraseñas en papeles, notas compartidas ni navegadores de equipos que no sean tuyos.</li>
<li>Cerrá sesión al terminar, sobre todo en equipos compartidos o fuera de tu lugar de trabajo habitual.</li>
<li>Si sospechás que alguien conoce tu contraseña o entró a tu cuenta de Google, cambiala y avisá al Estudio en el momento.</li>
</ul>

<h3>Confidencialidad y secreto profesional</h3>
<p>Toda la información a la que accedas a través de la Central de Gestión o debido a tu relación con el Estudio es confidencial. Esto incluye datos de clientes y de contrapartes, expedientes, escritos, estrategias, documentación, honorarios, modelos, procesos internos y datos del equipo.</p>
<p>Te comprometés a:</p>
<ul>
<li>Usar esa información solo para las tareas que el Estudio te asigne.</li>
<li>No divulgarla, comentarla ni entregarla a terceros, incluidos familiares, amigos o colegas de otros estudios, por ningún medio.</li>
<li>Respetar el secreto profesional que rige la profesión de abogado, que alcanza también a quienes colaboran con ella.</li>
</ul>
<p>Esta obligación sigue vigente después de que termine tu relación con el Estudio, sin límite de tiempo, mientras la información siga siendo confidencial.</p>

<h3>Comunicación con clientes</h3>
<p>Toda interacción con clientes del Estudio debe hacerse únicamente por los canales que el Estudio autorice. No contactes a un cliente directamente sin autorización expresa.</p>

<h3>Uso de la información y datos personales</h3>
<p>En el Estudio tratamos datos personales, algunos de ellos sensibles. Para protegerlos:</p>
<ul>
<li>No copies, descargues, reenvíes ni guardes información del Estudio en cuentas, correos, nubes o dispositivos personales, incluidos el Drive, el Gmail y cualquier otro servicio de la cuenta de Google con la que accedés, aunque esa cuenta sea tuya, salvo que el Estudio lo autorice. Podés trabajar con los recursos que el Estudio comparta con vos, respetando sus permisos.</li>
<li>No cargues información de clientes o expedientes en herramientas externas no autorizadas por el Estudio, incluidas aplicaciones de inteligencia artificial, traductores en línea o conversores de archivos.</li>
<li>Accedé solo a la información que necesitás para tu trabajo.</li>
<li>Cumplí con la Ley 25.326 de Protección de Datos Personales y con la normativa que la complemente o reemplace.</li>
</ul>

<h3>Correo electrónico y herramientas colaborativas</h3>
<ul>
<li>Si interactuás con clientes, no utilices la cuenta de Google con la que accedés a la Central de Gestión para enviar o recibir información, salvo que el Estudio lo autorice. En estos casos deberás utilizar cuentas de correo institucionales.</li>
<li>Si además tenés un correo institucional del Estudio, usalo únicamente para temas laborales.</li>
<li>No reenvíes información sensible sin necesidad ni autorización.</li>
<li>Usá Drive, carpetas y demás herramientas de colaboración respetando los permisos y protocolos que el Estudio haya establecido.</li>
<li>Desconfiá de correos o mensajes que pidan contraseñas, códigos o datos de clientes, aunque parezcan venir del Estudio. Ante la duda, consultá antes de responder.</li>
</ul>

<h3>Dispositivos, archivos e impresión</h3>
<ul>
<li>Entrá a la Central de Gestión solo desde dispositivos con bloqueo de pantalla, sistema actualizado y antivirus actualizado.</li>
<li>Evitá las redes wifi públicas o abiertas. Si no queda otra, no abras documentos de clientes.</li>
<li>No abras links ni archivos de origen dudoso, y no instales programas de origen dudoso en el equipo con el que trabajás.</li>
<li>No imprimas información de clientes fuera del Estudio sin autorización.</li>
<li>No uses medios de almacenamiento externos (pendrives, discos externos, etc.) sin revisión previa del Estudio.</li>
<li>Cuidá la trazabilidad del manejo de expedientes y documentación digital.</li>
</ul>

<h3>Redes sociales y comunicaciones públicas</h3>
<ul>
<li>No publiques ni menciones casos o clientes en redes sociales, ni siquiera de forma indirecta o sin nombres.</li>
<li>Toda publicación o mención al Estudio necesita aprobación previa.</li>
<li>Está prohibido subir capturas de pantalla, listas de clientes, correos internos u otros materiales del Estudio sin consentimiento formal.</li>
</ul>

<h3>Incidentes de seguridad</h3>
<p>Si perdés un dispositivo con acceso al Estudio, si enviaste información a quien no correspondía, si abriste un enlace sospechoso, si detectás malware o un virus, si recibís alertas de Google por un inicio de sesión desconocido, si perdés el teléfono con el que verificás tu cuenta, si notás cambios que no hiciste en la configuración de tu cuenta o cualquier otro movimiento extraño, avisá de inmediato al área de coordinación del Estudio y, como máximo, dentro de las 24 horas. Igual que con los errores de trabajo, lo que trae problemas no es el incidente sino no comunicarlo a tiempo.</p>

<h3>Registro de actividad y propiedad de la información</h3>
<p>Para proteger la información de los clientes, el Estudio registra los accesos y la actividad en la Central de Gestión y en los sistemas vinculados (usuario, fecha, hora y acciones realizadas). El registro alcanza solo a la actividad en la Central de Gestión y en los sistemas del Estudio; el Estudio no accede al resto de tu cuenta de Google. Aceptás que estos registros se usen para controles de seguridad y, si hiciera falta, como prueba ante un incumplimiento. Los sistemas y cuentas del Estudio son herramientas de trabajo, no espacios personales.</p>
<p>La información, los documentos, los modelos y los trabajos que produzcas para el Estudio son del Estudio o de sus clientes, según corresponda.</p>

<h3>Fin de la relación, responsabilidad e incumplimiento</h3>
<p>Cuando termine tu relación con el Estudio, por cualquier motivo, se retira la autorización de tu cuenta de Google en la Central de Gestión y en los recursos compartidos (carpetas, archivos, permisos). La cuenta sigue siendo tuya, pero te comprometés a devolver la documentación que tengas, a eliminar toda copia de información del Estudio que haya quedado en tus dispositivos o cuentas, a no conservar ni utilizar la información obtenida, y a confirmarlo por escrito si se te pide.</p>
<p>Sos responsable de todo daño o perjuicio derivado del incumplimiento de estos términos, incluidas las pérdidas o filtraciones atribuibles a tu conducta, sea intencional o negligente.</p>
<p>Compartir credenciales, divulgar información confidencial o usarla para fines ajenos al Estudio es una falta grave. Según su gravedad, el incumplimiento puede dar lugar a un llamado de atención, a la restricción o suspensión inmediata del acceso, a la terminación de la relación con el Estudio y a las acciones legales que correspondan, incluido el reclamo por daños y perjuicios, sin perjuicio de las responsabilidades penales previstas para la violación de secretos y el acceso indebido a sistemas informáticos.</p>

<h3>Cambios en estos términos</h3>
<p>El Estudio puede actualizar estos términos. Cuando haya cambios, te lo vamos a avisar y te vamos a pedir que los aceptes de nuevo al ingresar.</p>

<h3>Ley aplicable y jurisdicción</h3>
<p>Este acuerdo se rige por las leyes de la República Argentina. Cualquier conflicto se somete a los tribunales ordinarios de la Ciudad Autónoma de Buenos Aires.</p>
`;

function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function todayISO(){const d=new Date();d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().slice(0,10)}
function fmtDate(iso){const [y,m,d]=iso.split('-');return `${d}/${m}/${y}`}

function overlay(){
  const o=document.createElement('div');
  o.className='terms';o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');o.setAttribute('aria-labelledby','terms-title');
  document.body.appendChild(o);document.documentElement.classList.add('terms-open');
  return o;
}

function showForm(o,id){
  o.innerHTML=`<div class="terms-card" tabindex="-1">
    <header class="terms-head">
      <small>Central de Gestión · Estudio Jurídico Videla · Versión ${esc(CONFIG.version)} · ${esc(CONFIG.fechaVersion)}</small>
      <h2 id="terms-title">Términos de uso y acuerdo de confidencialidad</h2>
    </header>
    <div class="terms-body">${TEXT}</div>
    <form class="terms-form" novalidate>
      <h3>Aceptación</h3>
      <div class="terms-fields">
        <label>Nombre y apellido<input name="nombre" autocomplete="name" required maxlength="120"></label>
        <label>DNI<input name="dni" inputmode="numeric" required pattern="[0-9.\\s]{7,12}" maxlength="12" placeholder="Sin puntos ni espacios"></label>
        <label class="wide">Domicilio<input name="domicilio" autocomplete="street-address" required maxlength="200"></label>
        <label>Ciudad<input name="ciudad" autocomplete="address-level2" required maxlength="80"></label>
        <label>Fecha<input name="fecha" type="date" required value="${todayISO()}"></label>
      </div>
      <label class="terms-check"><input type="checkbox" name="acepto" required>
        <span>Leí y acepto los Términos de uso y el Acuerdo de confidencialidad de la Central de Gestión del Estudio Jurídico Videla. Declaro que los datos consignados son verdaderos, que entiendo que mi cuenta de Google es personal, que no voy a compartirla con nadie y que la información a la que accedo es confidencial.</span></label>
      <p class="terms-fine">Al aceptar estos términos, el sistema registra tus datos, el correo de tu cuenta de Google (<b>${esc(id.email)}</b>), la fecha, la hora y la versión de estos términos. Esta aceptación electrónica vale como tu conformidad expresa con este acuerdo.</p>
      <p class="terms-error" role="alert" hidden></p>
      <button type="submit" class="terms-btn">Acepto y firmo</button>
    </form>
  </div>`;
  const f=o.querySelector('form'), err=o.querySelector('.terms-error'), btn=o.querySelector('button');
  o.querySelector('.terms-card').focus({preventScroll:true});
  f.addEventListener('submit',async ev=>{
    ev.preventDefault();err.hidden=true;
    if(!f.checkValidity()){err.textContent='Completá todos los datos y marcá la casilla de aceptación.';err.hidden=false;f.reportValidity();return}
    const v=Object.fromEntries(new FormData(f));
    const payload={
      nombre:v.nombre.trim(), dni:v.dni.replace(/\D/g,''), domicilio:v.domicilio.trim(),
      ciudadFecha:`${v.ciudad.trim()}, ${fmtDate(v.fecha)}`
    };
    btn.disabled=true;btn.textContent='Enviando…';
    try{
      const r=await fetch('/api/terminos',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify(payload)});
      const j=await r.json();
      if(!j.ok) throw new Error(j.error||'Error');
      o.querySelector('.terms-card').innerHTML=`<div class="terms-done"><h2>¡Listo, gracias!</h2><p>Tu aceptación quedó registrada.</p><button type="button" class="terms-btn">Entrar a la Central</button></div>`;
      const b=o.querySelector('.terms-btn');b.focus();b.addEventListener('click',()=>location.reload());
    }catch(e){
      err.textContent='No pudimos registrar tu aceptación. Revisá tu conexión y probá de nuevo; si sigue fallando, avisá al Estudio.';
      err.hidden=false;btn.disabled=false;btn.textContent='Acepto y firmo';
    }
  });
}

/* Copia del documento firmado (Mi perfil). Los datos llegan en data-* desde /api/perfil. */
function showDoc(el){
  const d=el.dataset, v=k=>d[k]?esc(d[k]):'<span class="tile-note">No disponible</span>';
  el.innerHTML=`<header class="terms-head">
      <small>Central de Gestión · Estudio Jurídico Videla · Versión ${esc(CONFIG.version)} · ${esc(CONFIG.fechaVersion)}</small>
      <h2>Términos de uso y acuerdo de confidencialidad</h2>
    </header>
    <div class="terms-body">${TEXT}</div>
    <div class="firma">
      <h3>Aceptación</h3>
      <p><b>Nombre y apellido:</b> ${v('nombre')}</p>
      <p><b>DNI:</b> ${v('dni')}</p>
      <p><b>Domicilio:</b> ${v('domicilio')}</p>
      <p><b>Ciudad y fecha:</b> ${v('ciudadFecha')}</p>
      <p><b>Cuenta de Google:</b> ${esc(ID.email)}</p>
      <p><b>Registrado el:</b> ${v('fechaRegistro')}</p>
    </div>`;
}

if(root) showForm(overlay(),ID); else showDoc(docEl);
window.CG_mostrarDocumento=()=>showDoc(docEl);
})();
