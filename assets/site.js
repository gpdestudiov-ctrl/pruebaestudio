/* Central de Gestión Videla — script compartido.
   Cada página define window.ACCESOS (tarjetas) y, opcionalmente, window.DOCS (lista de documentos).
   url: null = enlace pendiente. Las URLs que empiezan con "/" son páginas de este sitio. */
(function(){
const S='stroke="var(--icon-stroke)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"';
const F='var(--icon-fill)', B='var(--icon-blue)', R='var(--icon-red)', W='var(--surface)';
const ICONS = {
  court:`<path d="M20 44 L50 26 L80 44 Z" fill="${F}" ${S}/><path d="M24 48h52M28 48v26M42 48v26M58 48v26M72 48v26M20 78h60M16 84h68" fill="none" ${S}/>`,
  mail:`<rect x="16" y="30" width="68" height="46" rx="5" fill="${F}" ${S}/><path d="M16 34 L50 58 L84 34" fill="none" ${S}/><circle cx="72" cy="28" r="10" fill="${B}" ${S}/>`,
  deal:`<path d="M14 50 L30 36 L46 42 L58 36 L86 50 L70 70 L50 72 L30 66 Z" fill="${F}" ${S}/><path d="M46 42 L38 54 Q44 58 52 50 L64 60" fill="none" ${S}/><circle cx="50" cy="22" r="9" fill="${B}" ${S}/>`,
  case:`<rect x="30" y="16" width="44" height="60" rx="4" fill="${B}" ${S}/><rect x="24" y="22" width="44" height="60" rx="4" fill="${W}" ${S}/><path d="M32 40l4 4 8-8M32 56l4 4 8-8M50 42h10M50 58h10" fill="none" ${S}/><circle cx="26" cy="24" r="9" fill="${R}" ${S}/>`,
  folder:`<path d="M16 30 h24 l6 7 h38 v41 h-68 Z" fill="${F}" ${S}/><path d="M22 44h56" fill="none" ${S}/><rect x="22" y="37" width="56" height="5" fill="${B}" opacity=".7"/>`,
  social:`<circle cx="50" cy="40" r="16" fill="${F}" ${S}/><path d="M22 84 Q22 62 50 62 Q78 62 78 84" fill="${B}" ${S}/><path d="M44 40h12M50 34v12" fill="none" ${S}/>`,
  tax:`<rect x="24" y="16" width="44" height="64" rx="4" fill="${W}" ${S}/><rect x="32" y="24" width="22" height="18" rx="2" fill="${R}" ${S}/><path d="M32 52h28M32 60h28M32 68h18" fill="none" ${S}/><circle cx="70" cy="72" r="13" fill="${F}" ${S}/><path d="M70 64v16M74 67q-4-3-8 0q0 4 4 5q4 1 4 5q-4 3-8 0" fill="none" stroke="var(--icon-stroke)" stroke-width="1.8" stroke-linecap="round"/>`,
  client:`<path d="M14 72 L40 60 L66 64 L86 56 L86 66 L62 80 L32 82 Z" fill="${F}" ${S}/><circle cx="50" cy="36" r="9" fill="${B}" ${S}/><circle cx="30" cy="40" r="7" fill="${F}" ${S}/><circle cx="70" cy="40" r="7" fill="${F}" ${S}/><path d="M40 18l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1Z" fill="${F}" stroke="var(--icon-stroke)" stroke-width="1.6" stroke-linejoin="round"/><path d="M60 18l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1Z" fill="${F}" stroke="var(--icon-stroke)" stroke-width="1.6" stroke-linejoin="round"/>`,
  request:`<path d="M26 82 h36 l-4 -10 h-28 Z" fill="${B}" ${S}/><path d="M32 72 Q30 50 40 40 L34 30 L50 30 Q62 40 58 72" fill="${B}" ${S}/><rect x="56" y="54" width="22" height="28" rx="3" fill="${F}" ${S}/><path d="M61 63h12M61 70h12M61 77h8" fill="none" ${S}/><path d="M62 22 q12 0 14 14" fill="none" ${S}/><path d="M72 32l4 4 4-5" fill="none" ${S}/>`,
  track:`<path d="M24 82 h36 l-4 -10 h-28 Z" fill="${F}" ${S}/><path d="M30 72 Q28 50 38 40 L32 30 L48 30 Q60 40 56 72" fill="${F}" ${S}/><circle cx="68" cy="52" r="13" fill="${B}" ${S}/><path d="M77 62 L86 72" fill="none" ${S}/><path d="M62 52h11M69 48l4 4-4 4" fill="none" ${S}/>`,
  learn:`<rect x="18" y="38" width="64" height="38" rx="4" fill="${B}" ${S}/><path d="M12 80h76" fill="none" ${S}/><path d="M50 20 L78 30 L50 40 L22 30 Z" fill="${F}" ${S}/><path d="M36 35v8 q14 8 28 0v-8" fill="none" ${S}/><path d="M28 60h20M28 67h30" fill="none" ${S}/>`,
  coin:`<circle cx="58" cy="36" r="20" fill="${F}" ${S}/><path d="M58 24v24M64 28q-6-4-12 0q0 6 6 7q6 1 6 7q-6 4-12 0" fill="none" ${S}/><path d="M34 86 V60 Q34 54 40 54 L40 44 Q40 38 46 40 L46 70" fill="${W}" ${S}/><path d="M18 30h6M21 27v6M80 64h6M83 61v6" fill="none" ${S}/>`,
  /* nuevos */
  form:`<rect x="24" y="20" width="52" height="64" rx="5" fill="${W}" ${S}/><rect x="38" y="14" width="24" height="12" rx="3" fill="${B}" ${S}/><path d="M34 44l4 4 7-8M34 62l4 4 7-8M52 44h16M52 62h16" fill="none" ${S}/><circle cx="74" cy="78" r="10" fill="${F}" ${S}/><path d="M74 73v10M69 78h10" fill="none" ${S}/>`,
  models:`<rect x="34" y="14" width="42" height="56" rx="4" fill="${B}" ${S}/><rect x="28" y="20" width="42" height="56" rx="4" fill="${F}" ${S}/><rect x="22" y="26" width="42" height="58" rx="4" fill="${W}" ${S}/><path d="M30 40h26M30 48h26M30 56h18M30 66h26M30 74h14" fill="none" ${S}/>`,
  rocket:`<path d="M50 14 Q70 30 66 62 H34 Q30 30 50 14 Z" fill="${W}" ${S}/><circle cx="50" cy="40" r="8" fill="${B}" ${S}/><path d="M34 52 L22 66 L34 66 M66 52 L78 66 L66 66" fill="${R}" ${S}/><path d="M42 66 Q50 90 58 66" fill="${F}" ${S}/>`,
  chart:`<rect x="18" y="16" width="64" height="68" rx="4" fill="${F}" ${S}/><rect x="28" y="50" width="8" height="20" fill="${R}" ${S}/><rect x="42" y="38" width="8" height="32" fill="${B}" ${S}/><rect x="56" y="28" width="8" height="42" fill="${W}" ${S}/><path d="M26 76h48M28 26h18" fill="none" ${S}/>`,
  shuffle:`<rect x="16" y="30" width="36" height="36" rx="6" fill="${W}" ${S} transform="rotate(-12 34 48)"/><rect x="48" y="36" width="36" height="36" rx="6" fill="${F}" ${S} transform="rotate(10 66 54)"/><circle cx="27" cy="42" r="2.6" fill="var(--icon-stroke)"/><circle cx="37" cy="52" r="2.6" fill="var(--icon-stroke)"/><circle cx="59" cy="46" r="2.6" fill="var(--icon-stroke)"/><circle cx="67" cy="55" r="2.6" fill="var(--icon-stroke)"/><circle cx="75" cy="64" r="2.6" fill="var(--icon-stroke)"/><path d="M30 20 q20 -10 40 4" fill="none" ${S}/><path d="M64 16l7 8-9 3" fill="none" ${S}/>`,
  docreq:`<path d="M24 16 h32 l14 14 v54 h-46 Z" fill="${W}" ${S}/><path d="M56 16 v14 h14" fill="${B}" ${S}/><path d="M32 42h26M32 50h26M32 58h16" fill="none" ${S}/><circle cx="70" cy="74" r="12" fill="${F}" ${S}/><path d="M70 68v12M65 75l5 5 5-5" fill="none" ${S}/>`,
  calc:`<rect x="26" y="14" width="48" height="72" rx="6" fill="${B}" ${S}/><rect x="33" y="22" width="34" height="16" rx="2" fill="${W}" ${S}/><path d="M56 30h6" fill="none" ${S}/><g fill="${F}" ${S}><rect x="33" y="46" width="9" height="8" rx="2"/><rect x="46" y="46" width="9" height="8" rx="2"/><rect x="59" y="46" width="8" height="8" rx="2"/><rect x="33" y="60" width="9" height="8" rx="2"/><rect x="46" y="60" width="9" height="8" rx="2"/><rect x="59" y="60" width="8" height="20" rx="2"/><rect x="33" y="72" width="22" height="8" rx="2"/></g>`,
};

function ico(name){return `<svg class="ico" viewBox="0 0 100 100" aria-hidden="true">${ICONS[name]||''}</svg>`}
function linkAttrs(url){return url.startsWith('/')||url.startsWith('#')?`href="${url}"`:`href="${url}" target="_blank" rel="noopener"`}

const grid=document.getElementById('grid');
if(grid && window.ACCESOS){
  for(const a of window.ACCESOS){
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
