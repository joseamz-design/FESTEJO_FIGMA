'use strict';
/* ========= Utilidades ========= */
const $ = (s, r = document) => r.querySelector(s);
const S = {
  get(k, d) { try { const v = localStorage.getItem('fj_' + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { localStorage.setItem('fj_' + k, JSON.stringify(v)); },
  del(k) { localStorage.removeItem('fj_' + k); }
};
const money = n => 'S/ ' + Number(n).toFixed(2);
const ic = {
  user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>',
  bag: '<svg viewBox="0 0 24 24"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8a3 3 0 016 0"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',
  trash: '<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg>',
  hour: '<svg viewBox="0 0 24 24"><path d="M6 3h12M6 21h12M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9"/></svg>',
  arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
};
const toast = m => { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 2200); };
const go = h => { if (location.hash === '#/' + h) route(); else location.hash = '#/' + h; };
const MES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const fmtD = d => d.split('-').reverse().join('/');
const code = p => p + '-' + String(Math.floor(Math.random() * 9000) + 1000);

/* ========= Datos (los nombres de imagen = archivos en /img/NOMBRE.jpg) ========= */
const CATS = { especiales: 'Menús Especiales', criollos: 'Platos Criollos', entradas: 'Entradas', bebidas: 'Bebidas', cocteles: 'Cócteles', postres: 'Postres' };
const D = [
  { id: 1, n: 'Lomo Saltado', c: 'criollos', p: 32, i: 'lomo-saltado', d: 'Lomo al wok, papas doradas y arroz de la casa.' },
  { id: 2, n: 'Ají de Gallina', c: 'criollos', p: 25, i: 'aji-de-gallina', d: 'Pollo en crema de ají amarillo, papa, huevo y aceituna.' },
  { id: 3, n: 'Arroz con Mariscos', c: 'criollos', p: 25, i: 'arroz-con-mariscos', d: 'Arroz al punto con mariscos y el sabor de nuestra costa.' },
  { id: 4, n: 'Seco de Res', c: 'criollos', p: 30, i: 'seco-de-res', d: 'Res cocida a fuego lento, culantro, frejoles y arroz.' },
  { id: 5, n: 'Tallarín Verde con Bisteck', c: 'criollos', p: 28, i: 'tallarin-verde', d: 'Pasta con albahaca y espinaca, acompañada de bisteck.' },
  { id: 6, n: 'Bistec a lo Pobre', c: 'criollos', p: 27, i: 'bistec-a-lo-pobre', d: 'Bistec, huevo frito, plátano dorado, papas y arroz.' },
  { id: 7, n: 'Pollo a la Brasa', c: 'criollos', p: 26, i: 'pollo-a-la-brasa', d: 'Dorado al carbón, con papas y ensalada fresca.' },
  { id: 8, n: 'Lomo al Jugo', c: 'criollos', p: 32, i: 'lomo-al-jugo', d: 'Lomo jugoso en su salsa, con arroz y papas.' },
  { id: 9, n: 'Causa Limeña', c: 'entradas', p: 22, i: 'causa-limena', d: 'Papa amarilla prensada con ají y relleno cremoso.' },
  { id: 10, n: 'Anticucho', c: 'entradas', p: 24, i: 'anticucho', d: 'Brochetas a la parrilla con papa y ají de la casa.' },
  { id: 11, n: 'Chicha Morada', c: 'bebidas', p: 8, i: 'chicha-morada', d: 'Maíz morado, piña, canela y clavo, bien fría.' },
  { id: 12, n: 'Pisco Sour', c: 'cocteles', p: 18, i: 'pisco-sour', d: 'El sabor de nuestra tierra, en cada brindis.' },
  { id: 13, n: 'Pisco Sour de Maracuyá', c: 'cocteles', p: 20, i: 'pisco-maracuya', d: 'Pisco, limón y maracuyá con espuma suave.' },
  { id: 14, n: 'Mazamorra Morada', c: 'postres', p: 12, i: 'mazamorra-morada', d: 'Dulce tradicional de maíz morado y frutas.' },
  { id: 15, n: 'Suspiro Limeño', c: 'postres', p: 16, i: 'suspiro-limeno', d: 'Manjar blanco con merengue al oporto.' },
  { id: 16, n: 'Menú Familiar (4 personas)', c: 'especiales', p: 98, i: 'menu-familiar', d: 'Pollo a la brasa, lomo saltado, ají de gallina, ensalada y chicha morada para compartir.' },
  { id: 17, n: 'Menú Ejecutivo', c: 'especiales', p: 35, i: 'menu-ejecutivo', d: 'Entrada, plato criollo del día, postre y refresco.' },
  { id: 18, n: 'Menú Parrillero', c: 'especiales', p: 85, i: 'menu-parrillero', d: 'Anticuchos, lomo al jugo, papas doradas y dos pisco sour.' }
];
const byId = id => D.find(x => x.id == id);
const PM = { card: 'Tarjeta crédito / débito', yape: 'Yape / Plin', transfer: 'Transferencia bancaria', cash: 'Pago contra entrega' };
const HORAS = { Almuerzo: ['12:00 p. m.', '12:30 p. m.', '1:00 p. m.', '1:30 p. m.', '2:00 p. m.', '2:30 p. m.', '3:00 p. m.', '3:30 p. m.'], Cena: ['6:00 p. m.', '6:30 p. m.', '7:00 p. m.', '7:30 p. m.', '8:00 p. m.', '8:30 p. m.', '9:00 p. m.', '9:30 p. m.'] };

/* Mesas: [capacidad, ocupada?] — numeración continua entre zonas */
const ZDEF = {
  principal: { n: 'Zona Principal', s: '2, 4 y 6 personas', round: false, t: [[2], [2, 1], [4], [4], [4, 1], [6], [4], [4], [2, 1], [4], [6, 1], [4]] },
  terraza: { n: 'Terraza', s: '2 y 4 personas', round: true, t: [[2], [4], [2, 1], [4], [4], [2], [4, 1], [2]] },
  bar: { n: 'Zona Bar', s: '2 personas', round: false, t: [[2], [2], [2, 1], [2], [2], [2, 1]] }
};
(() => { let n = 1; Object.values(ZDEF).forEach(z => z.t = z.t.map(([cap, occ]) => ({ n: n++, cap, occ: !!occ }))); })();

/* ========= Carrito ========= */
const cart = () => S.get('cart', {});
const cnt = () => Object.values(cart()).reduce((a, b) => a + b, 0);
const items = () => Object.entries(cart()).map(([id, q]) => ({ ...byId(id), q }));
const total = () => items().reduce((a, x) => a + x.p * x.q, 0);
const setQ = (id, q) => { const c = cart(); q > 0 ? c[id] = q : delete c[id]; S.set('cart', c); };

/* ========= Componentes ========= */
const LOGO = '<span class="orn">◦◈◦</span><strong>FESTEJO</strong><small>— CAFÉ · RESTAURANTE —</small>';
const im = (i, a) => `<span class="im"><img src="img/${i}.jpg" alt="${a}" loading="lazy" onerror="this.remove()"></span>`;
const stepper = (l, c) => `<ol class="steps">${l.map((x, i) => `<li class="${i < c ? 'done' : i === c ? 'on' : ''}"><b>${i < c ? ic.check : i + 1}</b><span>${x}</span></li>`).join('')}</ol>`;
const STEPS_C = ['Carrito', 'Datos de entrega', 'Pago', 'Confirmación'];
const STEPS_R = ['Mesa y sillas', 'Fecha y hora', 'Decoración y datos', 'Confirmación'];
const pc = d => `<article class="pc">${im(d.i, d.n)}<h4>${d.n}</h4><p class="pr">${money(d.p)}</p><button class="btn ghost sm" data-add="${d.id}">Agregar</button></article>`;
const qty = id => `<span class="qty"><button data-dec="${id}" aria-label="Quitar">−</button><i>${cart()[id]}</i><button data-inc="${id}" aria-label="Agregar">+</button></span>`;
const sumBox = (its, tot) => `<aside class="box sum"><h3>Resumen del pedido</h3>${its.map(x => `<div class="li">${im(x.i, x.n)}<div><b>${x.n}</b><small>${x.q} unidad${x.q > 1 ? 'es' : ''}</small></div><span>${money(x.p * x.q)}</span></div>`).join('')}
  <div class="tr"><span>Subtotal</span><span>${money(tot)}</span></div><div class="tr"><span>Entrega local</span><span>Sin cargo adicional</span></div>
  <div class="tr big"><span>Total</span><b>${money(tot)}</b></div><small class="muted">IGV incluido · Sin cargos adicionales</small></aside>`;
const head = (eb, t, p) => `<div class="wrap ph"><div class="eyebrow">${eb}</div><h1>${t}</h1>${p ? `<p>${p}</p>` : ''}</div>`;

/* ========= Estado de vistas ========= */
let cur = 'inicio', timer, pcat = 'todos', ccat = 'especiales', cq = '', pm = S.get('pm', 'card'), cal = null;
const R = () => S.get('res', { zone: 'principal' });
const saveR = o => S.set('res', { ...R(), ...o });

/* ========= Vistas ========= */
const V = {};
const A = {}; // se ejecutan después de pintar la vista

V.inicio = () => {
  const rel = [9, 11, 5, 13].map(id => pc(byId(id))).join(''), mas = [10, 8, 14, 15].map(id => pc(byId(id))).join('');
  return `<section class="hero"><div><div class="eyebrow">— El arte de compartir</div><h1>Sabor, Cultura y Tradición Peruana</h1><p>Comida criolla, cocteles y mucho más.</p>
    <a class="btn" href="#/servicios">RESERVA TU MESA ${ic.arrow}</a><div class="hs"><span><b>12:00</b>Abierto desde</span><span><b>26</b>Mesas</span><span><b>3</b>Zonas</span></div><q>Cada encuentro merece un festejo.</q></div>
    <div class="im">${im('hero', 'Salón de Festejo').replace('class="im"', 'class="im" style="position:absolute;inset:0"')}<div class="tag"><b>Un lugar para sentirte en casa.</b><small>COCINA PERUANA · CAFÉ · BUENOS MOMENTOS</small></div></div></section>
  <div class="wrap sec"><div class="eyebrow">Sabores para descubrir</div><h2>Ofertas especiales y recomendaciones</h2><p class="muted">Una selección de la casa para disfrutar de nuestra cocina y encontrar nuevos favoritos.</p>
    <div class="feat">${im('ofertas', 'Plato de la casa')}<div><div class="eyebrow">La recomendación de Festejo</div><h3>El gusto de compartir algo especial.</h3><p class="muted" style="margin-bottom:18px">Platos criollos, un buen brindis y un dulce final. Explora esta selección editorial, con los precios de nuestra carta.</p><a class="btn" href="#/carta">Explorar el menú ${ic.arrow}</a></div></div>
    <div class="cols"><div><h3>Productos relacionados</h3><small class="muted">Aunque no lo creas, también te pueden interesar.</small><div class="grid4" style="grid-template-columns:repeat(2,1fr)">${rel}</div></div>
    <div><h3>También te puede gustar</h3><small class="muted">Otros clientes también compraron.</small><div class="grid4" style="grid-template-columns:repeat(2,1fr)">${mas}</div></div></div></div>
  <div class="wrap sec" style="padding-top:0"><div class="eyebrow">Por qué Festejo</div><h2>Hecho para compartir</h2>
    <div class="three"><div class="box"><span class="num">1</span><h4>Cocina de tradición</h4><p class="muted">Recetas criollas preparadas al momento, como en casa.</p></div>
    <div class="box"><span class="num">2</span><h4>Mesas para cada ocasión</h4><p class="muted">Zona principal, terraza y bar: elige tu mesa en el plano.</p></div>
    <div class="box"><span class="num">3</span><h4>Pide o reserva en línea</h4><p class="muted">Haz tu pedido con entrega local o separa tu mesa en minutos.</p></div></div></div>
  <div class="wrap" style="padding-bottom:56px"><div class="band"><div><small>Visítanos</small><h3>Av. Londres · San Carlos, Huancayo</h3></div><div><small>Horario</small><p>Todos los días<br>12:00 p. m. – 10:00 p. m.</p></div><div><a class="btn" href="#/servicios">Reservar mesa</a> <a class="btn ghost" href="#/contacto">Contacto</a></div></div></div>`;
};

V.nosotros = () => `${head('Nuestra historia', 'Nosotros', 'Un café y restaurante peruano en el corazón de Huancayo.')}<div class="wrap page">
  <div class="split">${im('salon', 'Salón Festejo')}<div><div class="eyebrow">Quiénes somos</div><h2>Cada encuentro merece un festejo</h2><p class="muted" style="margin:12px 0">Festejo nació para que la cocina criolla, el buen café y los cocteles peruanos tengan un lugar donde se disfruten sin prisa. Cocinamos al momento, con ingredientes de nuestra tierra y el cariño de una mesa familiar.</p><p class="muted">Nuestra misión es simple: que cada visita se sienta como volver a casa.</p></div></div>
  <div class="stats"><div><b>18+</b>platos y menús</div><div><b>3</b>zonas del salón</div><div><b>26</b>mesas</div><div><b>7/7</b>días abiertos</div></div>
  <div class="three"><div class="box"><h4>Tradición</h4><p class="muted">Recetas que pasan de generación en generación.</p></div><div class="box"><h4>Sabor</h4><p class="muted">Cocina al momento, con insumos frescos.</p></div><div class="box"><h4>Hospitalidad</h4><p class="muted">Un servicio cálido, como en casa.</p></div></div></div>`;

V.contacto = () => `${head('Estamos para ti', 'Contacto', 'Escríbenos para consultas, eventos o celebraciones especiales.')}<div class="wrap page"><div class="cols">
  <div class="box"><h3>Envíanos un mensaje</h3><form id="fc" novalidate style="margin-top:14px"><div class="g2"><label class="field">Nombre<input name="n" placeholder="Tu nombre"></label><label class="field">Correo<input name="e" type="email" placeholder="tu.correo@ejemplo.com"></label></div>
  <label class="field">Asunto<select name="a"><option>Consulta general</option><option>Reservas y eventos</option><option>Pedidos</option><option>Sugerencias</option></select></label>
  <label class="field">Mensaje<textarea name="m" rows="4" placeholder="Cuéntanos cómo podemos ayudarte"></textarea></label><div class="err" id="ferr"></div><button class="btn">Enviar mensaje ${ic.arrow}</button></form></div>
  <div><div class="box"><h3>Visítanos</h3><p style="margin:10px 0"><b>Dirección</b><br>Av. Londres · San Carlos, Huancayo</p><p style="margin-bottom:10px"><b>Horario</b><br>Todos los días · 12:00 p. m. – 10:00 p. m.</p><p><b>Redes</b><br>Instagram · Facebook · Festejo Café · Restaurante</p></div>
  <iframe class="map" title="Mapa" loading="lazy" src="https://maps.google.com/maps?q=Av.+Londres+San+Carlos+Huancayo&output=embed"></iframe></div></div></div>`;
A.contacto = () => $('#fc').addEventListener('submit', e => {
  e.preventDefault(); const f = e.target;
  if (f.n.value.trim().length < 3) return $('#ferr').textContent = 'Escribe tu nombre.';
  if (!/^\S+@\S+\.\S+$/.test(f.e.value)) return $('#ferr').textContent = 'Escribe un correo válido.';
  if (f.m.value.trim().length < 10) return $('#ferr').textContent = 'El mensaje es muy corto.';
  f.reset(); $('#ferr').textContent = ''; toast('Mensaje enviado. ¡Gracias por escribirnos!');
});

/* ---- Carta ---- */
V.carta = () => `<div class="wrap page"><div class="ph chead" style="padding-bottom:0"><div><div class="eyebrow">Cocina peruana · Hecha para compartir</div><h1>Nuestro Menú</h1><p class="muted">El verdadero sabor del Perú, en cada plato.</p></div>
  <label class="search">${ic.search}<input id="q" placeholder="Buscar un plato" value="${cq}" autocomplete="off"></label></div><div id="cbody"></div></div>`;
function cartaBody() {
  const u = S.get('user'), n = cnt(), list = D.filter(d => (cq ? d.n.toLowerCase().includes(cq.toLowerCase()) : d.c === ccat));
  const card = d => `<article class="dc">${im(d.i, d.n)}<div><h4>${d.n}</h4><p>${d.d}</p><div class="row"><b>${money(d.p)}</b>${cart()[d.id] ? qty(d.id) : `<button class="btn ghost sm" data-add="${d.id}">+ Agregar</button>`}</div></div></article>`;
  const panel = u && n ? `<aside class="box mini"><h3>Tu Carrito <span class="pill">${n} producto${n > 1 ? 's' : ''}</span></h3>${items().map(x => `<div class="mi"><b>${x.n}</b><b>${money(x.p * x.q)}</b><small>${money(x.p)} por unidad</small>${qty(x.id)}<button class="trash" data-del="${x.id}" aria-label="Eliminar">${ic.trash}</button></div>`).join('')}
    <div class="tr big"><span>Total</span><b>${money(total())}</b></div><a class="btn block" href="#/carrito">Finalizar compra ${ic.arrow}</a></aside>` : '';
  return `<div class="carta ${panel ? 'cp' : ''}"><div class="side"><small>El menú</small>${Object.entries(CATS).map(([k, t]) => `<button class="${!cq && ccat === k ? 'on' : ''}" data-act="cat:${k}">${t}</button>`).join('')}<q>Tradición que se sirve con cariño.</q></div>
  <div class="dgrid">${list.map(card).join('') || '<p class="empty">No encontramos ese plato.</p>'}</div>${panel}</div>`;
}
A.carta = () => { $('#cbody').innerHTML = cartaBody(); $('#q').addEventListener('input', e => { cq = e.target.value; $('#cbody').innerHTML = cartaBody(); }); };

/* ---- Compra ---- */
V.carrito = () => {
  const its = items(), t = total();
  if (!its.length) return `${head('El sabor de Festejo, para ti', 'Tu carrito', '')}<div class="wrap page"><div class="box empty"><h3>Tu carrito está vacío</h3><p style="margin:8px 0 16px">Agrega algo de nuestra carta para continuar.</p><a class="btn" href="#/carta">Ir a la carta</a></div></div>`;
  return `${head('El sabor de Festejo, para ti', 'Tu carrito', `${its.length} favorito${its.length > 1 ? 's' : ''} de nuestra carta. Revisa tu selección antes de continuar.`)}<div class="wrap page">${stepper(STEPS_C, 0)}<div class="lay"><div>
  <div class="box"><div class="row" style="margin-bottom:6px"><b>${its.length} producto${its.length > 1 ? 's' : ''} · ${cnt()} unidad${cnt() > 1 ? 'es' : ''}</b><small class="muted">Precios en soles</small></div>
  ${its.map(x => `<div class="ci">${im(x.i, x.n)}<div><h4>${x.n}</h4><small>${x.d}<br>${money(x.p)} por unidad</small></div>${qty(x.id)}<b>${money(x.p * x.q)}</b><button class="trash" data-del="${x.id}" aria-label="Eliminar">${ic.trash}</button></div>`).join('')}</div>
  <div class="acts"><a class="btn ghost" href="#/carta" style="flex:0 0 auto">← Seguir comprando</a><span class="muted" style="align-self:center">Preparado al momento, con el cariño de nuestra cocina.</span></div></div>
  <div>${sumBox(its, t)}<a class="btn block" href="#/entrega" style="margin-top:14px">Proceder al pago ${ic.arrow}</a></div></div></div>`;
};

V.entrega = () => {
  const d = S.get('delivery', {}), u = S.get('user', {});
  return `${head('Llevamos nuestra cocina a tu mesa', 'Datos de entrega', 'Entrega local en Huancayo, sin cargo adicional para este pedido.')}<div class="wrap page">${stepper(STEPS_C, 1)}<div class="lay"><form id="fe" novalidate><div class="box"><h3 style="margin-bottom:14px">¿A quién y dónde entregamos?</h3>
  <label class="field">Nombre completo<input name="n" placeholder="Escribe tu nombre y apellidos" value="${d.n || ''}"></label>
  <div class="g2"><label class="field">Correo electrónico<input name="e" type="email" placeholder="tu.correo@ejemplo.com" value="${d.e || ''}"></label><label class="field">Teléfono<input name="t" inputmode="numeric" maxlength="9" placeholder="Escribe tu número de celular" value="${d.t || u.phone || ''}"></label></div>
  <div class="g2"><label class="field">Dirección de entrega · Huancayo<input name="a" placeholder="Calle o avenida, número y departamento" value="${d.a || ''}"></label><label class="field">Zona de entrega<input name="z" value="${d.z || 'San Carlos, Huancayo'}"></label></div>
  <label class="field">Referencias para llegar (opcional)<textarea name="r" rows="3" placeholder="Ej.: fachada, piso o punto de referencia cercano">${d.r || ''}</textarea></label><div class="err" id="ferr"></div></div>
  <div class="acts"><a class="btn ghost" href="#/carrito" style="flex:0 0 auto">← Volver al carrito</a><button class="btn">Continuar al pago ${ic.arrow}</button></div></form>${sumBox(items(), total())}</div></div>`;
};
A.entrega = () => $('#fe').addEventListener('submit', e => {
  e.preventDefault(); const f = e.target, v = { n: f.n.value.trim(), e: f.e.value.trim(), t: f.t.value.trim(), a: f.a.value.trim(), z: f.z.value.trim(), r: f.r.value.trim() };
  const err = v.n.length < 3 ? 'Escribe tu nombre completo.' : !/^\S+@\S+\.\S+$/.test(v.e) ? 'Escribe un correo válido.' : !/^9\d{8}$/.test(v.t) ? 'El celular debe tener 9 dígitos y empezar con 9.' : v.a.length < 5 ? 'Escribe tu dirección de entrega.' : '';
  if (err) return $('#ferr').textContent = err;
  S.set('delivery', v); go('pago');
});

function payPanel() {
  const t = money(total());
  if (pm === 'card') return `<h3>Pagar con tarjeta</h3><p class="muted" style="margin:4px 0 14px;font-size:12px">1. Ingresa los datos · 2. Revisa · 3. Confirma</p><label class="field">Nombre del titular<input id="cn" placeholder="Como aparece en la tarjeta"></label><label class="field">Número de tarjeta<input id="cc" inputmode="numeric" maxlength="19" placeholder="0000 0000 0000 0000"></label><div class="g2"><label class="field">Fecha de vencimiento<input id="cx" maxlength="5" placeholder="MM/AA"></label><label class="field">Código de seguridad<input id="cv" inputmode="numeric" maxlength="4" placeholder="CVV"></label></div><div class="err" id="perr"></div><small class="muted">Importe total: ${t} · IGV incluido</small><button class="btn block" data-act="pay" style="margin-top:10px">Pagar ${t}</button>`;
  if (pm === 'yape') return `<h3>Yape / Plin</h3><p class="muted">Escanea el código o yapea al número indicado y luego confirma.</p><div class="qr">QR</div><p><b>Número:</b> 999 999 999 · Festejo</p><div class="err" id="perr"></div><button class="btn block" data-act="pay">Ya realicé el pago · ${t}</button>`;
  if (pm === 'transfer') return `<h3>Transferencia bancaria</h3><p class="muted" style="margin:6px 0">Realiza la transferencia y conserva tu constancia.</p><div class="det"><div class="tr"><span>Banco</span><b>(por definir)</b></div><div class="tr"><span>Cuenta / CCI</span><b>000-000000000-00</b></div><div class="tr"><span>Titular</span><b>Festejo Café · Restaurante</b></div></div><button class="btn block" data-act="pay">Confirmar pedido · ${t}</button>`;
  return `<h3>Pago contra entrega</h3><p class="muted" style="margin:6px 0 16px">Pagas ${t} cuando recibas tu pedido, en efectivo o con Yape/Plin al repartidor.</p><button class="btn block" data-act="pay">Confirmar pedido · ${t}</button>`;
}
V.pago = () => `${head('Un último paso para disfrutar', '¿Cómo quieres pagar?', 'Elige un método, completa los datos y revisa el total antes de confirmar tu pago.')}<div class="wrap page">${stepper(STEPS_C, 2)}<div class="lay"><div><div class="box pay"><div class="pm"><h3>Método de pago</h3>${Object.entries(PM).map(([k, t]) => `<button class="${pm === k ? 'on' : ''}" data-act="pm:${k}"><b>${t}</b></button>`).join('')}</div><div id="ppanel">${payPanel()}</div></div>
  <div class="acts"><a class="btn ghost" href="#/entrega" style="flex:0 0 auto">← Volver a datos de entrega</a><span class="muted" style="align-self:center">Entrega local en Huancayo · Sin cargo adicional</span></div></div>${sumBox(items(), total())}</div></div>`;

const wait = (icon, eb, t, p, det, foot) => `<div class="wrap wait"><div><div class="big-ic"><span class="spin" style="display:flex">${ic.hour}</span></div><div class="eyebrow">${eb}</div><h1>${t}</h1><p class="muted" style="margin:14px 0">${p}</p><div class="box">${det}</div><p style="margin-top:16px"><b>${foot}</b></p></div><div>${im('salon', 'Salón')}<h3 style="margin-top:14px">Cada encuentro merece un festejo.</h3><p class="muted">Cocina peruana y una mesa para compartir, en el corazón de Huancayo.</p></div></div>`;
V.procesando = () => wait('', 'Estamos revisando tu pago', 'Procesando tu pago…', 'Por favor, espera mientras verificamos la operación. El pago y el pedido todavía no están confirmados.',
  `<div class="eyebrow">Pago pendiente</div><h2>${money(total())}</h2><div class="det"><div class="tr"><span>Método seleccionado</span><b>${PM[pm]}</b></div><div class="tr"><span>Pedido</span><b>${cnt()} unidad${cnt() > 1 ? 'es' : ''}</b></div></div><small class="muted">IGV incluido · Entrega sin cargo adicional</small>`, 'No cierres esta pantalla ni repitas el pago.');
A.procesando = () => { timer = setTimeout(() => {
  const o = { id: code('FP'), items: items(), total: total(), pm: PM[pm], d: S.get('delivery', {}) };
  S.set('order', o); S.set('cart', {}); go('confirmado'); }, 2800); };

V.confirmado = () => { const o = S.get('order'); return `${head('Gracias por elegir Festejo', '¡Tu pedido está confirmado!', 'Tu pago se realizó correctamente. Nuestra cocina recibió tu pedido.')}<div class="wrap page">${stepper(STEPS_C, 3).replace(/class="on"/, 'class="done"')}<div class="lay"><div class="box"><div class="row" style="justify-content:flex-start;gap:18px"><div class="big-ic ok">${ic.check}</div><div><div class="eyebrow">Pedido #${o.id}</div><h2 style="font-size:34px">El sabor de casa, en camino a tu mesa.</h2></div></div>
  <div class="det"><div class="tr"><span>Total pagado</span><b>${money(o.total)} · IGV incluido</b></div><div class="tr"><span>Método de pago</span><b>${o.pm}</b></div><div class="tr"><span>Entrega</span><b>${o.d.a || 'Huancayo'} · Sin cargo adicional</b></div></div>
  <h3>Te mantendremos al tanto</h3><p class="muted" style="margin:6px 0 14px">Recibirás información de tu pedido en los datos de contacto que registraste. Conserva tu número de pedido para consultarlo.</p>
  <div class="acts"><a class="btn" href="#/cuenta">Ver mi pedido</a><a class="btn ghost" href="#/inicio">Volver al inicio</a></div></div>${sumBox(o.items, o.total)}</div></div>`; };

/* ---- Reservas ---- */
const DECO = {
  flores: ['Flores', [['Sin flores', 0], ['Flores de campo', 30], ['Girasoles', 35], ['Rosas rojas', 55]]],
  velas: ['Velas', [['Sin velas', 0], ['Velas aromáticas', 20], ['Candelabro rústico', 40], ['Farolitos de luz cálida', 45]]],
  adornos: ['Adornos', [['Sin adornos', 0], ['Mantel y camino de mesa', 25], ['Globos y letrero de celebración', 50], ['Pétalos y detalle de aniversario', 60]]]
};
const decoSel = r => Object.entries(DECO).map(([k, [t, o]]) => [t, o[(r.deco || {})[k] || 0]]).filter(x => x[1][1] > 0);
const decoTot = r => decoSel(r).reduce((a, x) => a + x[1][1], 0);
const keepForm = () => { const f = $('#fd'); if (f) saveR({ draft: Object.fromEntries(new FormData(f)) }); };

V.servicios = () => {
  const r = R(), z = ZDEF[r.zone], u = S.get('user'), ch = r.chairs || [];
  const mesa = t => {
    const sel = r.table === t.n, rr = t.cap <= 2 ? 30 : t.cap <= 4 ? 38 : 48;
    const sillas = Array.from({ length: t.cap }, (_, i) => `<button class="chair ${sel && ch.includes(i) ? 'on' : ''}" ${t.occ ? 'disabled' : `data-act="chair:${t.n}.${i}"`} style="transform:rotate(${i * 360 / t.cap}deg) translateY(-${rr + 16}px)" aria-label="Silla ${i + 1} de la mesa ${t.n}"></button>`).join('');
    return `<div class="mt ${t.occ ? 'occ' : ''} ${sel ? 'sel' : ''}" style="--r:${rr}px">${sillas}<button class="top ${z.round ? 'round' : ''}" ${t.occ ? 'disabled' : `data-act="mesa:${t.n}"`} aria-label="Mesa ${t.n}"><b>${sel ? '✓ ' : ''}${t.n}</b><small>${t.occ ? 'Ocupada' : t.cap + ' pers.'}</small></button></div>`;
  };
  const sel = r.table && z.t.find(t => t.n === r.table);
  return `${head('Un lugar para compartir', 'Elige tu mesa y tus sillas', 'Mira el salón desde arriba, elige una mesa y toca las sillas que usarás.')}<div class="wrap page">${stepper(STEPS_R, 0)}<div class="lay wide"><div class="box">
  <div class="tabs">${Object.entries(ZDEF).map(([k, v]) => `<button class="${r.zone === k ? 'on' : ''}" data-act="zone:${k}"><b>${v.n}</b><small>${v.s}</small></button>`).join('')}</div>
  <div class="row"><b style="font-size:12px">${z.n} · Vista desde arriba</b><small class="muted">Toca la mesa o las sillas</small></div>
  <div class="plano ${r.zone}"><span class="win"></span><span class="rug"></span><span class="pl" style="left:10px;top:12px"></span><span class="pl" style="right:10px;top:12px"></span><span class="pl" style="left:10px;bottom:10px"></span><span class="pl" style="right:10px;bottom:10px"></span>${z.t.map(mesa).join('')}<span class="door">↑ ENTRADA AL SALÓN</span></div>
  <div class="leg"><span><i></i>Silla libre</span><span><i class="s"></i>Silla elegida</span><span><i class="o"></i>Ocupada</span></div></div>
  <div><div class="box"><h3>${sel ? 'Tu mesa seleccionada' : 'Selecciona una mesa'}</h3>${sel ? `<div class="det"><div class="tr"><span>Mesa</span><b>Mesa ${sel.n}</b></div><div class="tr"><span>Zona</span><b>${z.n}</b></div><div class="tr"><span>Sillas a usar</span><b>${ch.length} de ${sel.cap}</b></div></div><p class="muted" style="margin-bottom:14px">Toca una silla del plano para quitarla o ponerla.</p>` : '<p class="muted" style="margin:10px 0 14px">Toca una mesa disponible del plano para continuar.</p>'}
  <button class="btn block" data-act="reservar" ${sel ? '' : 'disabled'}>${u ? 'Continuar con fecha y hora →' : 'REGÍSTRATE'}</button></div>
  <div class="box" style="margin-top:16px"><h4>Nuestro salón</h4><p class="muted" style="margin:6px 0 10px">Madera, plantas y luz cálida. Tolerancia de 15 min.</p><div class="chips"><span>WiFi libre</span><span>Cochera</span><span>Sillas de bebé</span><span>Yape / Plin</span></div></div></div></div></div>`;
};

const calHTML = () => {
  const r = R(), now = new Date(); now.setHours(0, 0, 0, 0); cal = cal || { y: now.getFullYear(), m: now.getMonth() };
  const off = (new Date(cal.y, cal.m, 1).getDay() + 6) % 7, days = new Date(cal.y, cal.m + 1, 0).getDate();
  let h = `<div class="calh"><b>${MES[cal.m]} ${cal.y}</b><span><button data-act="cal:-1">‹</button><button data-act="cal:1">›</button></span></div><div class="cal">${'LMMJVSD'.split('').map(x => `<i class="dw">${x}</i>`).join('')}${'<i></i>'.repeat(off)}`;
  for (let d = 1; d <= days; d++) { const k = `${cal.y}-${String(cal.m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`; h += `<button class="day ${r.date === k ? 'on' : ''}" data-act="date:${k}" ${new Date(cal.y, cal.m, d) < now ? 'disabled' : ''}>${d}</button>`; }
  return h + '</div>';
};
const resSum = (r, z) => `<div class="tr"><span>Mesa</span><b>Mesa ${r.table}</b></div><div class="tr"><span>Zona</span><b>${z}</b></div><div class="tr"><span>Sillas</span><b>${(r.chairs || []).map(i => i + 1).join(', ') || '—'} (${r.cap} pers.)</b></div><div class="tr"><span>Fecha</span><b>${r.date ? fmtD(r.date) : '—'}</b></div><div class="tr"><span>Hora</span><b>${r.time || '—'}</b></div>${decoSel(r).map(([t, [n, p]]) => `<div class="tr"><span>${t}</span><b>${n} · ${money(p)}</b></div>`).join('')}${decoTot(r) ? `<div class="tr"><span>Extras de decoración</span><b>${money(decoTot(r))}</b></div>` : ''}`;

V.fecha = () => {
  const r = R(), z = ZDEF[r.zone].n, dl = r.date ? new Date(r.date + 'T00:00').toLocaleDateString('es-PE', { weekday: 'long' }) : '';
  return `${head('Preparamos tu visita', '¿Cuándo nos encontramos?', `Selecciona la fecha y la hora. Tu Mesa ${r.table}, en la ${z}, sigue seleccionada.`)}<div class="wrap page">${stepper(STEPS_R, 1)}<div class="lay wide"><div><div class="box cols" style="gap:30px"><div><h3>Selecciona la fecha</h3>${calHTML()}<small style="color:var(--gold2)">${r.date ? `Seleccionada: ${dl} ${fmtD(r.date)}` : 'Aún no elegiste una fecha'}</small></div>
  <div><h3>Hora disponible</h3><small class="muted">Horarios para ${r.cap} personas, en la ${z}.</small>${Object.entries(HORAS).map(([k, hs]) => `<p class="eyebrow" style="margin-top:12px">${k}</p><div class="hours">${hs.map(h => `<button class="${r.time === h ? 'on' : ''}" data-act="time:${h}">${h}</button>`).join('')}</div>`).join('')}</div></div>
  <div class="note"><b>Haz tus cambios con tranquilidad</b><br><span class="muted">Puedes cancelar o modificar tu reserva hasta 2 horas antes de la hora seleccionada.</span></div></div>
  <aside class="box"><h3 style="margin-bottom:12px">Revisa tu reserva</h3><div class="det">${resSum(r, z)}</div><button class="btn block" data-act="book">Continuar: decoración y datos →</button><a class="btn ghost block" href="#/servicios" style="margin-top:10px">Volver a elegir mesa</a></aside></div></div>`;
};

V.decoracion = () => {
  const r = R(), z = ZDEF[r.zone].n, u = S.get('user', {}), d = { d: u.dni || '', t: u.phone || '', ...(r.draft || {}) }, dc = r.deco || {};
  const grp = ([k, [t, o]]) => `<div class="dgr"><p class="eyebrow">${t}</p><div class="opts">${o.map(([n, p], i) => `<button type="button" class="opt ${(dc[k] || 0) === i ? 'on' : ''}" data-act="deco:${k}:${i}"><b>${n}</b><small>${p ? '+ ' + money(p) : 'Sin costo'}</small></button>`).join('')}</div></div>`;
  return `${head('Haz tu mesa única', 'Decoración y datos del titular', 'Elige cómo quieres tu mesa y déjanos tus datos para confirmar la reserva.')}<div class="wrap page">${stepper(STEPS_R, 2)}<div class="lay wide"><form id="fd" novalidate><div class="box"><h3 style="margin-bottom:6px">Decora tu mesa</h3><p class="muted" style="margin-bottom:12px">Cada adorno tiene un costo extra que se paga en el local.</p>${Object.entries(DECO).map(grp).join('')}</div>
  <div class="box" style="margin-top:18px"><h3 style="margin-bottom:14px">Datos del titular</h3>
  <label class="field">Nombre y apellidos *<input name="n" placeholder="Como figura en tu DNI" value="${d.n || ''}"></label>
  <div class="g2"><label class="field">DNI *<input name="d" inputmode="numeric" maxlength="8" value="${d.d}"></label><label class="field">Celular / WhatsApp *<input name="t" inputmode="numeric" maxlength="9" value="${d.t}"></label></div>
  <div class="g2"><label class="field">Teléfono adicional (otra persona o fijo)<input name="t2" inputmode="numeric" maxlength="9" value="${d.t2 || ''}"></label><label class="field">Correo electrónico *<input name="e" type="email" placeholder="tu.correo@ejemplo.com" value="${d.e || ''}"></label></div>
  <label class="field">Motivo de la visita<select name="o">${['Reunión familiar', 'Cumpleaños', 'Aniversario', 'Cena romántica', 'Negocios', 'Otro'].map(x => `<option ${d.o === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label>
  <label class="field">Notas, alergias o pedidos especiales (opcional)<textarea name="m" rows="3">${d.m || ''}</textarea></label>
  <label style="display:flex;gap:8px;align-items:center"><input type="checkbox" name="ok" ${d.ok ? 'checked' : ''}> Acepto la tolerancia de 15 min y los costos extra de decoración.</label><div class="err" id="ferr"></div></div>
  <div class="acts"><a class="btn ghost" href="#/fecha" style="flex:0 0 auto">← Volver a fecha y hora</a><button class="btn">Confirmar reserva →</button></div></form>
  <aside class="box"><h3 style="margin-bottom:12px">Tu reserva</h3><div class="det">${resSum(r, z)}</div><small class="muted">La decoración se paga en el local el día de tu visita.</small></aside></div></div>`;
};
A.decoracion = () => $('#fd').addEventListener('submit', e => {
  e.preventDefault(); const f = e.target, v = Object.fromEntries(new FormData(f)); saveR({ draft: v });
  const err = v.n.trim().length < 5 ? 'Escribe tu nombre y apellidos.' : !/^\d{8}$/.test(v.d) ? 'El DNI debe tener 8 dígitos.' : !/^9\d{8}$/.test(v.t) ? 'El celular debe tener 9 dígitos y empezar con 9.' : (v.t2 && !/^\d{7,9}$/.test(v.t2)) ? 'El teléfono adicional no es válido.' : !/^\S+@\S+\.\S+$/.test(v.e) ? 'Escribe un correo válido.' : !v.ok ? 'Debes aceptar las condiciones.' : '';
  if (err) return $('#ferr').textContent = err;
  saveR({ data: v }); go('procesando-reserva');
});

V['procesando-reserva'] = () => { const r = R(); return wait('', 'Estamos preparando tu encuentro', 'Procesando tu reserva…', 'Por favor, espera un momento mientras revisamos tu selección. Tu reserva todavía no está confirmada.',
  `<div class="eyebrow">Solicitud pendiente</div><div class="det">${resSum(r, ZDEF[r.zone].n)}</div>`, 'Mantén esta pantalla abierta y no envíes otra solicitud.'); };
A['procesando-reserva'] = () => { timer = setTimeout(() => { const r = R(); S.set('lastRes', { ...r, id: code('FT'), zn: ZDEF[r.zone].n }); S.del('res'); go('reserva-ok'); }, 2800); };
V['reserva-ok'] = () => { const r = S.get('lastRes'), t = (r.data || {}).t || ''; return `<div class="wrap wait"><div><div class="big-ic ok">${ic.check}</div><div class="eyebrow">Tu mesa te espera</div><h1>¡Reserva exitosa!</h1><p class="muted" style="margin:14px 0">Tu mesa ha sido reservada correctamente${t ? ' y te escribiremos al ' + t : ''}. ¡Te esperamos para vivir una gran experiencia!</p>
  <div class="box"><div class="eyebrow">Reserva #${r.id}</div><div class="det">${resSum(r, r.zn)}</div></div><div class="acts"><a class="btn" href="#/cuenta">Ver mi reserva</a><a class="btn ghost" href="#/inicio">Volver al inicio</a></div>
  <p class="muted" style="margin-top:14px;font-size:12px">Puedes cancelar o modificar tu reserva hasta 2 horas antes. Conserva tu número de reserva para consultar los detalles.</p></div><div>${im('salon', 'Salón')}<h3 style="margin-top:14px">Cada encuentro merece un festejo.</h3></div></div>`; };

/* ---- Cuenta y login ---- */
V.cuenta = () => { const u = S.get('user'), o = S.get('order'), r = S.get('lastRes');
  return `${head('Tu espacio', 'Mi cuenta', `DNI ${u.dni.slice(0, 2)}****${u.dni.slice(-2)} · Cel. ${u.phone}`)}<div class="wrap page"><div class="cols"><div class="box"><h3>Último pedido</h3>${o ? `<div class="det"><div class="tr"><span>Pedido</span><b>#${o.id}</b></div><div class="tr"><span>Total</span><b>${money(o.total)}</b></div><div class="tr"><span>Método</span><b>${o.pm}</b></div></div><small class="muted">${o.items.map(x => `${x.q}× ${x.n}`).join(' · ')}</small>` : '<p class="muted" style="margin:10px 0">Aún no tienes pedidos.</p><a class="btn sm" href="#/carta">Ver la carta</a>'}</div>
  <div class="box"><h3>Última reserva</h3>${r ? `<div class="eyebrow" style="margin-top:8px">Reserva #${r.id}</div><div class="det">${resSum(r, r.zn)}</div>` : '<p class="muted" style="margin:10px 0">Aún no tienes reservas.</p><a class="btn sm" href="#/servicios">Reservar mesa</a>'}</div></div><div class="acts" style="margin-top:22px"><button class="btn ghost" data-act="logout" style="flex:0 0 auto">Cerrar sesión</button></div></div>`; };

V.login = () => `<div class="login"><a class="back" href="#/inicio">← Volver al inicio</a><form class="card" id="fl" novalidate><div class="logo">${LOGO}</div><h1>Bienvenido</h1><p style="color:#c9b9a4;margin-bottom:20px">Para poder visualizar nuestra carta, servicios y realizar tu reserva, ingresa tus datos.</p>
  <label class="field">Número de DNI<input name="d" inputmode="numeric" maxlength="8" placeholder="Ingresa tu DNI"><small>Escribe los 8 dígitos de tu documento.</small></label>
  <label class="field">Número de teléfono<input name="t" inputmode="numeric" maxlength="9" placeholder="Ingresa tu número de teléfono"><small>Usaremos este número para confirmar tu reserva.</small></label><div class="err" id="lerr"></div>
  <button class="btn block">Ingresar ${ic.arrow}</button><p style="margin:16px 0 4px"><small>Tus datos están seguros y solo serán usados para brindarte una mejor experiencia.</small></p><em style="font:italic 20px var(--serif);color:var(--gold)">Es un gusto tenerte aquí.</em></form></div>`;
A.login = () => $('#fl').addEventListener('submit', e => {
  e.preventDefault(); const d = e.target.d.value.trim(), t = e.target.t.value.trim();
  if (!/^\d{8}$/.test(d)) return $('#lerr').textContent = 'El DNI debe tener 8 dígitos.';
  if (!/^9\d{8}$/.test(t)) return $('#lerr').textContent = 'El teléfono debe tener 9 dígitos y empezar con 9.';
  S.set('user', { dni: d, phone: t }); const nx = S.get('next', 'inicio'); S.del('next'); toast('¡Bienvenido a Festejo!'); go(nx);
});

/* ========= Router ========= */
const NAV = [['inicio', 'Inicio'], ['nosotros', 'Nosotros'], ['servicios', 'Servicios'], ['carta', 'Menú'], ['contacto', 'Contacto']];
const GROUP = { carrito: 'carta', entrega: 'carta', pago: 'carta', confirmado: 'carta', fecha: 'servicios', decoracion: 'servicios', 'reserva-ok': 'servicios' };
const GUARD = ['carrito', 'entrega', 'pago', 'procesando', 'confirmado', 'fecha', 'decoracion', 'procesando-reserva', 'reserva-ok', 'cuenta'];

function renderHeader() {
  const u = S.get('user'), bare = cur.startsWith('procesando'), act = GROUP[cur] || cur;
  $('#hdr').innerHTML = `<div class="wrap hd"><a href="#/inicio" class="logo">${LOGO}</a>${bare ? '' : `<nav>${NAV.map(([k, t]) => `<a href="#/${k}" class="${act === k ? 'on' : ''}">${t}</a>`).join('')}</nav>
  <div class="hr"><a class="btn sm hbtn" href="#/servicios">Reservar</a><a href="#/${u ? 'cuenta' : 'login'}" class="ib" title="${u ? 'Mi cuenta' : 'Ingresar'}">${ic.user}</a>${u ? `<a href="#/carrito" class="ib bag" title="Carrito">${ic.bag}<em>${cnt()}</em></a>` : ''}</div>`}</div>`;
}
const paint = () => { $('#app').innerHTML = V[cur](); if (A[cur]) A[cur](); renderHeader(); };
function route() {
  clearTimeout(timer);
  let h = location.hash.replace(/^#\/?/, '') || 'inicio';
  if (!V[h]) h = 'inicio';
  if (GUARD.includes(h) && !S.get('user')) { S.set('next', h); h = 'login'; }
  if (['carrito', 'entrega', 'pago', 'procesando'].includes(h) && !cnt()) h = h === 'carrito' ? h : 'carrito';
  if (['fecha', 'decoracion', 'procesando-reserva'].includes(h) && !(R().table)) h = 'servicios';
  if (['decoracion', 'procesando-reserva'].includes(h) && !(R().date && R().time)) h = 'fecha';
  if (h === 'procesando-reserva' && !R().data) h = 'decoracion';
  if (h === 'confirmado' && !S.get('order')) h = 'inicio';
  if (h === 'reserva-ok' && !S.get('lastRes')) h = 'inicio';
  cur = h; document.body.dataset.page = h; paint(); scrollTo(0, 0);
}
function refresh() { renderHeader(); if (cur === 'carta') $('#cbody').innerHTML = cartaBody(); else if (cur === 'carrito') paint(); }

/* ========= Eventos ========= */
const ACT = {
  pcat: v => { pcat = v; paint(); },
  cat: v => { ccat = v; cq = ''; paint(); },
  pm: v => { pm = v; S.set('pm', v); $('#ppanel').innerHTML = payPanel(); document.querySelectorAll('.pm button').forEach(b => b.classList.toggle('on', b.dataset.act === 'pm:' + v)); },
  zone: v => { const r = R(); saveR({ zone: v, table: r.zone === v ? r.table : null }); paint(); },
  mesa: v => { const t = ZDEF[R().zone].t.find(x => x.n == v); saveR({ table: t.n, cap: t.cap, chairs: Array.from({ length: t.cap }, (_, i) => i) }); paint(); },
  chair: v => { const [n, i] = v.split('.').map(Number), r = R(); if (r.table !== n) return ACT.mesa(String(n)); let ch = r.chairs || []; ch = ch.includes(i) ? ch.filter(x => x !== i) : [...ch, i]; if (!ch.length) return toast('Elige al menos una silla'); saveR({ chairs: ch.sort((a, b) => a - b), cap: ch.length }); paint(); },
  deco: v => { keepForm(); const [k, i] = v.split(':'), r = R(); saveR({ deco: { ...(r.deco || {}), [k]: +i } }); paint(); },
  reservar: () => { if (!S.get('user')) { S.set('next', 'servicios'); toast('Ingresa tus datos para reservar'); return go('login'); } go('fecha'); },
  cal: v => { cal.m += +v; if (cal.m > 11) { cal.m = 0; cal.y++; } if (cal.m < 0) { cal.m = 11; cal.y--; } paint(); },
  date: v => { saveR({ date: v }); paint(); },
  time: v => { saveR({ time: v }); paint(); },
  book: () => { const r = R(); if (!r.date || !r.time) return toast('Elige una fecha y una hora'); go('decoracion'); },
  logout: () => { S.del('user'); toast('Sesión cerrada'); go('inicio'); },
  pay: () => {
    if (pm === 'card') {
      const n = $('#cn').value.trim(), c = $('#cc').value.replace(/\s/g, ''), x = $('#cx').value, v = $('#cv').value;
      const err = n.length < 3 ? 'Escribe el nombre del titular.' : !/^\d{16}$/.test(c) ? 'El número de tarjeta debe tener 16 dígitos.' : !/^(0[1-9]|1[0-2])\/\d{2}$/.test(x) ? 'Fecha inválida (MM/AA).' : !/^\d{3,4}$/.test(v) ? 'Código de seguridad inválido.' : '';
      if (err) return $('#perr').textContent = err;
    }
    go('procesando');
  }
};
document.addEventListener('click', e => {
  const t = e.target.closest('[data-add],[data-inc],[data-dec],[data-del],[data-act]'); if (!t) return;
  const d = t.dataset;
  if (d.act) { const i = d.act.indexOf(':'), k = i < 0 ? d.act : d.act.slice(0, i), v = i < 0 ? '' : d.act.slice(i + 1); return ACT[k](v); }
  if (d.add) { if (!S.get('user')) { S.set('next', cur); toast('Ingresa tus datos para agregar productos'); return go('login'); } setQ(d.add, (cart()[d.add] || 0) + 1); toast(byId(d.add).n + ' agregado al carrito'); }
  if (d.inc) setQ(d.inc, cart()[d.inc] + 1);
  if (d.dec) setQ(d.dec, cart()[d.dec] - 1);
  if (d.del) setQ(d.del, 0);
  refresh();
});
document.addEventListener('input', e => {
  const t = e.target;
  if (t.id === 'cc') t.value = t.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  if (t.id === 'cx') t.value = t.value.replace(/[^\d]/g, '').slice(0, 4).replace(/^(\d{2})(\d)/, '$1/$2');
  if (t.name === 'd' || t.name === 't' || t.name === 't2' || t.id === 'cv') t.value = t.value.replace(/\D/g, '');
});
window.addEventListener('hashchange', route);
route();
