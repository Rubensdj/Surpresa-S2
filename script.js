/* script.js — Heart 3D (Three.js) + Contrato modal + Assinatura */
document.addEventListener('DOMContentLoaded', () => {
  // ---- 3D Heart with Three.js ----
  let camera, scene, renderer, heartGroup;

  function heartShape(scale) {
    const x = 0, y = 0;
    const s = scale;
    const shape = new THREE.Shape();
    shape.moveTo(x + 0.2 * s, y + 0.1 * s);
    shape.bezierCurveTo(x + 0.2 * s, y + 0.1 * s, x + 0.05 * s, y, x, y);
    shape.bezierCurveTo(x - 0.05 * s, y, x - 0.2 * s, y + 0.1 * s, x - 0.2 * s, y + 0.1 * s);
    shape.bezierCurveTo(x - 0.2 * s, y + 0.3 * s, x - 0.08 * s, y + 0.4 * s, x, y + 0.55 * s);
    shape.bezierCurveTo(x + 0.08 * s, y + 0.4 * s, x + 0.2 * s, y + 0.3 * s, x + 0.2 * s, y + 0.1 * s);
    return shape;
  }

  function init3D() {
    const canvas = document.getElementById('three-canvas');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 7;
    camera.position.y = 1;

    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const heartShape = createHeartShape();
    // Extrusion for 3D depth
    const extrudeSettings = {
      depth: 1.2,
      bevelEnabled: true,
      bevelSegments: 6,
      bevelSize: 0.2,
      bevelThickness: 0.2
    };
    const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    geometry.center();

    const material = new THREE.MeshPhysicalMaterial({
      color: 0xec4899,
      metalness: 0.3,
      roughness: 0.2,
      emissive: 0x6a1b9a,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide
    });
    heartMesh = new THREE.Mesh(geometry, material);
    heartMesh.scale.set(2.2, 2.2, 2.2);
    scene.add(heartMesh);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 1.2);
    dir.position.set(2, 4, 3);
    scene.add(dir);
    const point = new THREE.PointLight(0xff80bf, 1.5, 20);
    point.position.set(-3, 2, 3);
    scene.add(point);

    // Sparkles (floating particles)
    sparkles = [];
    const sparkleGeo = new THREE.BufferGeometry();
    const count = 180;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    sparkleGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const sparkleMat = new THREE.PointsMaterial({
      color: 0xffb6d9,
      size: 0.06,
      transparent: true,
      opacity: 0.8
    });
    sparkles = new THREE.Points(sparkleGeo, sparkleMat);
    scene.add(sparkles);

    window.addEventListener('resize', onResize);
    animate();
  }

  function createHeartShape() {
    const s = 2;
    const shape = new THREE.Shape();
    shape.moveTo(0.2 * s, 0.1 * s);
    shape.bezierCurveTo(0.2 * s, 0.1 * s, 0.05 * s, 0, 0, 0);
    shape.bezierCurveTo(-0.05 * s, 0, -0.2 * s, 0.1 * s, -0.2 * s, 0.1 * s);
    shape.bezierCurveTo(-0.2 * s, 0.3 * s, -0.08 * s, 0.4 * s, 0, 0.55 * s);
    shape.bezierCurveTo(0.08 * s, 0.4 * s, 0.2 * s, 0.3 * s, 0.2 * s, 0.1 * s);
    return shape;
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    requestAnimationFrame(animate);
    if (heartMesh) {
      heartMesh.rotation.y += 0.008;
      heartMesh.rotation.x = Math.sin(Date.now() * 0.001) * 0.08;
      heartMesh.position.y = Math.sin(Date.now() * 0.0015) * 0.15;
    }
    if (sparkles) {
      sparkles.rotation.y += 0.0006;
      sparkles.position.y += 0.003;
      if (sparkles.position.y > 4) sparkles.position.y = -4;
    }
    renderer.render(scene, camera);
  }

  let threeReady = false;
  function startThree() {
    if (threeReady) return;
    threeReady = true;
    init3D();
  }

  // Ensure Three.js is loaded before init
  const checkLoad = setInterval(() => {
    if (window.THREE) {
      clearInterval(checkLoad);
      startThree();
    }
  }, 100);
  setTimeout(() => clearInterval(checkLoad), 8000);

  // ---- Contract Modal ----
  const modal = document.getElementById('contract-modal');
  const openBtn = document.getElementById('open-contract');
  const closeBtn = document.getElementById('close-contract');
  openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
  closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });

  // ---- Signature ----
  const canvas = document.getElementById('signature');
  const ctx = canvas.getContext('2d');
  let drawing = false;
  canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  });
  canvas.addEventListener('mousemove', (e) => {
    if (drawing) {
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
    }
  });
  canvas.addEventListener('mouseup', () => (drawing = false));
  canvas.addEventListener('mouseleave', () => (drawing = false));
  document.getElementById('clear-signature').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
});