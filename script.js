/* script.js — Lógica da surpresa v2: 3D premium, carta animada, timer, lightbox, confete, PDF */
(function () {
  'use strict';

  const DATA = window.SURPRISE_DATA || {};

  /* ============ 1. FUNDO 3D (corações extrudados com iluminação) ============ */
  function initThree() {
    if (!window.THREE) return;
    const canvas = document.getElementById('three-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 14;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Coração 3D via Shape + ExtrudeGeometry
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0.5);
    heartShape.bezierCurveTo(0.5, 0.9, 1.0, 0.5, 0, -0.5);
    heartShape.bezierCurveTo(-1.0, 0.5, -0.5, 0.9, 0, 0.5);

    const extrudeSettings = {
      depth: 0.4, bevelEnabled: true, bevelSegments: 8, bevelSize: 0.12, bevelThickness: 0.12,
    };

    const hearts = [];
    const colors = [0xec4899, 0xa855f7, 0xf472b6, 0xc084fc, 0x67e8f9];

    for (let i = 0; i < 18; i++) {
      const geo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
      geo.center();
      const mat = new THREE.MeshPhongMaterial({
        color: colors[i % colors.length],
        transparent: true,
        opacity: 0.35,
        shininess: 80,
        specular: 0xffffff,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 24,
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 10 - 1
      );
      const s = 0.2 + Math.random() * 0.5;
      mesh.scale.set(s, s, s);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      scene.add(mesh);
      hearts.push({ mesh, speed: 0.003 + Math.random() * 0.007, phase: Math.random() * Math.PI * 2, float: 0.002 + Math.random() * 0.005 });
    }

    // Iluminação
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);
    const dir1 = new THREE.DirectionalLight(0xff80bf, 1.2);
    dir1.position.set(3, 5, 4);
    scene.add(dir1);
    const dir2 = new THREE.PointLight(0xa855f7, 1.5, 30);
    dir2.position.set(-4, -2, 3);
    scene.add(dir2);

    function animate() {
      requestAnimationFrame(animate);
      const t = Date.now() * 0.001;
      hearts.forEach((h) => {
        h.mesh.rotation.x += h.speed;
        h.mesh.rotation.y += h.speed * 0.7;
        h.mesh.position.y += Math.sin(t + h.phase) * h.float;
      });
      renderer.render(scene, camera);
    }
    animate();

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize);
  }

  const loadTimer = setInterval(() => {
    if (window.THREE) { clearInterval(loadTimer); initThree(); }
  }, 120);
  setTimeout(() => clearInterval(loadTimer), 6000);

  /* ============ 2. DECORAÇÃO (pétalas) ============ */
  function spawnDecor() {
    const decor = document.getElementById('decor');
    const COUNT = 18;
    const symbols = ['💖', '💗', '🌸', '💜', '✨', '💕', '🌺', '💞'];
    for (let i = 0; i < COUNT; i++) {
      const el = document.createElement('span');
      el.className = 'petal';
      el.textContent = symbols[i % symbols.length];
      el.style.left = Math.random() * 100 + '%';
      el.style.fontSize = (14 + Math.random() * 24) + 'px';
      el.style.animationDuration = (7 + Math.random() * 10) + 's';
      el.style.animationDelay = (Math.random() * 8) + 's';
      decor.appendChild(el);
    }
  }
  spawnDecor();

  /* ============ 3. CONFETE DE CORAÇÕES ============ */
  function launchConfetti() {
    const container = document.getElementById('confetti');
    const symbols = ['💖', '💕', '💗', '💓', '💞', '🌹', '✨', '🎉'];
    for (let i = 0; i < 40; i++) {
      const el = document.createElement('span');
      el.className = 'confetti-heart';
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.left = Math.random() * 100 + '%';
      el.style.fontSize = (16 + Math.random() * 28) + 'px';
      el.style.animationDuration = (2.5 + Math.random() * 2.5) + 's';
      el.style.animationDelay = (Math.random() * 0.5) + 's';
      container.appendChild(el);
      setTimeout(() => el.remove(), 5500);
    }
  }

  /* ============ 4. MÚSICA DE FUNDO ============ */
  let audioCtx = null;
  let musicPlaying = false;
  let oscillators = [];

  function toggleMusic() {
    const btn = document.getElementById('music-toggle');
    if (musicPlaying) {
      oscillators.forEach((o) => { try { o.stop(); } catch (e) {} });
      oscillators = [];
      audioCtx = null;
      musicPlaying = false;
      btn.classList.remove('playing');
      btn.textContent = '🎵';
    } else {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        // Notas simples: Dó, Mi, Sol (acorde maior)
        const freqs = [523.25, 659.25, 783.99];
        freqs.forEach((f) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.value = f;
          gain.gain.value = 0.03;
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          oscillators.push(osc);

          // LFO para volume oscilante (efeito "respiração")
          const lfo = audioCtx.createOscillator();
          const lfoGain = audioCtx.createGain();
          lfo.frequency.value = 0.3;
          lfoGain.gain.value = 0.02;
          lfo.connect(lfoGain);
          lfoGain.connect(gain.gain);
          lfo.start();
          oscillators.push(lfo);
        });
        musicPlaying = true;
        btn.classList.add('playing');
        btn.textContent = '🔇';
      } catch (e) {
        console.warn('Audio nao suportado', e);
      }
    }
  }
  document.getElementById('music-toggle').addEventListener('click', toggleMusic);

  /* ============ 5. CARTA (animação de digitação) ============ */
  function fillLetter() {
    const el = document.getElementById('letter-text');
    const text = (DATA.carta || 'Minha carta para você...');
    el.textContent = '';
    el.classList.add('letter-cursor');
    let i = 0;
    function typeNext() {
      if (i < text.length) {
        el.textContent += text[i];
        i++;
        setTimeout(typeNext, 35);
      } else {
        setTimeout(() => el.classList.remove('letter-cursor'), 1500);
      }
    }
    typeNext();
  }

  /* ============ 6. DATAS + TIMER ============ */
  function fillDates() {
    const list = document.getElementById('dates-list');
    const datas = DATA.datas || [];
    if (!datas.length) {
      list.innerHTML = '<li class="placeholder">Adicione datas no arquivo data.js 📅</li>';
      return;
    }
    list.innerHTML = '';
    datas.forEach((d) => {
      const li = document.createElement('li');
      li.innerHTML = '<span class="date">' + escapeHtml(d.data) + '</span><span>' + escapeHtml(d.evento) + '</span>';
      list.appendChild(li);
    });
  }

  function initTimer() {
    if (!DATA.dataInicio) return;
    const inicio = new Date(DATA.dataInicio);
    if (isNaN(inicio)) return;
    function update() {
      const agora = new Date();
      const diff = Math.floor((agora - inicio) / 86400000);
      document.getElementById('timer-days').textContent = diff >= 0 ? diff : 0;
    }
    update();
    setInterval(update, 3600000);
  }

  /* ============ 7. FOTOS + LIGHTBOX ============ */
  function fillPhotos() {
    const grid = document.getElementById('photos-grid');
    const fotos = DATA.fotos || [];
    if (!fotos.length) {
      grid.innerHTML = '<div class="placeholder">Coloque suas fotos na pasta photos/ 📷</div>';
      return;
    }
    grid.innerHTML = '';
    fotos.forEach((f) => {
      const img = document.createElement('img');
      img.src = 'photos/' + f;
      img.alt = 'Memória';
      img.addEventListener('click', () => openLightbox(img.src));
      grid.appendChild(img);
    });
  }

  function openLightbox(src) {
    document.getElementById('lightbox-img').src = src;
    document.getElementById('lightbox').classList.remove('hidden');
  }
  document.getElementById('lightbox-close').addEventListener('click', () => {
    document.getElementById('lightbox').classList.add('hidden');
  });
  document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') e.currentTarget.classList.add('hidden');
  });

  /* ============ 8. VÍDEOS ============ */
  function fillVideos() {
    const box = document.getElementById('video-embed');
    const videos = DATA.videos || [];
    if (!videos.length) {
      box.innerHTML = '<p class="placeholder">🎬 Coloque o ID dos vídeos no data.js</p>';
      return;
    }
    box.innerHTML = '';
    videos.forEach((id) => {
      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/' + encodeURIComponent(id) + '?rel=0';
      iframe.title = 'Vídeo';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      box.appendChild(iframe);
    });
  }

  /* ============ 9. CONTRATO ============ */
  function fillContract() {
    const txt = (DATA.contratoTexto || '').replace('{RECIPIENTE}', DATA.nomeRecipiente || 'Você');
    document.getElementById('contract-text').textContent = txt;
  }

  /* ============ 10. NAVEGAÇÃO ============ */
  const nav = document.getElementById('chapter-nav');
  document.getElementById('btn-start').addEventListener('click', () => {
    go('chapter-letter');
    nav.classList.remove('hidden');
  });
  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => go(btn.dataset.target));
  });
  function go(id) {
    document.querySelectorAll('.chapter').forEach((s) => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.querySelectorAll('.nav-btn').forEach((b) => b.classList.toggle('active', b.dataset.target === id));
  }

  /* ============ 11. ASSINATURA ============ */
  const canvas = document.getElementById('signature');
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = '#1a0a2e';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  let drawing = false;
  function pos(e) { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  canvas.addEventListener('mousedown', (e) => { drawing = true; ctx.beginPath(); ctx.moveTo(pos(e).x, pos(e).y); });
  canvas.addEventListener('mousemove', (e) => { if (!drawing) return; ctx.lineTo(pos(e).x, pos(e).y); ctx.stroke(); });
  canvas.addEventListener('mouseup', () => (drawing = false));
  canvas.addEventListener('mouseleave', () => (drawing = false));
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); const t = e.touches[0]; const r = canvas.getBoundingClientRect();
    drawing = true; ctx.beginPath(); ctx.moveTo(t.clientX - r.left, t.clientY - r.top);
  }, { passive: false });
  canvas.addEventListener('touchmove', (e) => {
    if (!drawing) return; e.preventDefault(); const t = e.touches[0]; const r = canvas.getBoundingClientRect();
    ctx.lineTo(t.clientX - r.left, t.clientY - r.top); ctx.stroke();
  }, { passive: false });
  canvas.addEventListener('touchend', () => (drawing = false));

  document.getElementById('clear-signature').addEventListener('click', () => ctx.clearRect(0, 0, canvas.width, canvas.height));

  document.getElementById('btn-confirm').addEventListener('click', () => {
    launchConfetti();
    const toast = document.getElementById('message-toast');
    toast.textContent = '💖 Você acabou de assinar o contrato mais lindo. Eu aceito, e prometo te amar para sempre!';
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 6000);
  });

  /* ============ 12. GERAR COMPROVANTE PDF ============ */
  document.getElementById('btn-download-pdf').addEventListener('click', () => {
    if (!window.jspdf) { alert('Biblioteca PDF ainda carregando, tente novamente em instantes.'); return; }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW = 210;
    const margin = 20;
    const contentW = pageW - margin * 2;
    let y = 25;

    // -- Decoração topo --
    doc.setFillColor(236, 72, 153);
    doc.roundedRect(margin, 15, contentW, 10, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Contrato de Relacionamento Amoroso', pageW / 2, 22, { align: 'center' });

    // -- Subtítulo --
    y = 38;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(168, 85, 247);
    doc.text('Celebrado entre ' + (DATA.nomeRemetente || 'Eu') + ' e ' + (DATA.nomeRecipiente || 'Você'), pageW / 2, y, { align: 'center' });

    y += 10;
    doc.setTextColor(40, 20, 60);
    doc.setFont('helvetica', 'normal');

    // -- Cláusulas --
    const clausulas = [
      { titulo: 'Cláusula 1 — Aceitação', texto: 'Eu, ' + (DATA.nomeRecipiente || 'a pessoa amada') + ', livre e espontaneamente, aceito este contrato eterno de amor e cumplicidade com ' + (DATA.nomeRemetente || 'a pessoa que me ama') + '.' },
      { titulo: 'Cláusula 2 — Compromissos', texto: 'Prometo rir com você, cuidar de você, caminhar ao seu lado em todos os capítulos da nossa história, e nunca desistir de nós.' },
      { titulo: 'Cláusula 3 — Fidelidade', texto: 'Comprometo-me a ser fiel, honesto e transparente. Nosso amor se constrói com verdade e confiança.' },
      { titulo: 'Cláusula 4 — Apoio Mútuo', texto: 'Nos dias bons e nos dias difíceis, serei seu apoio. Sua alegria é minha alegria; sua dor é minha dor.' },
      { titulo: 'Cláusula 5 — Comunicação', texto: 'Prometo sempre conversar, nunca guardar mágoas e resolver juntos os desafios que surgirem.' },
      { titulo: 'Cláusula 6 — Crescimento', texto: 'Cresceremos juntos. Nunca deixaremos de nos escolher. Este contrato não tem prazo de validade.' },
      { titulo: 'Cláusula 7 — Surpresas', texto: 'Comprometo-me a manter viva a chama: surpresas, gestos de carinho e pequenos detalhes que nos fazem sorrir.' },
      { titulo: 'Cláusula 8 — Vigência', texto: 'Este contrato entra em vigor no momento da assinatura e tem validade eterna. Renovado a cada dia com um novo "eu te amo".' },
    ];

    clausulas.forEach((c) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      if (y > 240) { doc.addPage(); y = 25; }
      doc.text(c.titulo, margin, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const linhas = doc.splitTextToSize(c.texto, contentW);
      doc.text(linhas, margin, y);
      y += linhas.length * 5 + 4;
    });

    // -- Linha de assinatura --
    if (y > 250) { doc.addPage(); y = 25; }
    y += 12;
    doc.setDrawColor(236, 72, 153);
    doc.setLineWidth(0.5);
    doc.line(margin + 10, y, margin + 90, y);
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text('Assinatura Digital', margin + 35, y + 5);

    // -- Imagem da assinatura --
    const sigCanvas = document.getElementById('signature');
    const sigImg = sigCanvas.toDataURL('image/png');
    try { doc.addImage(sigImg, 'PNG', margin + 10, y - 28, 80, 28); }
    catch (e) { doc.text('[Assinatura em branco]', margin + 10, y - 5); }

    // -- Comprovante / rodapé --
    if (y > 270) { doc.addPage(); y = 25; } else { y += 20; }
    doc.setFillColor(168, 85, 247);
    doc.roundedRect(margin, y, contentW, 14, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    const dataHora = new Date().toLocaleString('pt-BR');
    doc.text('COMPROVANTE DE ACEITAÇÃO', pageW / 2, y + 5, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Assinado digitalmente em: ' + dataHora, pageW / 2, y + 10, { align: 'center' });

    // Salvar
    const nomeArquivo = 'Contrato-de-Namoro-' + (DATA.nomeRecipiente || 'amor') + '.pdf';
    doc.save(nomeArquivo);

    const toast = document.getElementById('message-toast');
    toast.textContent = '📄 Comprovante PDF gerado com sucesso!';
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 4000);
  });

  /* ============ HELPERS ============ */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&', '<': '<', '>': '>', '"': '"', "'": '&#39;' }[c]));
  }

  /* ============ INIT ============ */
  fillLetter();
  fillDates();
  fillPhotos();
  fillVideos();
  fillContract();
  initTimer();
})();