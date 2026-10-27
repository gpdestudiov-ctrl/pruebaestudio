/* Central de Gestión Videla — script compartido.
   Cada página define window.ACCESOS (tarjetas) y, opcionalmente, window.DOCS (lista de documentos).
   url: null = enlace pendiente. Las URLs que empiezan con "/" son páginas de este sitio. */
(function(){
const S='stroke="var(--icon-stroke)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"';
const SR=S.replace('var(--icon-stroke)','var(--icon-red)');
const F='var(--icon-fill)', B='var(--icon-blue)', R='var(--icon-red)', W='var(--surface)';
const ICONS = {
  court:`<path d="M3 8 12 3 21 8Z" fill="${F}" ${S}/><path d="M5 11v7m7-7v7m7-7v7M4 21h16" fill="none" ${S}/>`,
  mail:`<rect x="3" y="6" width="18" height="15" rx="3" fill="${F}" ${S}/><path d="m4 8 8 6 8-6" fill="none" ${S}/><circle cx="19" cy="5" r="3" fill="${B}" ${S}/>`,
  deal:`<path d="M5 2.5h14a2.5 2.5 0 0 1 2.5 2.5v11a2.5 2.5 0 0 1-2.5 2.5H10L5 22v-3.5A2.5 2.5 0 0 1 2.5 16V5A2.5 2.5 0 0 1 5 2.5Z" fill="${F}" ${S}/><path d="M12 5.5v10M7 7.5h10m-7 8h4" fill="none" ${S}/><path d="m7 7.5-2.2 4q2.2 3 4.4 0Z" fill="${B}" ${S}/><path d="m17 7.5-2.2 4q2.2 3 4.4 0Z" fill="${B}" ${S}/>`,
  case:`<rect x="7" y="2" width="14" height="18" rx="2" fill="${B}" ${S}/><rect x="3" y="5" width="14" height="17" rx="2" fill="${W}" ${S}/><path d="m6 10 1 1 2-2m-3 7 1 1 2-2" fill="none" ${SR}/><path d="M12 10h2m-2 6h2" fill="none" ${S}/>`,
  folder:`<path d="M3 6a2 2 0 0 1 2-2h5l3 3h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" fill="${F}" ${S}/><circle cx="20" cy="6" r="3" fill="${R}" ${S}/>`,
  social:`<circle cx="10" cy="7" r="4" fill="${F}" ${S}/><path d="M2 21v-1a8 6 0 0 1 16 0v1Z" fill="${B}" ${S}/><path d="M19.5 3v6m-3-3h6" fill="none" ${SR}/>`,
  tax:`<rect x="3" y="2" width="15" height="20" rx="2" fill="${W}" ${S}/><rect x="6" y="5" width="8" height="3" rx="1" fill="${F}" ${S}/><path d="M6 11h8m-8 3h4" fill="none" ${S}/><path d="M6 18c1-3 2-3 2 0 1-2 2-2 3-1" fill="none" ${S}/><path d="m14 17 6-6q.7-.7 1.4 0l.6.6q.7.7 0 1.4l-6 6-3 1Z" fill="${B}" ${S}/><path d="m14 17 2 2-3 1Z" fill="${F}" ${S}/>`,
  client:`<path d="M3 13V11a9 9 0 0 1 18 0v6a4 4 0 0 1-4 4h-3" fill="none" ${S}/><rect x="2" y="10" width="5" height="8" rx="2" fill="${B}" ${S}/><rect x="17" y="10" width="5" height="8" rx="2" fill="${B}" ${S}/><rect x="10" y="19" width="5" height="3" rx="1.5" fill="${R}" ${S}/>`,
  request:`<rect x="4" y="3" width="16" height="19" rx="2" fill="${F}" ${S}/><rect x="9" y="2" width="6" height="4" rx="1" fill="${W}" ${S}/><path d="M8 10h8m-8 4h8m-8 4h5" fill="none" ${S}/>`,
  track:`<rect x="4" y="3" width="16" height="19" rx="2" fill="${F}" ${S}/><rect x="9" y="2" width="6" height="4" rx="1" fill="${B}" ${S}/><path d="m7 10 1 1 2-2m-3 5 1 1 2-2m-3 5 1 1 2-2M13 10h4m-4 4h4m-4 4h4" fill="none" ${S}/>`,
  learn:`<rect x="3" y="9" width="18" height="11" rx="2" fill="${B}" ${S}/><path d="M2 22h20" fill="none" ${S}/><path d="M7 10v4q5 4 10 0v-4" fill="${F}" ${S}/><path d="m2 7 10-5 10 5-10 5Z" fill="${F}" ${S}/><path d="M21 8v6" fill="none" ${SR}/>`,
  coin:`<circle cx="12" cy="12" r="9" fill="${F}" ${S}/><path d="M15.5 8c-1-1.5-6.5-1.5-7 1-.7 3.5 7.7 2.5 7 6-.5 2.5-6 2.5-7 1M12 5v14" fill="none" ${S}/>`,
  /* nuevos */
  form:`<rect x="24" y="20" width="52" height="64" rx="5" fill="${W}" ${S}/><rect x="38" y="14" width="24" height="12" rx="3" fill="${B}" ${S}/><path d="M34 44l4 4 7-8M34 62l4 4 7-8M52 44h16M52 62h16" fill="none" ${S}/><circle cx="74" cy="78" r="10" fill="${F}" ${S}/><path d="M74 73v10M69 78h10" fill="none" ${S}/>`,
  models:`<rect x="34" y="14" width="42" height="56" rx="4" fill="${B}" ${S}/><rect x="28" y="20" width="42" height="56" rx="4" fill="${F}" ${S}/><rect x="22" y="26" width="42" height="58" rx="4" fill="${W}" ${S}/><path d="M30 40h26M30 48h26M30 56h18M30 66h26M30 74h14" fill="none" ${S}/>`,
  rocket:`<path d="M50 14 Q70 30 66 62 H34 Q30 30 50 14 Z" fill="${W}" ${S}/><circle cx="50" cy="40" r="8" fill="${B}" ${S}/><path d="M34 52 L22 66 L34 66 M66 52 L78 66 L66 66" fill="${R}" ${S}/><path d="M42 66 Q50 90 58 66" fill="${F}" ${S}/>`,
  chart:`<rect x="18" y="16" width="64" height="68" rx="4" fill="${F}" ${S}/><rect x="28" y="50" width="8" height="20" fill="${R}" ${S}/><rect x="42" y="38" width="8" height="32" fill="${B}" ${S}/><rect x="56" y="28" width="8" height="42" fill="${W}" ${S}/><path d="M26 76h48M28 26h18" fill="none" ${S}/>`,
  shuffle:`<rect x="16" y="30" width="36" height="36" rx="6" fill="${W}" ${S} transform="rotate(-12 34 48)"/><rect x="48" y="36" width="36" height="36" rx="6" fill="${F}" ${S} transform="rotate(10 66 54)"/><circle cx="27" cy="42" r="2.6" fill="var(--icon-stroke)"/><circle cx="37" cy="52" r="2.6" fill="var(--icon-stroke)"/><circle cx="59" cy="46" r="2.6" fill="var(--icon-stroke)"/><circle cx="67" cy="55" r="2.6" fill="var(--icon-stroke)"/><circle cx="75" cy="64" r="2.6" fill="var(--icon-stroke)"/><path d="M30 20 q20 -10 40 4" fill="none" ${S}/><path d="M64 16l7 8-9 3" fill="none" ${S}/>`,
  docreq:`<path d="M24 16 h32 l14 14 v54 h-46 Z" fill="${W}" ${S}/><path d="M56 16 v14 h14" fill="${B}" ${S}/><path d="M32 42h26M32 50h26M32 58h16" fill="none" ${S}/><circle cx="70" cy="74" r="12" fill="${F}" ${S}/><path d="M70 68v12M65 75l5 5 5-5" fill="none" ${S}/>`,
  calc:`<rect x="26" y="14" width="48" height="72" rx="6" fill="${B}" ${S}/><rect x="33" y="22" width="34" height="16" rx="2" fill="${W}" ${S}/><path d="M56 30h6" fill="none" ${S}/><g fill="${F}" ${S}><rect x="33" y="46" width="9" height="8" rx="2"/><rect x="46" y="46" width="9" height="8" rx="2"/><rect x="59" y="46" width="8" height="8" rx="2"/><rect x="33" y="60" width="9" height="8" rx="2"/><rect x="46" y="60" width="9" height="8" rx="2"/><rect x="59" y="60" width="8" height="20" rx="2"/><rect x="33" y="72" width="22" height="8" rx="2"/></g>`,
  about:`<path d="M50 24 Q34 14 16 18 V78 Q34 74 50 84 Z" fill="${W}" ${S}/><path d="M50 24 Q66 14 84 18 V78 Q66 74 50 84 Z" fill="${F}" ${S}/><path d="M24 34q10-2 18 2M24 46q10-2 18 2M24 58q10-2 18 2" fill="none" ${S}/><path d="M60 26v22l6-5 6 5V22" fill="${R}" ${S}/>`,
  status:`<rect x="18" y="16" width="52" height="68" rx="5" fill="${W}" ${S}/><path d="M28 32h32M28 44h24M28 56h28M28 68h16" fill="none" ${S}/><circle cx="70" cy="68" r="16" fill="${B}" ${S}/><path d="M70 60v9l6 4" fill="none" ${S}/>`,
};

const GRID24=new Set(['court','mail','deal','case','folder','social','tax','client','request','track','learn','coin']);
function ico(name){const vb=GRID24.has(name)?'0 0 24 24':'0 0 100 100';return `<svg class="ico" viewBox="${vb}" aria-hidden="true">${ICONS[name]||''}</svg>`}
function linkAttrs(url){return url.startsWith('/')||url.startsWith('#')?`href="${url}"`:`href="${url}" target="_blank" rel="noopener"`}

const CG=window.CG||null;
/* Tarjetas con "id": se muestran solo si el perfil de quien entra incluye esa sección. */
const visible=a=>!CG||!a.id||CG.secciones.includes(a.id);

const grid=document.getElementById('grid');
if(grid && window.ACCESOS){
  for(const a of window.ACCESOS.filter(visible)){
    const li=document.createElement('li');
    li.innerHTML = a.url
      ? `<a class="tile" ${linkAttrs(a.url)}>${ico(a.icon)}<span class="tile-name">${a.name}</span></a>`
      : `<div class="tile pending">${ico(a.icon)}<span class="tile-name">${a.name}</span><span class="tile-note">Enlace pendiente</span></div>`;
    grid.appendChild(li);
  }
}
const docs=document.getElementById('docs');
if(docs && window.DOCS){
  for(const d of window.DOCS){
    const li=document.createElement('li');
    li.innerHTML = d.url
      ? `<a ${linkAttrs(d.url)}>${d.name}</a>`
      : `<span>${d.name}</span><span class="tile-note">Enlace pendiente</span>`;
    docs.appendChild(li);
  }
}

/* Barra de usuario: perfil, salir y (super administradores) ver como */
const barIn=document.querySelector('.bar-in');
if(barIn && CG){
  const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const u=document.createElement('div');u.className='bar-user';
  let h='';
  if(CG.super && CG.perfiles){
    h+=`<label class="vercomo" title="Ver la Central como la ve cada perfil"><span>Ver como</span><select id="vercomo">`;
    for(const [k,n] of Object.entries(CG.perfiles)) h+=`<option value="${k}"${k===CG.perfil?' selected':''}>${esc(n)}</option>`;
    h+=`</select></label>`;
  }
  if(CG.admin) h+=`<a href="/admin/">Usuarios</a>`;
  h+=`<a href="/perfil/" title="${esc(CG.email)}">Mi perfil</a><a href="/cdn-cgi/access/logout" class="logout">Salir</a>`;
  u.innerHTML=h;barIn.appendChild(u);
  const sel=document.getElementById('vercomo');
  if(sel) sel.addEventListener('change',async()=>{
    sel.disabled=true;
    try{await fetch('/api/vercomo',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({perfil:sel.value})})}catch(e){}
    location.href='/';
  });
  if(CG.viendoComo){
    const b=document.createElement('div');b.className='vercomo-banner';
    b.innerHTML=`<span>Estás viendo la Central como: <b>${esc(CG.perfilNombre)}</b></span><button type="button">Volver a mi vista</button>`;
    document.querySelector('.bar').after(b);
    b.querySelector('button').addEventListener('click',async()=>{
      try{await fetch('/api/vercomo',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({perfil:null})})}catch(e){}
      location.reload();
    });
  }
}

