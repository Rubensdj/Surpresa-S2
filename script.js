/* script.js — Ultra HD Premium v4 */
(function () {
  'use strict';
  const DATA = window.SURPRISE_DATA || {};
  const TEMA = DATA.tema || {};
  const chapters = ['chapter-envelope', 'chapter-letter', 'chapter-dates', 'chapter-photos', 'chapter-video', 'chapter-contract'];

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

  /* ============ 3. CONFETE ============ */
  function launchConfetti() {
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
    const labels = ['✉️ Envelope', '📝 Carta', '📅 História', '📷 Memórias', '🎬 Vídeo', '💍 Contrato'];
    const b = document.createElement('span');
    b.className = 'badge'; b.textContent = labels[idx] || '✨';
    badgesEl.appendChild(b);
  }

  function go(id) {
    document.querySelectorAll('.chapter').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.target === id));
    updateProgress(id);
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

  /* ============ HELPERS ============ */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&', '<': '<', '>': '>', '"': '"', "'": '&#39;' }[c]));
  }
  function toast(msg) {
    const t = document.getElementById('message-toast');
    t.textContent = msg; t.classList.remove('hidden');
    setTimeout(() => t.classList.add('hidden'), 5000);
  }

  /* ============ INIT ============ */
  fillLetter();
  fillDates();
  fillPhotos();
  fillVideos();
  fillContract();
  initTimer();
})();