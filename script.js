/* script.js — Lógica da surpresa: 3D, decoração, capítulos, contrato */
(function () {
  'use strict';

  const DATA = window.SURPRISE_DATA || {};

  /* ============ 1. FUNDO 3D (corações flutuantes) ============ */
  let three = null;
  function initThree() {
    if (!window.THREE) return;
    const canvas = document.getElementById('three-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Geometria do coração (path 2D)
    const heartPath = new THREE.Shape();
    heartPath.moveTo(0, 0.55);
    heartPath.bezierCurveTo(0.6, -0.2, 0.3, -0.8, 0, -0.3);
    heartPath.bezierCurveTo(-0.3, -0.8, -0.6, -0.2, 0, 0.55);

    const hearts = [];
    const colors = [0xec4899, 0xa855f7, 0xf472b6, 0xc084fc];
    for (let i = 0; i < 14; i++) {
      const shape = heartPath.clone();
      const geo = new THREE.ShapeGeometry(shape, 12);
      const mat = new THREE.MeshBasicMaterial({
        color: colors[i % colors.length],
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 8 - 2
      );
      const s = 0.4 + Math.random() * 0.9;
      mesh.scale.set(s, s, s);
      mesh.rotation.z = Math.random() * Math.PI;
      scene.add(mesh);
      hearts.push({ mesh, speed: 0.004 + Math.random() * 0.008, phase: Math.random() * Math.PI * 2 });
    }

    function animate() {
      requestAnimationFrame(animate);
      hearts.forEach((h) => {
        h.mesh.rotation.z += h.speed;
        h.mesh.position.y += Math.sin(Date.now() * h.speed * 0.5) * 0.004;
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

  /* ============ 2. DECORAÇÃO (pétalas de coração) ============ */
  function spawnDecor() {
    const decor = document.getElementById('decor');
    const COUNT = 14;
    const symbols = ['💖', '💗', '🌸', '💜', '✨', '💕', '🌺'];
    for (let i = 0; i < COUNT; i++) {
      const el = document.createElement('span');
      el.className = 'petal';
      el.textContent = symbols[i % symbols.length];
      el.style.left = Math.random() * 100 + '%';
      el.style.fontSize = (14 + Math.random() * 22) + 'px';
      el.style.animationDuration = (7 + Math.random() * 9) + 's';
      el.style.animationDelay = (Math.random() * 8) + 's';
      decor.appendChild(el);
    }
  }
  spawnDecor();

  /* ============ 3. CARTA ============ */
  function fillLetter() {
    const text = (DATA.carta || '').replace(/\n/g, '\n');
    document.getElementById('letter-text').textContent = text;
  }

  /* ============ 4. DATAS ============ */
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

  /* ============ 5. FOTOS ============ */
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
      grid.appendChild(img);
    });
  }

  /* ============ 6. VÍDEOS ============ */
  function fillVideos() {
    const box = document.getElementById('video-embed');
    const videos = DATA.videos || [];
    if (!videos.length) {
      box.innerHTML = '<p class="placeholder">🎬 Coloque o ID dos vídeos no data.js</p>';
      return;
    }
    box.innerHTML = '';
    videos.forEach((id) => {
      box.innerHTML +=
        '<iframe src="https://www.youtube.com/embed/' + encodeURIComponent(id) +
        '" title="Vídeo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    });
  }

  /* ============ 7. CONTRATO ============ */
  function fillContract() {
    const txt = (DATA.contratoTexto || '').replace('{RECIPIENTE}', DATA.nomeRecipiente || 'Você');
    document.getElementById('contract-text').textContent = txt;
  }

  /* ============ 8. NAVEGAÇÃO ============ */
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
    document.querySelectorAll('.nav-btn').forEach((b) =>
      b.classList.toggle('active', b.dataset.target === id)
    );
  }

  /* ============ 9. ASSINATURA ============ */
  const canvas = document.getElementById('signature');
  const ctx = canvas.getContext('2d');
  let drawing = false;
  function pos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  canvas.addEventListener('mousedown', (e) => { drawing = true; ctx.beginPath(); ctx.moveTo(pos(e).x, pos(e).y); });
  canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    ctx.lineTo(pos(e).x, pos(e).y); ctx.stroke();
  });
  canvas.addEventListener('mouseup', () => (drawing = false));
  canvas.addEventListener('mouseleave', () => (drawing = false));
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); const t = e.touches[0];
    drawing = true; ctx.beginPath(); ctx.moveTo(t.clientX - canvas.getBoundingClientRect().left, t.clientY - canvas.getBoundingClientRect().top);
  }, { passive: false });
  canvas.addEventListener('touchmove', (e) => {
    if (!drawing) return;
    e.preventDefault(); const t = e.touches[0];
    ctx.lineTo(t.clientX - canvas.getBoundingClientRect().left, t.clientY - canvas.getBoundingClientRect().top); ctx.stroke();
  }, { passive: false });
  canvas.addEventListener('touchend', () => (drawing = false));

  document.getElementById('clear-signature').addEventListener('click', () => ctx.clearRect(0, 0, canvas.width, canvas.height));

  document.getElementById('btn-confirm').addEventListener('click', () => {
    const toast = document.getElementById('message-toast');
    toast.textContent = '💖 Você acabou de assinar o contrato mais lindo. Eu aceito, e prometo te amar para sempre!';
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 5000);
  });

  /* ============ 10. GERAR COMPROVANTE PDF ============ */
  document.getElementById('btn-download-pdf').addEventListener('click', () => {
    if (!window.jspdf) { alert('Biblioteca PDF ainda carregando, tente novamente em instantes.'); return; }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW = 210;
    const margin = 20;
    const contentW = pageW - margin * 2;
    let y = 25;

    // -- Cabeçalho com borda decorativa --
    doc.setFillColor(236, 72, 153);
    doc.roundedRect(margin, 15, contentW, 10, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Contrato de Relacionamento Amoroso', pageW / 2, 22, { align: 'center' });

    y = 40;
    doc.setTextColor(40, 20, 60);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    // -- Cláusulas do contrato --
    const clausulas = [
      { titulo: 'Cláusula 1 — Aceitação', texto: 'Eu, ' + (DATA.nomeRecipiente || 'a pessoa amada') + ', livre e espontaneamente, aceito este contrato eterno de amor e cumplicidade.' },
      { titulo: 'Cláusula 2 — Compromissos', texto: 'Prometo rir com você, cuidar de você, caminhar ao seu lado em todos os capítulos da nossa história, e nunca desistir de nós.' },
      { titulo: 'Cláusula 3 — Fidelidade', texto: 'Comprometo-me a ser fiel, honesto e transparente. Nosso amor se constrói com verdade e confiança.' },
      { titulo: 'Cláusula 4 — Apoio Mútuo', texto: 'Nos dias bons e nos dias difíceis, serei seu apoio. Sua alegria é minha alegria; sua dor é minha dor.' },
      { titulo: 'Cláusula 5 — Crescimento', texto: 'Cresceremos juntos. Nunca deixaremos de nos escolher. Este contrato não tem prazo de validade.' },
      { titulo: 'Cláusula 6 — Vigência', texto: 'Este contrato entra em vigor no momento da assinatura e tem validade eterna.' },
    ];

    clausulas.forEach((c) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      if (y > 230) { doc.addPage(); y = 25; }
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
    y += 10;
    doc.setDrawColor(236, 72, 153);
    doc.setLineWidth(0.5);
    doc.line(margin + 10, y, margin + 90, y);
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text('Assinatura Digital', margin + 35, y + 5);

    // -- Inserir imagem da assinatura do canvas --
    const sigCanvas = document.getElementById('signature');
    const sigImg = sigCanvas.toDataURL('image/png');
    try {
      doc.addImage(sigImg, 'PNG', margin + 10, y - 28, 80, 28);
    } catch (e) {
      doc.text('[Assinatura em branco]', margin + 10, y - 5);
    }

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

    // -- Baixar --
    const nomeArquivo = 'Contrato-de-Namoro-' + (DATA.nomeRecipiente || 'amor') + '.pdf';
    doc.save(nomeArquivo);

    // Toast
    const toast = document.getElementById('message-toast');
    toast.textContent = '📄 Comprovante PDF gerado com sucesso!';
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 4000);
  });

  /* ============ HELPERS ============ */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  /* ============ INIT ============ */
  fillLetter();
  fillDates();
  fillPhotos();
  fillVideos();
  fillContract();
})();