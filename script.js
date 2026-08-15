/* script.js — Ultra HD Premium v4 */
(function () {
  'use strict';
  const DATA = window.SURPRISE_DATA || {};
  const TEMA = DATA.tema || {};
  const chapters = ['chapter-envelope', 'chapter-letter', 'chapter-dates', 'chapter-photos', 'chapter-video', 'chapter-ar', 'chapter-map', 'chapter-contract'];

  /* ============ 0. LOADING SCREEN ============ */
  function hideLoading() {
    setTimeout(() => document.getElementById('loading-screen').classList.add('hidden'), 2200);
  }
  hideLoading();

  /* ============ 1. FUNDO 3D (corações extrudados + física + parallax) ============ */
  let threeObjs = { camera: null, hearts: [] };

  function initThree() {
    if (!window.THREE) return;
    const canvas = document.getElementById('three-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
    camera.position.z = 16;
    threeObjs.camera = camera;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0.5);
    heartShape.bezierCurveTo(0.5, 0.9, 1.0, 0.5, 0, -0.5);
    heartShape.bezierCurveTo(-1.0, 0.5, -0.5, 0.9, 0, 0.5);
    const extrude = { depth: 0.5, bevelEnabled: true, bevelSegments: 12, bevelSize: 0.15, bevelThickness: 0.15 };

    const hearts = [];
    threeObjs.hearts = hearts;
    const colors = [0xec4899, 0xa855f7, 0xf472b6, 0xc084fc, 0x67e8f9, 0xFFD700];

    for (let i = 0; i < 22; i++) {
      const geo = new THREE.ExtrudeGeometry(heartShape, extrude);
      geo.center();
      const mat = new THREE.MeshPhysicalMaterial({
        color: colors[i % colors.length],
        transparent: true, opacity: 0.38,
        metalness: 0.4, roughness: 0.25,
        clearcoat: 0.8, clearcoatRoughness: 0.15,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set((Math.random() - 0.5) * 28, (Math.random() - 0.5) * 18, (Math.random() - 0.5) * 12 - 1);
      const s = 0.2 + Math.random() * 0.6;
      mesh.scale.set(s, s, s);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      scene.add(mesh);
      hearts.push({ mesh, sp: 0.003 + Math.random() * 0.008, ph: Math.random() * 6.28, fl: 0.002 + Math.random() * 0.005 });
    }

    // Iluminação cinematográfica
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const d1 = new THREE.DirectionalLight(0xff80bf, 1.5); d1.position.set(4, 6, 5); scene.add(d1);
    const d2 = new THREE.DirectionalLight(0xa855f7, 1.0); d2.position.set(-4, -2, 4); scene.add(d2);
    const p1 = new THREE.PointLight(0x67e8f9, 1.2, 35); p1.position.set(0, 0, 6); scene.add(p1);
    const p2 = new THREE.PointLight(0xFFD700, 0.8, 25); p2.position.set(-5, 3, 2); scene.add(p2);

    function animate() {
      requestAnimationFrame(animate);
      const t = Date.now() * 0.001;
      hearts.forEach(h => {
        h.mesh.rotation.x += h.sp; h.mesh.rotation.y += h.sp * 0.7;
        h.mesh.position.y += Math.sin(t + h.ph) * h.fl;
      });
      renderer.render(scene, camera);
    }
    animate();

    addEventListener('resize', () => {
      camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    });
  }
  const lt = setInterval(() => { if (window.THREE) { clearInterval(lt); initThree(); } }, 120);
  setTimeout(() => clearInterval(lt), 6000);

  /* ============ 2. DECORAÇÃO ============ */
  function spawnDecor() {
    const decor = document.getElementById('decor');
    const syms = ['💖', '💗', '🌸', '💜', '✨', '💕', '🌺', '💞', '🌹'];
    for (let i = 0; i < 22; i++) {
      const el = document.createElement('span');
      el.className = 'petal';
      el.textContent = syms[i % syms.length];
      el.style.left = Math.random() * 100 + '%';
      el.style.fontSize = (14 + Math.random() * 26) + 'px';
      el.style.animationDuration = (7 + Math.random() * 11) + 's';
      el.style.animationDelay = (Math.random() * 8) + 's';
      decor.appendChild(el);
    }
  }
  spawnDecor();

  /* ============ 3. CONFETE (canvas-confetti library + fallback) ============ */
  function launchConfetti() {
    if (window.confetti) {
      // Confete real com física
      const defaults = { spread: 360, ticks: 100, gravity: 0.4, decay: 0.94, startVelocity: 30, shapes: ['star', 'circle'], colors: ['#ec4899', '#a855f7', '#67e8f9', '#FFD700', '#ff80bf'] };
      function shoot() {
        confetti({ ...defaults, particleCount: 40, scalar: 1.2 });
        confetti({ ...defaults, particleCount: 20, scalar: 0.8 });
        confetti({ particleCount: 30, spread: 100, origin: { y: 0.6 }, colors: ['#ec4899', '#FFD700', '#a855f7'] });
      }
      shoot();
      setTimeout(shoot, 200);
      setTimeout(shoot, 400);
    } else {
      // Fallback: confete de emoji
      const c = document.getElementById('confetti');
      const syms = ['💖', '💕', '💗', '💓', '💞', '🌹', '✨', '🎉', '🌟'];
      for (let i = 0; i < 50; i++) {
        const el = document.createElement('span');
        el.className = 'confetti-heart';
        el.textContent = syms[Math.floor(Math.random() * syms.length)];
        el.style.left = Math.random() * 100 + '%';
        el.style.fontSize = (16 + Math.random() * 32) + 'px';
        el.style.animationDuration = (2.5 + Math.random() * 3) + 's';
        el.style.animationDelay = (Math.random() * 0.5) + 's';
        c.appendChild(el);
        setTimeout(() => el.remove(), 6000);
      }
    }
  }

  /* ============ 4. ÁUDIO (música + beep) ============ */
  let audioCtx = null, oscillators = [], musicPlaying = false;
  function toggleMusic() {
    const btn = document.getElementById('music-toggle');
    if (musicPlaying) {
      oscillators.forEach(o => { try { o.stop(); } catch (e) {} });
      oscillators = []; audioCtx = null; musicPlaying = false;
      btn.classList.remove('playing'); btn.textContent = '🎵';
    } else {
      try {
        audioCtx = new (AudioContext || webkitAudioContext)();
        [523.25, 659.25, 783.99].forEach(f => {
          const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
          osc.type = 'sine'; osc.frequency.value = f; gain.gain.value = 0.03;
          osc.connect(gain); gain.connect(audioCtx.destination); osc.start(); oscillators.push(osc);
          const lfo = audioCtx.createOscillator(), lg = audioCtx.createGain();
          lfo.frequency.value = 0.3; lg.gain.value = 0.02; lfo.connect(lg); lg.connect(gain.gain); lfo.start(); oscillators.push(lfo);
        });
        musicPlaying = true; btn.classList.add('playing'); btn.textContent = '🔇';
      } catch (e) {}
    }
  }
  document.getElementById('music-toggle').addEventListener('click', toggleMusic);

  function playBeep() {
    try {
      const ac = audioCtx || new (AudioContext || webkitAudioContext)();
      const osc = ac.createOscillator(), gain = ac.createGain();
      osc.frequency.value = 800 + Math.random() * 200; gain.gain.value = 0.02;
      osc.connect(gain); gain.connect(ac.destination); osc.start(); osc.stop(ac.currentTime + 0.03);
    } catch (e) {}
  }
  function playArpeggio() {
    try {
      const ac = audioCtx || new (AudioContext || webkitAudioContext)();
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
        const osc = ac.createOscillator(), gain = ac.createGain();
        osc.frequency.value = f; osc.type = 'sine'; gain.gain.value = 0.06;
        osc.connect(gain); gain.connect(ac.destination);
        osc.start(ac.currentTime + i * 0.12); osc.stop(ac.currentTime + i * 0.12 + 0.35);
      });
    } catch (e) {}
  }

  /* ============ 5. CARTA (typewriter) ============ */
  function fillLetter() {
    const el = document.getElementById('letter-text');
    const text = DATA.carta || '';
    el.textContent = ''; el.classList.add('letter-cursor');
    let i = 0;
    (function type() {
      if (i < text.length) { el.textContent += text[i++]; setTimeout(type, 35); }
      else setTimeout(() => el.classList.remove('letter-cursor'), 1500);
    })();
  }

  /* ============ 6. DATAS + TIMER + TIMELINE ============ */
  function fillDates() {
    const tl = document.getElementById('timeline');
    const datas = DATA.datas || [];
    if (!datas.length) { tl.innerHTML = '<p class="placeholder">Adicione datas no data.js 📅</p>'; return; }
    tl.innerHTML = '';
    datas.forEach(d => {
      const item = document.createElement('div');
      item.className = 'timeline-item';
      item.innerHTML = '<div class="timeline-date">' + esc(d.data) + '</div><div class="timeline-event">' + esc(d.evento) + '</div>';
      tl.appendChild(item);
    });
  }

  function initTimer() {
    if (!DATA.dataInicio) return;
    const inicio = new Date(DATA.dataInicio);
    if (isNaN(inicio)) return;
    const total = Math.max(0, Math.floor((new Date() - inicio) / 86400000));
    const el = document.getElementById('timer-days');
    let current = 0;
    const step = Math.max(1, Math.ceil(total / 40));
    (function count() {
      if (current < total) { current = Math.min(total, current + step); el.textContent = current; setTimeout(count, 30); }
      else el.textContent = total;
    })();
  }

  /* ============ 7. FOTOS + LIGHTBOX ============ */
  function fillPhotos() {
    const grid = document.getElementById('photos-grid');
    const fotos = DATA.fotos || [];
    if (!fotos.length) { grid.innerHTML = '<div class="placeholder">Coloque suas fotos na pasta photos/ 📷</div>'; return; }
    grid.innerHTML = '';
    fotos.forEach(f => {
      const img = document.createElement('img');
      img.src = 'photos/' + f; img.alt = 'Memória';
      img.addEventListener('click', () => openLightbox(img.src));
      grid.appendChild(img);
    });
  }
  function openLightbox(src) {
    document.getElementById('lightbox-img').src = src;
    document.getElementById('lightbox').classList.remove('hidden');
  }
  document.getElementById('lightbox-close').addEventListener('click', () => document.getElementById('lightbox').classList.add('hidden'));
  document.getElementById('lightbox').addEventListener('click', e => { if (e.target.id === 'lightbox') e.currentTarget.classList.add('hidden'); });

  /* ============ 8. VÍDEOS ============ */
  function fillVideos() {
    const box = document.getElementById('video-embed');
    const videos = DATA.videos || [];
    if (!videos.length) { box.innerHTML = '<p class="placeholder">🎬 Coloque o ID dos vídeos no data.js</p>'; return; }
    box.innerHTML = '';
    videos.forEach(id => {
      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/' + encodeURIComponent(id) + '?rel=0';
      iframe.title = 'Vídeo'; iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true; box.appendChild(iframe);
    });
  }

  /* ============ 9. CONTRATO ============ */
  function fillContract() {
    const txt = (DATA.contratoTexto || '').replace('{RECIPIENTE}', DATA.nomeRecipiente || 'Você').replace('{REMETENTE}', DATA.nomeRemetente || 'Eu');
    document.getElementById('contract-text').textContent = txt;
  }

  /* ============ 10. NAVEGAÇÃO + SWIPE + PROGRESSO + PARALLAX ============ */
  const nav = document.getElementById('chapter-nav');
  const progressBar = document.getElementById('progress-bar');
  const progressFill = document.getElementById('progress-fill');
  const controls = document.getElementById('controls');
  const badgesEl = document.getElementById('badges');
  const earnedBadges = new Set();

  function updateProgress(id) {
    const idx = chapters.indexOf(id);
    if (idx < 0) return;
    progressFill.style.width = ((idx + 1) / chapters.length * 100) + '%';
    if (!earnedBadges.has(id)) { earnedBadges.add(id); addBadge(idx); }
  }

  function addBadge(idx) {
    const labels = ['✉️ Envelope', '📝 Carta', '📅 História', '📷 Memórias', '🎬 Vídeo', '🔮 RA', '🗺️ Mapa', '💍 Contrato'];
    const b = document.createElement('span');
    b.className = 'badge'; b.textContent = labels[idx] || '✨';
    badgesEl.appendChild(b);
  }

  function go(id) {
    document.querySelectorAll('.chapter').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.target === id));
    updateProgress(id);
    initGSAP(id);
  }

  /* ============ GSAP: Animações cinematográficas ============ */
  function initGSAP(id) {
    if (!window.gsap) return;
    const ch = document.getElementById(id);
    if (!ch) return;
    const card = ch.querySelector('.glass');
    if (card) {
      gsap.fromTo(card, { opacity: 0, y: 40, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out' });
    }
    const items = ch.querySelectorAll('.timeline-item, .photos-grid img, .video-embed iframe');
    if (items.length) {
      gsap.fromTo(items, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' });
    }
    const title = ch.querySelector('.title');
    if (title) {
      gsap.fromTo(title, { opacity: 0, y: -20, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)' });
    }
  }

  // Envelope clique
  document.getElementById('envelope').addEventListener('click', function () {
    this.classList.add('opened');
    setTimeout(() => {
      nav.classList.remove('hidden');
      progressBar.classList.remove('hidden');
      controls.classList.remove('hidden');
      badgesEl.classList.remove('hidden');
      go('chapter-letter');
    }, 700);
  });

  document.querySelectorAll('.nav-btn').forEach(btn => btn.addEventListener('click', () => go(btn.dataset.target)));

  // Swipe
  let tsx = 0;
  document.addEventListener('touchstart', e => { tsx = e.changedTouches[0].screenX; }, { passive: true });
  document.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].screenX - tsx;
    if (Math.abs(diff) < 60) return;
    const cur = document.querySelector('.chapter.active'); if (!cur) return;
    const idx = chapters.indexOf(cur.id);
    if (diff < 0 && idx < chapters.length - 1) go(chapters[idx + 1]);
    if (diff > 0 && idx > 0) go(chapters[idx - 1]);
  }, { passive: true });

  // Teclado
  document.addEventListener('keydown', e => {
    const cur = document.querySelector('.chapter.active'); if (!cur) return;
    const idx = chapters.indexOf(cur.id);
    if (e.key === 'ArrowRight' && idx < chapters.length - 1) go(chapters[idx + 1]);
    if (e.key === 'ArrowLeft' && idx > 0) go(chapters[idx - 1]);
  });

  // Parallax
  document.addEventListener('mousemove', e => {
    const x = (e.clientX / innerWidth - 0.5), y = (e.clientY / innerHeight - 0.5);
    const c = document.getElementById('three-canvas');
    if (c) c.style.transform = 'translate(' + (x * 25) + 'px,' + (y * 25) + 'px)';
  });

  /* ============ 11. ASSINATURA + SOM ============ */
  const canvas = document.getElementById('signature');
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = '#1a0a2e'; ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  let drawing = false, lastBeep = 0;
  function pos(e) { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  canvas.addEventListener('mousedown', e => { drawing = true; ctx.beginPath(); ctx.moveTo(pos(e).x, pos(e).y); });
  canvas.addEventListener('mousemove', e => {
    if (!drawing) return; ctx.lineTo(pos(e).x, pos(e).y); ctx.stroke();
    const now = Date.now(); if (now - lastBeep > 80) { playBeep(); lastBeep = now; }
  });
  canvas.addEventListener('mouseup', () => drawing = false);
  canvas.addEventListener('mouseleave', () => drawing = false);
  canvas.addEventListener('touchstart', e => {
    e.preventDefault(); const t = e.touches[0], r = canvas.getBoundingClientRect();
    drawing = true; ctx.beginPath(); ctx.moveTo(t.clientX - r.left, t.clientY - r.top);
  }, { passive: false });
  canvas.addEventListener('touchmove', e => {
    if (!drawing) return; e.preventDefault(); const t = e.touches[0], r = canvas.getBoundingClientRect();
    ctx.lineTo(t.clientX - r.left, t.clientY - r.top); ctx.stroke();
    const now = Date.now(); if (now - lastBeep > 80) { playBeep(); lastBeep = now; }
  }, { passive: false });
  canvas.addEventListener('touchend', () => drawing = false);

  document.getElementById('clear-signature').addEventListener('click', () => ctx.clearRect(0, 0, canvas.width, canvas.height));

  /* ============ 12. BOTÃO ACEITAR (confete + arpejo + vibrate) ============ */
  document.getElementById('btn-confirm').addEventListener('click', () => {
    launchConfetti(); playArpeggio();
    setTimeout(launchConfetti, 500);
    setTimeout(launchConfetti, 1000);
    if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 300]);
    toast('💖 Você acabou de assinar o contrato mais lindo. Eu aceito, e prometo te amar para sempre!');
  });

  /* ============ 13. MENSAGEM SECRETA ============ */
  document.getElementById('btn-surprise').addEventListener('click', () => {
    const el = document.getElementById('secret-message');
    el.textContent = DATA.mensagemSecreta || 'Você é incrível! 🌹';
    el.classList.remove('hidden');
    if (navigator.vibrate) navigator.vibrate(150);
    toast('🎁 Uma mensagem só para você!');
  });

  /* ============ 14. TELA CHEIA ============ */
  document.getElementById('fullscreen-toggle').addEventListener('click', () => {
    if (!document.fullscreenElement) { document.documentElement.requestFullscreen?.(); }
    else { document.exitFullscreen?.(); }
  });

  /* ============ 15. RIPPLE nos botões ============ */
  document.querySelectorAll('.btn-primary, .btn-ghost, .btn-gold').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(this.offsetWidth, this.offsetHeight);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - this.offsetLeft - size / 2) + 'px';
      ripple.style.top = (e.clientY - this.offsetTop - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  /* ============ 16. PDF ============ */
  document.getElementById('btn-download-pdf').addEventListener('click', () => {
    if (!window.jspdf) { alert('Biblioteca PDF ainda carregando...'); return; }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const W = 210, M = 20, CW = W - M * 2;
    let y = 25;

    doc.setFillColor(236, 72, 153); doc.roundedRect(M, 15, CW, 10, 2, 2, 'F');
    doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(18);
    doc.text('Contrato de Relacionamento Amoroso', W / 2, 22, { align: 'center' });

    y = 38;
    doc.setFont('helvetica', 'italic'); doc.setFontSize(10); doc.setTextColor(168, 85, 247);
    doc.text('Celebrado entre ' + (DATA.nomeRemetente || 'Eu') + ' e ' + (DATA.nomeRecipiente || 'Você'), W / 2, y, { align: 'center' });
    y += 12; doc.setTextColor(40, 20, 60); doc.setFont('helvetica', 'normal');

    const clausulas = [
      { t: 'Cláusula 1 — Aceitação', tx: 'Eu, ' + (DATA.nomeRecipiente || 'a pessoa amada') + ', livre e espontaneamente, aceito este contrato eterno de amor e cumplicidade com ' + (DATA.nomeRemetente || 'a pessoa que me ama') + '.' },
      { t: 'Cláusula 2 — Compromissos', tx: 'Prometo rir com você, cuidar de você, caminhar ao seu lado em todos os capítulos da nossa história, e nunca desistir de nós.' },
      { t: 'Cláusula 3 — Fidelidade', tx: 'Comprometo-me a ser fiel, honesto e transparente. Nosso amor se constrói com verdade e confiança.' },
      { t: 'Cláusula 4 — Apoio Mútuo', tx: 'Nos dias bons e nos dias difíceis, serei seu apoio. Sua alegria é minha alegria; sua dor é minha dor.' },
      { t: 'Cláusula 5 — Comunicação', tx: 'Prometo sempre conversar, nunca guardar mágoas e resolver juntos os desafios que surgirem.' },
      { t: 'Cláusula 6 — Crescimento', tx: 'Cresceremos juntos. Nunca deixaremos de nos escolher. Este contrato não tem prazo de validade.' },
      { t: 'Cláusula 7 — Surpresas', tx: 'Comprometo-me a manter viva a chama: surpresas, gestos de carinho e pequenos detalhes que nos fazem sorrir.' },
      { t: 'Cláusula 8 — Vigência', tx: 'Este contrato entra em vigor no momento da assinatura e tem validade eterna. Renovado a cada dia com um novo "eu te amo".' },
    ];

    clausulas.forEach(c => {
      doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
      if (y > 240) { doc.addPage(); y = 25; }
      doc.text(c.t, M, y); y += 6;
      doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
      const lin = doc.splitTextToSize(c.tx, CW); doc.text(lin, M, y); y += lin.length * 5 + 4;
    });

    if (y > 250) { doc.addPage(); y = 25; }
    y += 12;
    doc.setDrawColor(236, 72, 153); doc.setLineWidth(0.5); doc.line(M + 10, y, M + 90, y);
    doc.setFontSize(9); doc.setTextColor(120, 120, 120); doc.text('Assinatura Digital', M + 35, y + 5);
    try { doc.addImage(document.getElementById('signature').toDataURL('image/png'), 'PNG', M + 10, y - 28, 80, 28); }
    catch (e) { doc.text('[Assinatura em branco]', M + 10, y - 5); }

    if (y > 270) { doc.addPage(); y = 25; } else y += 20;
    doc.setFillColor(168, 85, 247); doc.roundedRect(M, y, CW, 14, 2, 2, 'F');
    doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
    doc.text('COMPROVANTE DE ACEITAÇÃO', W / 2, y + 5, { align: 'center' });
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
    doc.text('Assinado digitalmente em: ' + new Date().toLocaleString('pt-BR'), W / 2, y + 10, { align: 'center' });

    doc.save('Contrato-de-Namoro-' + (DATA.nomeRecipiente || 'amor') + '.pdf');
    toast('📄 Comprovante PDF gerado com sucesso!');
  });

  /* ============ 21. MAPA EM TEMPO REAL (Leaflet + Geolocation) ============ */
  let mapInstance = null;

  function initMap() {
    const btn = document.getElementById('btn-map-start');
    const container = document.getElementById('map-container');
    const info = document.getElementById('map-info');

    btn.addEventListener('click', () => {
      if (!navigator.geolocation) {
        toast('Geolocalização não suportada neste dispositivo 😔');
        return;
      }
      if (!window.L) {
        toast('Mapa ainda carregando, tente novamente...');
        return;
      }

      // Coordenadas de Rubens (Recife-PE) -- configurável no data.js
      const RubensLat = DATA.minhaLat || -8.0476;
      const RubensLon = DATA.minhaLon || -34.8770;
      const minhaLocal = DATA.minhaLocal || 'Recife-PE';

      btn.style.display = 'none';
      container.classList.remove('hidden');
      container.style.height = '320px';

      toast('Localizando você... 📍');

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userLat = pos.coords.latitude;
          const userLon = pos.coords.longitude;

          // Criar mapa
          mapInstance = L.map('map-container').setView([(userLat + RubensLat) / 2, (userLon + RubensLon) / 2], 5);

          // Tile layer escuro premium
          L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap | © CARTO',
            subdomains: 'abcd',
            maxZoom: 19,
          }).addTo(mapInstance);

          // Marcador dela (azul/cyan)
          const elaIcon = L.divIcon({
            html: '💖',
            className: 'map-marker-ela',
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          });
          L.marker([userLat, userLon], { icon: elaIcon })
            .addTo(mapInstance)
            .bindPopup('<b> Você está aqui 💕</b>');

          // Marcador dele (dourado)
          const euIcon = L.divIcon({
            html: '👦',
            className: 'map-marker-eu',
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          });
          L.marker([RubensLat, RubensLon], { icon: euIcon })
            .addTo(mapInstance)
            .bindPopup('<b> Eu estou aqui 📍 ' + minhaLocal + '</b>');

          // Linha conectando os dois
          L.polyline([[userLat, userLon], [RubensLat, RubensLon]], {
            color: '#ec4899',
            weight: 3,
            opacity: 0.7,
            dashArray: '10, 10',
            lineCap: 'round',
          }).addTo(mapInstance);

          // Calcular distância (Haversine)
          const R = 6371;
          const dLat = (RubensLat - userLat) * Math.PI / 180;
          const dLon = (RubensLon - userLon) * Math.PI / 180;
          const a = Math.sin(dLat / 2) ** 2 + Math.cos(userLat * Math.PI / 180) * Math.cos(RubensLat * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distKm = Math.round(R * c);

          // Tempo estimado (avião ~850km/h, carro ~80km/h)
          const horasAviao = (distKm / 850).toFixed(1);
          const horasCarro = Math.round(distKm / 80);

          document.getElementById('map-distance').textContent = '📏 ' + distKm.toLocaleString('pt-BR') + ' km entre nós';
          document.getElementById('map-time').textContent = '✈️ ' + horasAviao + 'h de avião | 🚗 ' + horasCarro + 'h de carro';
          info.classList.remove('hidden');

          // Ajustar zoom para mostrar os dois pontos
          mapInstance.fitBounds([[userLat, userLon], [RubensLat, RubensLon]], { padding: [40, 40] });

          toast('Mapa ativado! A distância não importa quando o amor é verdadeiro 💖');
        },
        (err) => {
          btn.style.display = 'inline-block';
          container.classList.add('hidden');
          toast('Não consegui acessar sua localização: ' + err.message + ' 😔');
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
      );
    });
  }
  initMap();

  /* ============ HELPERS ============ */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&', '<': '<', '>': '>', '"': '"', "'": '&#39;' }[c]));
  }
  function toast(msg) {
    const t = document.getElementById('message-toast');
    t.textContent = msg; t.classList.remove('hidden');
    setTimeout(() => t.classList.add('hidden'), 5000);
  }

  /* ============ 17. YOUTUBE IFRAME API (player real) ============ */
  let ytPlayer = null, ytReady = false, ytIndex = 0;
  window.onYouTubeIframeAPIReady = function() {
    const playlist = DATA.playlistMusicas || [];
    if (!playlist.length) return;
    ytPlayer = new YT.Player('yt-player', {
      height: '0', width: '0',
      videoId: playlist[0],
      playerVars: { autoplay: 0, loop: 1, playlist: playlist.join(','), controls: 0 },
      events: {
        onReady: () => { ytReady = true; },
        onStateChange: (e) => {
          if (e.data === YT.PlayerState.ENDED && ytIndex < playlist.length - 1) {
            ytIndex++; ytPlayer.loadVideoById(playlist[ytIndex]);
          }
        }
      }
    });
  };

  // Sobrescrever toggleMusic para também controlar o YouTube
  const origToggleMusic = toggleMusic;
  toggleMusic = function() {
    if (ytReady && ytPlayer) {
      const state = ytPlayer.getPlayerState();
      if (state === 1) { ytPlayer.pauseVideo(); }
      else { ytPlayer.playVideo(); }
    }
    origToggleMusic();
  };
  document.getElementById('music-toggle').removeEventListener('click', origToggleMusic);
  document.getElementById('music-toggle').addEventListener('click', toggleMusic);

  /* ============ 18. WEB SPEECH API (reconhecimento de voz) ============ */
  function initVoice() {
    if (!DATA.vozAtivada) return;
    const btn = document.getElementById('btn-voice');
    const status = document.getElementById('voice-status');
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      btn.style.opacity = '0.5'; btn.disabled = true; btn.textContent = 'Voz não suportada 😔';
      return;
    }
    let recognition = null;
    let listening = false;

    btn.addEventListener('click', () => {
      if (listening) {
        if (recognition) recognition.stop();
        listening = false;
        btn.textContent = 'Falar sua resposta 🎤';
        btn.classList.remove('listening');
        return;
      }
      recognition = new SR();
      recognition.lang = 'pt-BR';
      recognition.interimResults = false;
      recognition.maxAlternatives = 3;

      status.textContent = 'Ouvindo... diga "sim" ou "aceito" 💝';
      status.classList.remove('hidden');
      btn.classList.add('listening');
      listening = true;

      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript.toLowerCase().trim();
        status.textContent = 'Você disse: "' + transcript + '"';
        if (transcript.includes('sim') || transcript.includes('aceito') || transcript.includes('aceito sim') || transcript.includes('sim aceito')) {
          status.textContent = '💖 Ela disse SIM!';
          document.getElementById('btn-confirm').click();
        } else if (transcript.includes('nao') || transcript.includes('não')) {
          status.textContent = '😅 Vamos tentar de novo...';
        }
      };

      recognition.onerror = (e) => {
        status.textContent = 'Erro no microfone: ' + e.error;
        status.classList.remove('hidden');
      };

      recognition.onend = () => {
        listening = false;
        btn.textContent = 'Falar sua resposta 🎤';
        btn.classList.remove('listening');
      };

      recognition.start();
    });
  }
  initVoice();

  /* ============ 19. AR (A-Frame) ============ */
  document.getElementById('btn-ar-start')?.addEventListener('click', function() {
    const scene = document.getElementById('ar-scene');
    scene.classList.remove('hidden');
    this.style.display = 'none';
    toast('🔮 Aponte a câmera para o marcador Hiro!');
  });

  /* ============ 20. LOTTIE (loading) ============ */
  function initLottie() {
    if (!window.lottie) return;
    const el = document.getElementById('lottie-heart');
    if (!el) return;
    const heartData = {
      v: '5.7.4', fr: 30, w: 100, h: 100, ip: 0, op: 30, nm: 'Heart', layers: [{
        ty: 4, nm: 'Heart', sr: 1, ks: { o: { a: 0, k: 100 }, s: { a: 1, k: [
          { t: 0, s: [80, 80, 100], h: 0 }, { t: 15, s: [120, 120, 100], h: 0 }, { t: 30, s: [80, 80, 100], h: 0 }
        ] } }, shapes: [{
          ty: 'gr', it: [{ ty: 'sh', ks: { a: 0, k: { i: [[0,-8],[8,0],[0,8],[-8,0]], o: [[0,8],[-8,0],[0,-8],[8,0]], v: [[0,-15],[-15,0],[0,15],[15,0]], c: true } } },
          { ty: 'fl', c: { a: 0, k: [0.925, 0.282, 0.6, 1] } }, { ty: 'tr' }]
        }]
      }]
    };
    try { lottie.loadAnimation({ container: el, renderer: 'svg', loop: true, autoplay: true, animationData: heartData }); }
    catch (e) {}
  }
  initLottie();

  /* ============ 22. TROCAR TEMA (claro/escuro) ============ */
  let lightTheme = false;
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    lightTheme = !lightTheme;
    document.body.classList.toggle('light-theme', lightTheme);
    toast(lightTheme ? '🎨 Tema claro ativado!' : '🌙 Tema escuro ativado!');
  });

  /* ============ 23. COMPARTILHAR (Web Share API) ============ */
  document.getElementById('share-btn')?.addEventListener('click', async () => {
    const shareData = {
      title: 'Para Você 💖',
      text: 'Alguém muito especial preparou uma surpresa para você...',
      url: 'https://rubensdj.github.io/Surpresa-S2/',
    };
    try {
      if (navigator.share) { await navigator.share(shareData); }
      else {
        await navigator.clipboard.writeText(shareData.url);
        toast('📋 Link copiado! Compartilhe com quem você ama 💖');
      }
    } catch (e) {}
  });

  /* ============ 24. CHUVA DE PÉTALAS (toggle) ============ */
  let petalRain = false, petalInterval = null;
  document.getElementById('petal-toggle')?.addEventListener('click', () => {
    petalRain = !petalRain;
    const decor = document.getElementById('decor');
    if (petalRain) {
      decor.style.opacity = '1.5';
      petalInterval = setInterval(() => {
        const syms = ['💖', '🌸', '💕', '🌹', '💜', '🌺'];
        const el = document.createElement('span');
        el.className = 'petal';
        el.textContent = syms[Math.floor(Math.random() * syms.length)];
        el.style.left = Math.random() * 100 + '%';
        el.style.fontSize = (16 + Math.random() * 28) + 'px';
        el.style.animationDuration = '4s';
        decor.appendChild(el);
        setTimeout(() => el.remove(), 4000);
      }, 200);
      toast('🌸 Chuva de pétalas ativada!');
    } else {
      clearInterval(petalInterval);
      toast('🌸 Chuva de pétalas desativada');
    }
  });

  /* ============ INIT ============ */
  fillLetter();
  fillDates();
  fillPhotos();
  fillVideos();
  fillContract();
  initTimer();
})();