/* Copiar email */
const btn=document.getElementById('copyMail');
if(btn){
  btn.addEventListener('click',()=>{
    const m=document.getElementById('mail');
    const t=m.textContent.trim();
    const done=()=>{btn.textContent='Copiado';setTimeout(()=>btn.textContent='Copiar',1600)};
    function sel(){const r=document.createRange();r.selectNodeContents(m);const s=getSelection();s.removeAllRanges();s.addRange(r);btn.textContent='Seleccionado'}
    if(navigator.clipboard){navigator.clipboard.writeText(t).then(done).catch(sel)}else sel();
  });
}

/* Hero: teclas de máquina de escribir */
const c=document.getElementById('keys');
if(c){
  const x=c.getContext('2d');
  const letters="QWERTYUIOPASDFGHJKLÑZXCVBNM";
  function draw(){
    const w=c.clientWidth,h=c.clientHeight,d=devicePixelRatio||1;
    c.width=w*d;c.height=h*d;x.setTransform(d,0,0,d,0,0);x.clearRect(0,0,w,h);
    let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
    const r=Math.max(34,Math.min(58,w/22)),gap=r*2.5;
    for(let row=0;row*gap*0.8<h+gap;row++){
      for(let col=-1;col*gap<w+gap;col++){
        const cx=col*gap+(row%2?gap/2:0)+rnd()*10,cy=row*gap*0.8+10+rnd()*10;
        const g=x.createRadialGradient(cx-r*.3,cy-r*.4,r*.1,cx,cy,r);
        g.addColorStop(0,'#3a4452');g.addColorStop(1,'#141920');
        x.beginPath();x.arc(cx,cy,r,0,7);x.fillStyle=g;x.fill();
        x.lineWidth=r*.16;x.strokeStyle='#6f5f45';x.stroke();
        x.fillStyle='rgba(214,178,98,.55)';
        x.font=`700 ${r*.8}px "Roboto Condensed",Arial,sans-serif`;x.textAlign='center';x.textBaseline='middle';
        x.fillText(letters[Math.floor(rnd()*letters.length)],cx,cy+2);
      }
    }
  }
  draw();addEventListener('resize',draw);document.fonts&&document.fonts.ready.then(draw);
}

})();
