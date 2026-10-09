/* Cordada — terminal site. One persistent session, hash routes, synthesized sound. */
(() => {
  'use strict';

  const C = {
    green: '#27d898',
    dark: '#141224',
    light: '#e9e7e5',
    purple: '#6767f4',
    red: '#ff4d4d',
    lime: '#a8e001',
  };
  const EASE = 'cubic-bezier(.16,1,.3,1)';
  const NS = 'http://www.w3.org/2000/svg';
  const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const note = (m) => 440 * Math.pow(2, (m - 69) / 12);
  const $ = (s, r = document) => r.querySelector(s);
  const screen = $('#screen');

  function h(tag, attrs = {}, ...kids) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === 'class') e.className = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? '' : v);
    }
    for (const k of kids.flat()) if (k != null && k !== false) e.append(k);
    return e;
  }
  function svg(viewBox, cls, paths) {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', viewBox);
    s.setAttribute('class', cls);
    s.setAttribute('aria-hidden', 'true');
    for (const d of paths) {
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', d);
      s.append(p);
    }
    return s;
  }
  const logoSVG = () => {
    const s = svg(LOGO.viewBox, 'logo', [LOGO.symbol, ...LOGO.letters]);
    s.setAttribute('role', 'img');
    s.setAttribute('aria-label', 'Cordada');
    s.removeAttribute('aria-hidden');
    return s;
  };
  const symbolSVG = () => svg('2 0 190 116', 'sym', [LOGO.symbol]);

  /* ---------------- i18n ---------------- */
  const I18N = {
    es: {
      htmlLang: 'es',
      locale: 'es-ES',
      names: { home: '~', projects: 'proyectos', contact: 'contacto' },
      titles: {
        home: 'Cordada',
        projects: 'Proyectos · Cordada',
        contact: 'Contacto · Cordada',
        notFound: 'No encontrado · Cordada',
      },
      cmds: {
        home: 'cd ~',
        projects: 'ls proyectos/',
        readme: 'cat proyectos/enrutar/README.md',
        contact: 'mail hello@cordada.io',
      },
      tagline: 'Software fiable con la IA en el centro',
      sections: 'Secciones',
      menu: { projects: 'lo que construimos', contact: 'hello@cordada.io' },
      lsDesc: 'saas de servicios técnicos',
      live: 'en producción',
      project: 'proyecto 01',
      metaKind: 'servicios técnicos',
      lede: 'Planificación inteligente de rutas y gestión de trabajos para profesionales de servicios técnicos.',
      p1: 'Una plataforma SaaS para electricistas, fontaneros, técnicos de climatización, empresas de limpieza y otros negocios de servicios en campo.',
      p2: 'Organiza el trabajo en campo con planificación inteligente, comentarios por voz, pedidos de compra y navegación por ubicación.',
      features: 'funciones',
      feats: [
        'Planificación de rutas con IA',
        'Citas con clientes por WhatsApp',
        'Seguimiento de trabajos',
        'Gestión de clientes',
        'Comentarios por voz',
        'Pedidos de compra',
        'Navegación por ubicación',
        'Pensado para el móvil',
      ],
      open: '==> abrir enrutar.com ↗',
      imgAlt: 'La app de enrutar',
      sayHello: 'Hablemos.',
      contactLede: 'Cuéntanos qué quieres construir. Te respondemos desde Mallorca.',
      to: 'para:',
      from: 'de:',
      subject: 'asunto:',
      message: 'mensaje:',
      phFrom: 'tu@empresa.com',
      phSubj: 'Un proyecto',
      phMsg: 'Unas líneas sobre la idea…',
      ctrlEnter: 'ctrl + enter para enviar',
      send: '[ enviar ↵ ]',
      sending: 'abriendo tu cliente de correo … ok',
      defSubject: 'Hola Cordada',
      noSuch: 'cd: no existe el archivo o directorio: ',
      tryL: 'prueba ',
      or: ' o ',
      typeCmd: 'Escribe un comando',
      hintHome: 'escribe help, o pulsa 1–2',
      hint: 'escribe help',
      help: [
        ['proyectos', 'lo que construimos'],
        ['contacto', 'escríbenos'],
        ['open enrutar', 'visitar enrutar.com'],
        ['lang en|es', 'cambiar idioma'],
        ['sound on|off', 'activar o quitar el sonido'],
        ['cd ..', 'volver atrás'],
        ['clear', 'limpiar la pantalla'],
        ['ctrl + d', 'cerrar la sesión'],
      ],
      soundOut: (w) => `sonido: ${w ? 'on' : 'off'}`,
      soundBtn: (w) => `sonido ${w ? 'on' : 'off'}`,
      opening: 'abriendo https://enrutar.com …',
      sudo: 'guest no está en el archivo sudoers. Se informará de este incidente.',
      rm: 'rm: permiso denegado. Buen intento.',
      exit: ['no hay salida. mejor prueba ', '.'],
      closed: '[proceso completado]',
      reopen: 'pulsa cualquier tecla para volver a abrir',
      vim: 'esto es una web. pero respetamos la elección.',
      notFoundCmd: 'comando no encontrado: ',
      notFoundHint: '\nescribe "help" para ver los comandos.',
      langOut: 'idioma: español',
    },
    en: {
      htmlLang: 'en',
      locale: 'en-GB',
      names: { home: '~', projects: 'projects', contact: 'contact' },
      titles: {
        home: 'Cordada',
        projects: 'Projects · Cordada',
        contact: 'Contact · Cordada',
        notFound: 'Not found · Cordada',
      },
      cmds: {
        home: 'cd ~',
        projects: 'ls projects/',
        readme: 'cat projects/enrutar/README.md',
        contact: 'mail hello@cordada.io',
      },
      tagline: 'Building AI-first reliable software',
      sections: 'Sections',
      menu: { projects: 'what we build', contact: 'hello@cordada.io' },
      lsDesc: 'field service saas',
      live: 'live',
      project: 'project 01',
      metaKind: 'field service',
      lede: 'Smart route planning and job management for field service professionals.',
      p1: 'A SaaS platform for electricians, plumbers, HVAC technicians, cleaning services and other field service businesses.',
      p2: 'Streamline field operations with smart scheduling, voice-to-text comments, purchase orders and location-based navigation.',
      features: 'features',
      feats: [
        'AI route planning',
        'WhatsApp client scheduling',
        'Job tracking',
        'Client management',
        'Voice-to-text comments',
        'Purchase orders',
        'Location-based navigation',
        'Mobile-first interface',
      ],
      open: '==> open enrutar.com ↗',
      imgAlt: 'The enrutar app',
      sayHello: 'Say hello.',
      contactLede: 'Tell us what you want to build. We answer from Mallorca.',
      to: 'to:',
      from: 'from:',
      subject: 'subject:',
      message: 'message:',
      phFrom: 'you@company.com',
      phSubj: 'A project',
      phMsg: 'A few lines about it…',
      ctrlEnter: 'ctrl + enter to send',
      send: '[ send ↵ ]',
      sending: 'handing off to your mail client … ok',
      defSubject: 'Hello Cordada',
      noSuch: 'cd: no such file or directory: ',
      tryL: 'try ',
      or: ' or ',
      typeCmd: 'Type a command',
      hintHome: 'type help, or press 1–2',
      hint: 'type help',
      help: [
        ['projects', 'what we build'],
        ['contact', 'write to us'],
        ['open enrutar', 'visit enrutar.com'],
        ['lang en|es', 'switch language'],
        ['sound on|off', 'toggle sound'],
        ['cd ..', 'go back up'],
        ['clear', 'clear the screen'],
        ['ctrl + d', 'close the session'],
      ],
      soundOut: (w) => `sound: ${w ? 'on' : 'off'}`,
      soundBtn: (w) => `sound ${w ? 'on' : 'off'}`,
      opening: 'opening https://enrutar.com …',
      sudo: 'guest is not in the sudoers file. This incident will be reported.',
      rm: 'rm: permission denied. Nice try.',
      exit: ['there is no exit. try ', ' instead.'],
      closed: '[process completed]',
      reopen: 'press any key to reopen',
      vim: 'this is a website. but we respect the choice.',
      notFoundCmd: 'command not found: ',
      notFoundHint: '\ntype "help" for a list of commands.',
      langOut: 'language: english',
    },
  };
  const qLang = new URLSearchParams(location.search).get('lang');
  let LANG = I18N[qLang]
    ? qLang
    : I18N[localStorage.getItem('cordada-lang')]
      ? localStorage.getItem('cordada-lang')
      : 'es';
  const T = () => I18N[LANG];

  /* ---------------- Sound ---------------- */
  const Snd = {
    ctx: null,
    on: false,
    init() {
      if (this.ctx) return;
      const c = new (window.AudioContext || window.webkitAudioContext)();
      const comp = c.createDynamicsCompressor();
      comp.threshold.value = -16;
      comp.ratio.value = 3;
      comp.connect(c.destination);
      const master = c.createGain();
      master.gain.value = 0.85;
      master.connect(comp);
      const verb = c.createConvolver(),
        n = Math.floor(c.sampleRate * 2.6),
        ib = c.createBuffer(2, n, c.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const d = ib.getChannelData(ch);
        for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3);
      }
      verb.buffer = ib;
      const wet = c.createGain();
      wet.gain.value = 0.28;
      verb.connect(wet);
      wet.connect(master);
      const nb = c.createBuffer(1, c.sampleRate, c.sampleRate),
        nd = nb.getChannelData(0);
      for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
      Object.assign(this, { ctx: c, master, verb, nb });
    },
    ok() {
      return this.on && this.ctx && this.ctx.state === 'running';
    },
    T(d = 0) {
      return this.ctx.currentTime + 0.012 + d;
    },
    out(node, { dry = false, pan = 0 } = {}) {
      let n = node;
      if (pan && this.ctx.createStereoPanner) {
        const p = this.ctx.createStereoPanner();
        p.pan.value = pan;
        n.connect(p);
        n = p;
      }
      n.connect(this.master);
      if (!dry) n.connect(this.verb);
    },
    tone(
      f,
      d = 0,
      {
        type = 'sine',
        gain = 0.12,
        attack = 0.004,
        dur = 0.8,
        pan = 0,
        to = null,
        dry = false,
      } = {}
    ) {
      if (!this.ok()) return;
      const c = this.ctx,
        T = this.T(d),
        o = c.createOscillator(),
        g = c.createGain();
      o.type = type;
      o.frequency.setValueAtTime(f, T);
      if (to) o.frequency.exponentialRampToValueAtTime(to, T + dur);
      g.gain.setValueAtTime(0, T);
      g.gain.linearRampToValueAtTime(gain, T + attack);
      g.gain.exponentialRampToValueAtTime(0.0001, T + dur);
      o.connect(g);
      this.out(g, { dry, pan });
      o.start(T);
      o.stop(T + dur + 0.05);
    },
    noise(d, dur, { gain = 0.06, freq = 3000, to = null, q = 1.4, attack = 0.001 } = {}) {
      if (!this.ok()) return;
      const c = this.ctx,
        T = this.T(d),
        s = c.createBufferSource(),
        f = c.createBiquadFilter(),
        g = c.createGain();
      s.buffer = this.nb;
      s.loop = true;
      f.type = 'bandpass';
      f.Q.value = q;
      f.frequency.setValueAtTime(freq, T);
      if (to) f.frequency.exponentialRampToValueAtTime(to, T + dur);
      g.gain.setValueAtTime(0, T);
      g.gain.linearRampToValueAtTime(gain, T + attack);
      g.gain.exponentialRampToValueAtTime(0.0001, T + dur);
      s.connect(f);
      f.connect(g);
      this.out(g, { dry: dur < 0.1 });
      s.start(T, Math.random() * 0.5);
      s.stop(T + dur + 0.05);
    },
    key(d = 0) {
      this.noise(d, 0.04, {
        gain: 0.05 + Math.random() * 0.05,
        freq: 2400 + Math.random() * 2800,
        q: 1.6,
      });
    },
    enter() {
      this.noise(0, 0.05, { gain: 0.14, freq: 1500, q: 1.2 });
    },
    tick(d = 0) {
      this.noise(d, 0.025, { gain: 0.02, freq: 6000 + Math.random() * 2500, q: 4 });
    },
    blip(m, d = 0, g = 0.016, pan = 0) {
      this.tone(note(m), d, { type: 'square', gain: g, dur: 0.06, pan });
      this.tone(note(m + 12), d + 0.11, { type: 'square', gain: g * 0.6, dur: 0.05, pan });
    },
    thump(d = 0, f = 84, gain = 0.38) {
      this.tone(f, d, { gain, dur: 0.7, to: 36, dry: true });
    },
    pad(ms, d = 0, dur = 4, gain = 0.02, cutoff = 900) {
      if (!this.ok()) return;
      const c = this.ctx,
        T = this.T(d),
        lp = c.createBiquadFilter(),
        g = c.createGain();
      lp.type = 'lowpass';
      lp.frequency.value = cutoff;
      g.gain.setValueAtTime(0, T);
      g.gain.linearRampToValueAtTime(gain, T + dur * 0.2);
      g.gain.setValueAtTime(gain, T + dur * 0.45);
      g.gain.exponentialRampToValueAtTime(0.0001, T + dur);
      lp.connect(g);
      this.out(g);
      for (const m of ms)
        for (const dt of [-7, 7]) {
          const o = c.createOscillator();
          o.type = 'sawtooth';
          o.frequency.value = note(m);
          o.detune.value = dt;
          o.connect(lp);
          o.start(T);
          o.stop(T + dur + 0.05);
        }
    },
    out_() {
      this.tone(900, 0, { type: 'square', gain: 0.012, dur: 0.14, to: 180 });
      this.noise(0, 0.18, { gain: 0.03, freq: 2500, to: 400, q: 0.8, attack: 0.01 });
    },
    scan(dur) {
      this.noise(0, dur, { gain: 0.035, freq: 400, to: 5000, q: 2, attack: dur * 0.5 });
      this.tone(note(60), 0, { type: 'sine', gain: 0.03, dur, to: note(72), attack: dur * 0.6 });
    },
    chime() {
      this.blip(79, 0, 0.02);
      this.blip(84, 0.09, 0.02);
    },
    error() {
      this.tone(note(50), 0, { type: 'square', gain: 0.018, dur: 0.09 });
      this.tone(note(49), 0.1, { type: 'square', gain: 0.018, dur: 0.12 });
    },
  };

  /* ---------------- Sessions: every render is skippable ---------------- */
  let cur = null;
  class Session {
    constructor() {
      this.active = true;
      this.fast = REDUCE;
      this.dead = false;
      this.anims = [];
      this.waits = new Set();
      this.tasks = new Set();
      document.body.classList.add('busy');
    }
    wait(ms) {
      if (this.fast || this.dead) return Promise.resolve();
      return new Promise((r) => {
        const o = { r };
        o.id = setTimeout(() => {
          this.waits.delete(o);
          r();
        }, ms);
        this.waits.add(o);
      });
    }
    skip() {
      if (this.fast) return;
      this.fast = true;
      for (const o of this.waits) {
        clearTimeout(o.id);
        o.r();
      }
      this.waits.clear();
      for (const a of this.anims)
        try {
          a.finish();
        } catch (e) {}
      for (const f of this.tasks) f();
      this.tasks.clear();
      this.done();
    }
    kill() {
      this.skip();
      this.dead = true;
    }
    anim(el, kf, opt) {
      const a = el.animate(kf, { fill: 'both', ...opt });
      this.anims.push(a);
      if (this.fast) a.finish();
      return a;
    }
    sfx(fn) {
      if (!this.fast && !this.dead) fn();
    }
    done() {
      this.active = false;
      if (cur === this) document.body.classList.remove('busy');
    }
  }

  function follow(S, el) {
    if (S.fast) return;
    const r = el.getBoundingClientRect(),
      sr = screen.getBoundingClientRect();
    if (r.bottom > sr.bottom - 24)
      screen.scrollBy({ top: r.bottom - sr.bottom + 96, behavior: 'smooth' });
  }
  async function type(S, el, text, { min = 45, max = 120 } = {}) {
    for (let i = 1; i <= text.length; i++) {
      if (S.fast) {
        el.textContent = text;
        return;
      }
      el.textContent = text.slice(0, i);
      S.sfx(() => Snd.key());
      await S.wait(min + Math.random() * (max - min) + (text[i - 1] === ' ' ? 70 : 0));
    }
  }
  function promptParts(path = '~') {
    return [
      h('span', { class: 'u' }, 'guest@cordada'),
      ' ',
      h('span', { class: 'p' }, path),
      ' ',
      h('span', { class: 's' }, '$'),
      ' ',
    ];
  }
  async function cmd(S, parent, text, { pretyped = false, speed } = {}) {
    const c = h('span', { class: 'c' }),
      cursor = h('span', { class: 'cursor' });
    const line = h('div', { class: 'line prompt' }, promptParts(), c, cursor);
    parent.append(line);
    if (pretyped) {
      c.textContent = text;
      cursor.remove();
      return line;
    }
    follow(S, line);
    await S.wait(320);
    await type(S, c, text, speed);
    await S.wait(200);
    cursor.remove();
    S.sfx(() => Snd.enter());
    await S.wait(160);
    return line;
  }
  const FLICK = [
    { opacity: 0, transform: 'translateX(-8px)' },
    { opacity: 1, offset: 0.12 },
    { opacity: 0, offset: 0.26 },
    { opacity: 0.85, transform: 'translateX(4px)', offset: 0.42 },
    { opacity: 0.15, offset: 0.58 },
    { opacity: 1, transform: 'translateX(-1px)', offset: 0.75 },
    { opacity: 1, transform: 'none' },
  ];
  const PENT = [0, 2, 4, 7, 9, 12, 14, 16];
  async function glitch(S, els, { stagger = 60, base = 72 } = {}) {
    els.forEach((e, i) => {
      const d = i * stagger + Math.random() * 90;
      S.anim(e, FLICK, { delay: d, duration: 460, easing: 'linear' });
      S.sfx(() =>
        Snd.blip(base + PENT[i % 8], d / 1000, 0.016, -0.5 + i / Math.max(1, els.length - 1))
      );
    });
    await S.wait(els.length * stagger + 480);
  }
  async function reveal(S, els, { stagger = 70, sound = true } = {}) {
    els.forEach((e, i) => {
      S.anim(
        e,
        [
          { opacity: 0, transform: 'translateY(8px)' },
          { opacity: 1, transform: 'none' },
        ],
        { delay: i * stagger, duration: 560, easing: EASE }
      );
      if (sound) S.sfx(() => Snd.tick((i * stagger) / 1000));
    });
    for (const e of els) {
      await S.wait(stagger);
      follow(S, e);
    }
    await S.wait(260);
  }
  const GLYPHS = '!<>-_\\/[]{}=+*^?#01';
  function scramble(S, el, text, dur = 520) {
    if (S.fast) {
      el.textContent = text;
      return Promise.resolve();
    }
    return new Promise((res) => {
      const t0 = performance.now();
      let last = 0;
      const fin = () => {
        el.textContent = text;
        res();
      };
      S.tasks.add(fin);
      const step = (now) => {
        if (S.fast) return;
        const u = Math.min(1, (now - t0) / dur),
          n = Math.floor(u * text.length);
        let s = text.slice(0, n);
        for (let i = n; i < text.length; i++)
          s += /\s/.test(text[i]) ? text[i] : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        el.textContent = s;
        if (now - last > 60) {
          last = now;
          S.sfx(() => Snd.tick());
        }
        if (u < 1) requestAnimationFrame(step);
        else {
          S.tasks.delete(fin);
          fin();
        }
      };
      requestAnimationFrame(step);
    });
  }
  function letters(el, text) {
    el.textContent = '';
    return [...text].map((ch) => {
      const s = h('span', {}, ch === ' ' ? '\u00a0' : ch);
      el.append(s);
      return s;
    });
  }

  /* ---------------- Pages ---------------- */
  let bootDone = false;

  async function home(S, page, { pretyped }) {
    const hero = h('div', { class: 'hero' }),
      logo = logoSVG();
    hero.append(logo);
    const tag = h('div', { class: 'tagline' }),
      col = h('div', { class: 'col' }, tag);
    page.append(hero, col);
    const parts = [...logo.querySelectorAll('path')];
    parts.forEach((p) => (p.style.opacity = 0));

    if (!bootDone && !pretyped) {
      const c = h('span', { class: 'c' }),
        cursor = h('span', { class: 'cursor' });
      const boot = h(
        'div',
        { class: 'boot line prompt' },
        h('span', { class: 's' }, '~ $ '),
        c,
        cursor
      );
      hero.append(boot);
      await S.wait(550);
      await type(S, c, 'cordada --init', { min: 55, max: 150 });
      await S.wait(420);
      S.sfx(() => Snd.enter());
      S.anim(
        boot,
        [
          { opacity: 1, filter: 'blur(0)', transform: 'translateY(-50%)' },
          { opacity: 0, filter: 'blur(12px)', transform: 'translateY(-50%) scale(.97)' },
        ],
        { delay: 60, duration: 420, easing: 'ease-in' }
      );
      await S.wait(300);
    }
    bootDone = true;
    S.sfx(() => {
      Snd.thump(0.55);
      Snd.pad([45, 52, 57, 64], 0.5, 4.5);
    });
    await glitch(S, parts);
    await S.wait(300);

    const line = T().tagline,
      txt = document.createTextNode(''),
      tc = h('span', { class: 'cursor' });
    tag.append(txt, tc);
    for (let i = 1; i <= line.length; i++) {
      if (S.fast) break;
      txt.nodeValue = line.slice(0, i);
      if (i % 3 === 0) S.sfx(() => Snd.tick());
      await S.wait(22);
    }
    txt.nodeValue = line;
    await S.wait(250);
    tc.remove();

    const items = [
      ['1', 'projects'],
      ['2', 'contact'],
    ];
    const menu = h(
      'nav',
      { class: 'menu', 'aria-label': T().sections },
      items.map(([k, n]) =>
        h(
          'a',
          { href: '#/' + n, 'data-route': n },
          h('span', { class: 'k' }, `[${k}]`),
          h('span', { class: 'n' }, T().names[n]),
          h('span', { class: 'd' }, T().menu[n]),
          h('span', { class: 'ar' }, '→')
        )
      )
    );
    col.append(menu);
    await reveal(S, [...menu.children], { stagger: 90 });
    return col;
  }

  async function projects(S, page, { pretyped }) {
    const L = T();
    await cmd(S, page, L.cmds.projects, { pretyped });
    const ls = h(
      'div',
      { class: 'ls out', style: 'margin-bottom:36px' },
      h('span', { class: 'perm' }, 'drwxr-xr-x'),
      h('a', { href: 'https://enrutar.com', target: '_blank', rel: 'noopener' }, 'enrutar/'),
      h('span', { class: 'desc' }, L.lsDesc),
      h('span', {}, h('span', { style: `color:${C.green}` }, '● '), L.live)
    );
    page.append(ls);
    await reveal(S, [...ls.children], { stagger: 50 });

    await cmd(S, page, L.cmds.readme, { speed: { min: 28, max: 70 } });
    const label = h('div', { class: 'label' }),
      title = h('h1', { class: 'title' }),
      meta = h('div', { class: 'meta' });
    const scan = h('div', { class: 'scan' }),
      img = h('img', { src: 'assets/enrutar.webp', alt: L.imgAlt, width: 1026, height: 773 });
    const shot = h('figure', { class: 'shot', style: 'margin-left:0;margin-right:0' }, img, scan);
    const prose = h(
      'div',
      { class: 'prose' },
      h('p', { class: 'lede' }, L.lede),
      h('p', {}, L.p1),
      h('p', {}, L.p2)
    );
    const featLabel = h('div', { class: 'label' });
    const feats = L.feats;
    const ul = h(
      'ul',
      { class: 'feat' },
      feats.map((f) => h('li', {}, f))
    );
    const go = h(
      'a',
      { class: 'go', href: 'https://enrutar.com', target: '_blank', rel: 'noopener' },
      L.open
    );
    const art = h('article', { class: 'out' }, label, title, meta, shot, prose, featLabel, ul, go);
    page.append(art);

    [title, meta, shot, prose, featLabel, ul, go].forEach((e) => (e.style.opacity = 0));
    await scramble(S, label, L.project, 380);
    title.style.opacity = '';
    await glitch(S, letters(title, 'enrutar'), { stagger: 55, base: 74 });
    meta.style.opacity = '';
    meta.append(h('span', {}), ' · ', h('span', {}), ' · ', h('span', { class: 'live-dot' }));
    await Promise.all([
      scramble(S, meta.children[0], 'saas', 300),
      scramble(S, meta.children[1], L.metaKind, 420),
      scramble(S, meta.children[2], 'enrutar.com', 420),
    ]);

    shot.style.opacity = '';
    follow(S, shot);
    S.sfx(() => Snd.scan(1.1));
    S.anim(
      img,
      [
        { clipPath: 'inset(0 0 100% 0)', filter: 'brightness(1.8) saturate(0)' },
        { clipPath: 'inset(0 0 0% 0)', filter: 'none' },
      ],
      { duration: 1100, easing: 'cubic-bezier(.65,0,.35,1)' }
    );
    S.anim(
      scan,
      [
        { top: '0%', opacity: 1 },
        { top: '100%', opacity: 1, offset: 0.92 },
        { top: '100%', opacity: 0 },
      ],
      { duration: 1200, easing: 'cubic-bezier(.65,0,.35,1)' }
    );
    await S.wait(1000);
    prose.style.opacity = '';
    await reveal(S, [...prose.children], { stagger: 140 });
    featLabel.style.opacity = '';
    await scramble(S, featLabel, L.features, 300);
    ul.style.opacity = '';
    await reveal(S, [...ul.children], { stagger: 55 });
    go.style.opacity = '';
    await reveal(S, [go]);
    return page;
  }

  async function contact(S, page, { pretyped }) {
    const L = T();
    await cmd(S, page, L.cmds.contact, { pretyped });
    const title = h('h1', { class: 'title' });
    const lede = h('div', { class: 'prose' }, h('p', { class: 'lede' }, L.contactLede));
    const from = h('input', {
      id: 'f-from',
      type: 'email',
      placeholder: L.phFrom,
      autocomplete: 'email',
    });
    const subj = h('input', {
      id: 'f-subj',
      type: 'text',
      placeholder: L.phSubj,
      autocomplete: 'off',
    });
    const msg = h('textarea', { id: 'f-msg', rows: 5, placeholder: L.phMsg });
    const status = h('span', { class: 'd' }, L.ctrlEnter);
    const fields = [
      h(
        'div',
        { class: 'field' },
        h('label', {}, L.to),
        h('span', { class: 'to' }, 'hello@cordada.io')
      ),
      h('div', { class: 'field' }, h('label', { for: 'f-from' }, L.from), from),
      h('div', { class: 'field' }, h('label', { for: 'f-subj' }, L.subject), subj),
      h('div', { class: 'field' }, h('label', { for: 'f-msg' }, L.message), msg),
      h(
        'div',
        { class: 'actions' },
        h('button', { class: 'send', type: 'submit' }, L.send),
        status
      ),
    ];
    const form = h('form', { class: 'form', novalidate: true }, fields);
    const send = (e) => {
      e && e.preventDefault();
      const body = msg.value + (from.value ? `\n\n${from.value}` : '');
      status.textContent = L.sending;
      status.style.color = C.green;
      Snd.chime();
      location.href = `mailto:hello@cordada.io?subject=${encodeURIComponent(
        subj.value || L.defSubject
      )}&body=${encodeURIComponent(body)}`;
    };
    form.addEventListener('submit', send);
    form.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) send(e);
    });
    form.addEventListener('input', (e) => {
      if (e.target.matches('input,textarea')) Snd.key();
    });
    const out = h('section', { class: 'out' }, title, lede, form);
    page.append(out);
    [lede, form].forEach((e) => (e.style.opacity = 0));
    await glitch(S, letters(title, L.sayHello), { stagger: 50, base: 76 });
    lede.style.opacity = '';
    await reveal(S, [lede]);
    form.style.opacity = '';
    await reveal(S, fields, { stagger: 90 });
    return null; // no live prompt here: typing belongs to the form
  }

  async function notFound(S, page, { pretyped, raw }) {
    await cmd(S, page, `cd ${raw}`, { pretyped });
    const r = h(
      'div',
      { class: 'line res out' },
      h('span', { class: 'r' }, T().noSuch + raw),
      '\n',
      h('span', { class: 'd' }, T().tryL),
      link('projects'),
      h('span', { class: 'd' }, T().or),
      link('contact')
    );
    page.append(r);
    S.sfx(() => Snd.error());
    await reveal(S, [r], { sound: false });
    return page;
  }

  /* ---------------- Routing ---------------- */
  const ROUTES = {
    home: { hash: '#/', render: home, cls: 'home' },
    projects: { hash: '#/projects', render: projects },
    contact: { hash: '#/contact', render: contact },
  };
  const ALIASES = {
    home: [
      'home',
      'cd',
      'cd ~',
      '~',
      'cordada',
      'cordada --init',
      'logo',
      'cd ..',
      '..',
      'cd /',
      'start',
      'inicio',
      '0',
      '[0]',
    ],
    projects: [
      'projects',
      'project',
      'ls projects',
      'cd projects',
      'work',
      'portfolio',
      'cat projects/enrutar/readme.md',
      'proyectos',
      'proyecto',
      'ls proyectos',
      'cd proyectos',
      'cat proyectos/enrutar/readme.md',
      '1',
      '[1]',
    ],
    contact: [
      'contact',
      'mail',
      'mail hello@cordada.io',
      'email',
      'hello',
      'hi',
      'cd contact',
      'contacto',
      'cd contacto',
      'hola',
      '2',
      '[2]',
    ],
  };
  const norm = (s) =>
    s
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/(.)\/$/, '$1');
  function resolve(raw) {
    const n = norm(raw);
    for (const [r, a] of Object.entries(ALIASES)) if (a.includes(n)) return r;
    return null;
  }
  function routeFromHash() {
    const k = (location.hash.replace(/^#\/?/, '') || 'home').split('?')[0];
    return k;
  }
  function link(route) {
    return h('a', { href: ROUTES[route].hash, 'data-route': route }, T().names[route]);
  }

  let navLock = false,
    current = null;
  async function navigate(name, how) {
    if (navLock) return;
    navLock = true;
    closed = false;
    const R = ROUTES[name];
    current = name;
    const command = R ? T().cmds[name] : `cd ${name}`;
    if (cur) cur.kill();
    document.body.classList.add('busy');

    const live = $('.live', screen);
    if (how === 'click' && live && !REDUCE) {
      const typed = $('.typed', live),
        hint = $('.hint', live);
      if (hint) hint.hidden = true;
      for (let i = 1; i <= command.length; i++) {
        typed.textContent = command.slice(0, i);
        Snd.key();
        await new Promise((r) => setTimeout(r, 18 + Math.random() * 26));
      }
      await new Promise((r) => setTimeout(r, 120));
      Snd.enter();
    }
    const old = $('.page', screen);
    if (old) {
      if (!REDUCE) {
        Snd.out_();
        await old.animate(
          [
            { opacity: 1, filter: 'none', transform: 'none' },
            { opacity: 0.7, filter: 'blur(1px)', transform: 'translateX(4px)', offset: 0.3 },
            { opacity: 0, filter: 'blur(8px)', transform: 'scale(.99)' },
          ],
          { duration: 260, easing: 'ease-in', fill: 'forwards' }
        ).finished;
      }
      old.remove();
    }
    const hash = R ? R.hash : '#/' + name;
    if (how !== 'history' && how !== 'init' && how !== 'lang' && location.hash !== hash)
      history.pushState(null, '', hash);
    document.title = T().titles[R ? name : 'notFound'];
    document
      .querySelectorAll('.bar nav a')
      .forEach((a) =>
        a.dataset.route === name
          ? a.setAttribute('aria-current', 'page')
          : a.removeAttribute('aria-current')
      );
    screen.scrollTop = 0;
    navLock = false;

    const S = (cur = new Session());
    const page = h('div', { class: 'page ' + ((R && R.cls) || '') });
    screen.append(page);
    const pretyped = how !== 'init';
    const target = await (R ? R.render : notFound)(S, page, { pretyped, raw: name });
    if (S.dead) return;
    S.done();
    if (target) addLive(target, S.fast || how === 'init' ? false : how === 'cli');
  }

  /* ---------------- ctrl + d: close the session ---------------- */
  let closed = false;
  async function closeSession() {
    if (closed || navLock) return;
    closed = true;
    if (cur) cur.kill();
    document.body.classList.remove('busy');
    const live = $('.live', screen);
    if (live) {
      live.classList.remove('live', 'focus');
      live.querySelectorAll('input,.cursor,.hint').forEach((n) => n.remove());
      $('.typed', live).textContent = '^D';
    }
    Snd.out_();
    const old = $('.page', screen);
    if (old && !REDUCE)
      await old.animate(
        [
          { opacity: 1, filter: 'none' },
          { opacity: 0, filter: 'blur(8px)' },
        ],
        { duration: 360, delay: 120, easing: 'ease-in', fill: 'forwards' }
      ).finished;
    if (old) old.remove();
    if (!closed) return;
    const page = h(
      'div',
      { class: 'page closed' },
      h('div', { class: 'line res' }, 'logout'),
      h('div', { class: 'line res' }, h('span', { class: 'd' }, T().closed)),
      h(
        'div',
        { class: 'line res' },
        h('span', { class: 'd' }, T().reopen),
        h('span', { class: 'cursor' })
      )
    );
    screen.append(page);
    page.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
  }
  function reopen() {
    bootDone = false;
    if (location.hash !== '#/') history.pushState(null, '', '#/');
    navigate('home', 'init');
  }

  /* ---------------- Live prompt & commands ---------------- */
  const hist = [];
  let hi = 0;
  const CMDS = [
    'help',
    'ayuda',
    'ls',
    'projects',
    'proyectos',
    'contact',
    'contacto',
    'lang',
    'home',
    'clear',
    'sound',
    'whoami',
    'date',
    'echo',
    'open',
    'history',
    'pwd',
  ];

  function addLive(parent, focus) {
    const input = h('input', {
      type: 'text',
      'aria-label': T().typeCmd,
      autocomplete: 'off',
      autocapitalize: 'off',
      spellcheck: 'false',
      enterkeyhint: 'go',
    });
    const typed = h('span', { class: 'typed' }),
      cursor = h('span', { class: 'cursor' });
    const hint = h(
      'span',
      { class: 'hint' },
      parent.classList.contains('col') ? T().hintHome : T().hint
    );
    const line = h('div', { class: 'line prompt live' }, promptParts(), typed, cursor, hint, input);
    input.addEventListener('input', () => {
      typed.textContent = input.value;
      hint.hidden = !!input.value;
      Snd.key();
    });
    input.addEventListener('focus', () => line.classList.add('focus'));
    input.addEventListener('blur', () => line.classList.remove('focus'));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        exec(input.value, line);
      } else if (e.key === 'ArrowUp' && hist.length) {
        e.preventDefault();
        hi = Math.max(0, hi - 1);
        set(hist[hi]);
      } else if (e.key === 'ArrowDown' && hist.length) {
        e.preventDefault();
        hi = Math.min(hist.length, hi + 1);
        set(hist[hi] || '');
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const m = CMDS.filter((c) => c.startsWith(input.value.trim().toLowerCase()));
        if (m.length === 1) set(m[0] + ' ');
        else if (m.length > 1) {
          Snd.tick();
          hint.hidden = false;
          hint.textContent = m.join('  ');
        }
      } else if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault();
        exec('clear', line);
      }
    });
    const set = (v) => {
      input.value = v;
      typed.textContent = v;
      hint.hidden = !!v;
    };
    parent.append(line);
    line.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
    if (focus) input.focus({ preventScroll: true });
    return line;
  }

  function exec(raw, line) {
    const parent = line.parentElement,
      text = raw.trim();
    // freeze the used prompt
    line.classList.remove('live', 'focus');
    line.classList.add('cli');
    line.querySelectorAll('input,.cursor,.hint').forEach((n) => n.remove());
    if (text) {
      hist.push(text);
      hi = hist.length;
    }
    Snd.enter();
    const route = resolve(text);
    if (route) return navigate(route, 'cli');

    const [c, ...args] = text.split(/\s+/);
    const n = (c || '').toLowerCase();
    let out = null;
    if (!text) out = null;
    else if (n === 'help' || n === 'ayuda')
      out = h(
        'div',
        { class: 'help' },
        T().help.flatMap(([k, d]) => [h('span', { class: 'g' }, k), h('span', { class: 'd' }, d)])
      );
    else if (n === 'ls') out = h('span', {}, link('projects'), '/   ', link('contact'));
    else if (n === 'lang' || n === 'idioma') {
      const want = I18N[(args[0] || '').toLowerCase()]
        ? args[0].toLowerCase()
        : LANG === 'es'
          ? 'en'
          : 'es';
      return setLang(want);
    } else if (n === 'clear') {
      parent.querySelectorAll('.cli').forEach((x) => x.remove());
      addLive(parent, true);
      return;
    } else if (n === 'sound') {
      const want = args[0] ? args[0] === 'on' : !Snd.on;
      setSound(want);
      out = T().soundOut(want);
    } else if (n === 'whoami') out = 'guest';
    else if (n === 'pwd') out = '/home/guest';
    else if (n === 'date')
      out =
        new Date().toLocaleString(T().locale, {
          timeZone: 'Europe/Madrid',
          dateStyle: 'full',
          timeStyle: 'short',
        }) + ' · Mallorca';
    else if (n === 'echo') out = args.join(' ');
    else if (n === 'history')
      out = hist.map((x, i) => `${String(i + 1).padStart(3)}  ${x}`).join('\n');
    else if (n === 'open' && /enrutar/.test(args.join(' '))) {
      window.open('https://enrutar.com', '_blank', 'noopener');
      out = h('span', { class: 'd' }, T().opening);
    } else if (n === 'sudo') out = h('span', { class: 'r' }, T().sudo);
    else if (n === 'rm') out = h('span', { class: 'r' }, T().rm);
    else if (n === 'exit' || n === 'logout')
      out = h('span', { class: 'd' }, T().exit[0], link('contact'), T().exit[1]);
    else if (n === 'ping') out = 'pong';
    else if (n === 'vim' || n === 'emacs' || n === 'nano') out = h('span', { class: 'd' }, T().vim);
    else {
      out = h(
        'span',
        {},
        h('span', { class: 'r' }, T().notFoundCmd + c),
        h('span', { class: 'd' }, T().notFoundHint)
      );
      Snd.error();
    }
    if (out != null) parent.append(h('div', { class: 'line res cli' }, out));
    const next = addLive(parent, true);
    follow({ fast: false }, next);
  }

  function setSound(on) {
    if (on) {
      Snd.init();
      Snd.ctx.resume().then(() => {
        Snd.on = true;
        ui();
        Snd.chime();
      });
    } else {
      Snd.on = false;
      ui();
    }
    localStorage.setItem('cordada-sound', on ? '1' : '0');
    function ui() {
      const b = $('#snd');
      b.replaceChildren('♪ ', h('span', { class: 't' }, T().soundBtn(Snd.on)));
      b.classList.toggle('on', Snd.on);
      b.setAttribute('aria-pressed', Snd.on);
    }
    ui();
  }

  /* ---------------- Global input ---------------- */
  let lastDot = 0;
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-route]');
    if (a && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
      e.preventDefault();
      navigate(a.dataset.route, 'click');
    }
  });
  screen.addEventListener('pointerdown', (e) => {
    if (closed) {
      e.preventDefault();
      reopen();
      return;
    }
    if (cur && cur.active && !e.target.closest('a')) cur.skip();
    if (e.target.closest('.live')) setTimeout(() => $('.live input', screen)?.focus(), 0);
  });
  document.addEventListener('keydown', (e) => {
    if (Snd.on && Snd.ctx && Snd.ctx.state !== 'running') Snd.ctx.resume();
    if (closed) {
      if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key) || e.metaKey) return;
      e.preventDefault();
      reopen();
      return;
    }
    const inField = e.target.matches('input,textarea') && !e.target.closest('.live');
    if (inField || e.metaKey || e.altKey) return;
    if (e.ctrlKey && e.key.toLowerCase() === 'd') {
      const input = $('.live input', screen);
      if (!input || !input.value) {
        e.preventDefault();
        closeSession();
        return;
      }
    }
    if (cur && cur.active && !e.ctrlKey) {
      cur.skip();
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        return;
      }
    }
    const live = $('.live input', screen);
    const idle = !live || !live.value;
    if (idle && /^[0-2]$/.test(e.key)) {
      e.preventDefault();
      navigate(['home', 'projects', 'contact'][+e.key], 'click');
      return;
    }
    // pages without a prompt (contact): typing ".." still goes up a level
    if (!live && e.key === '.' && !e.ctrlKey && current !== 'home') {
      const now = Date.now();
      if (now - lastDot < 800) {
        lastDot = 0;
        navigate('home', 'click');
      } else lastDot = now;
      return;
    }
    if (live && document.activeElement !== live && e.key.length === 1 && !e.ctrlKey) {
      e.preventDefault();
      live.focus({ preventScroll: true });
      live.value += e.key;
      live.dispatchEvent(new Event('input'));
    }
  });
  document.addEventListener('pointerdown', () => {
    if (Snd.on && Snd.ctx && Snd.ctx.state !== 'running') Snd.ctx.resume();
  });
  const onHist = () => {
    if (routeFromHash() !== current) navigate(routeFromHash(), 'history');
  };
  addEventListener('popstate', onHist);
  addEventListener('hashchange', onHist);

  /* ---------------- Status bar ---------------- */
  $('.bar .home').append(symbolSVG());
  $('#snd').addEventListener('click', () => setSound(!Snd.on));
  // Sound is on by default. Browsers keep audio muted until the first click or key press.
  if (localStorage.getItem('cordada-sound') !== '0') {
    Snd.init();
    Snd.on = true;
    setSound(true);
  }

  function applyLang() {
    const L = T();
    document.documentElement.lang = L.htmlLang;
    document.querySelectorAll('.bar nav a[data-route]').forEach((a) => {
      a.lastChild.nodeValue = L.names[a.dataset.route];
    });
    document.querySelectorAll('.lang button').forEach((b) => {
      const on = b.dataset.lang === LANG;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on);
    });
    $('#snd').replaceChildren('♪ ', h('span', { class: 't' }, L.soundBtn(Snd.on)));
    if (current) document.title = L.titles[ROUTES[current] ? current : 'notFound'];
  }
  function setLang(l) {
    if (!I18N[l]) return;
    const changed = l !== LANG;
    LANG = l;
    localStorage.setItem('cordada-lang', l);
    applyLang();
    if (changed) {
      Snd.chime();
      navigate(current || routeFromHash(), 'lang');
    } else {
      const live = $('.live', screen);
      if (live) live.querySelector('input').focus();
    }
  }
  document
    .querySelectorAll('.lang button')
    .forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));
  applyLang();

  document.fonts.ready.then(() => navigate(routeFromHash(), 'init'));
})();
