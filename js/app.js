/**
 * NYA — Interactive Particle Galaxy
 * js/app.js  (ES Module)
 */

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass }     from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

/* ─── WebGL check ─────────────────────────────────────────────── */
function supportsWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext('webgl') || c.getContext('experimental-webgl'))
    );
  } catch (_) {
    return false;
  }
}

if (!supportsWebGL()) {
  const fb = document.getElementById('webgl-fallback');
  if (fb) fb.style.display = 'flex';
  const canvas = document.getElementById('bg-canvas');
  if (canvas) canvas.style.display = 'none';
  throw new Error('WebGL not supported');
}

/* ─── Constants ───────────────────────────────────────────────── */
const PARTICLE_COUNT  = 12000;
const GALAXY_ARMS     = 5;
const ARM_SPREAD      = 0.55;
const GALAXY_RADIUS   = 8;
const GALAXY_THICKNESS = 0.6;
const ROTATION_SPEED  = 0.035;   // rad/s
const MOUSE_INFLUENCE = 2.8;
const CAMERA_LERP     = 0.035;

/* ─── Scene setup ─────────────────────────────────────────────── */
const canvas   = document.getElementById('bg-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 6, 14);
camera.lookAt(0, 0, 0);

/* ─── Shaders ─────────────────────────────────────────────────── */
const vertexShader = /* glsl */`
  attribute float aSize;
  attribute vec3  aColor;
  attribute float aPhase;

  uniform float uTime;
  uniform float uPixelRatio;
  uniform vec2  uMouse;

  varying vec3  vColor;
  varying float vDist;
  varying float vPhase;

  void main() {
    vec3 pos = position;

    // Breathing oscillation
    float breathe = sin(uTime * 0.8 + aPhase) * 0.04;
    pos.y += breathe;
    pos.x += cos(uTime * 0.6 + aPhase) * 0.025;

    // Mouse repulsion in XZ plane
    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    vec3 worldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
    vec2 toMouse = worldPos.xz - uMouse;
    float mouseDist = length(toMouse);
    float repulse = MOUSE_INFLUENCE / (mouseDist * mouseDist + 1.0);
    pos.x += normalize(toMouse).x * repulse * 0.35;
    pos.z += normalize(toMouse).y * repulse * 0.35;

    mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPos;

    // Depth-based size
    float depth = -mvPos.z;
    float sizeFactor = aSize * (300.0 / depth);
    // Twinkle
    float twinkle = 0.75 + 0.25 * sin(uTime * 3.0 + aPhase * 6.28);
    gl_PointSize = sizeFactor * twinkle * uPixelRatio;

    vColor = aColor;
    vDist  = length(position.xz) / 8.0; // normalised 0-1
    vPhase = aPhase;
  }
`.replace('MOUSE_INFLUENCE', MOUSE_INFLUENCE.toFixed(1));

const fragmentShader = /* glsl */`
  varying vec3  vColor;
  varying float vDist;
  varying float vPhase;

  uniform float uTime;

  void main() {
    // Smooth circular point
    vec2 uv   = gl_PointCoord - 0.5;
    float r   = length(uv) * 2.0;
    float alpha = 1.0 - smoothstep(0.6, 1.0, r);

    if (alpha < 0.01) discard;

    // Distance-based color blending
    vec3 col = vColor;
    float glow = 1.0 - smoothstep(0.0, 0.9, vDist);
    col = mix(col, vec3(1.0, 0.95, 1.0), glow * 0.4);

    // Soft alpha fade for distant particles
    float fade = 1.0 - smoothstep(0.5, 1.0, vDist);
    float finalAlpha = alpha * (0.55 + 0.45 * fade);

    gl_FragColor = vec4(col, finalAlpha);
  }
`;

/* ─── Geometry ────────────────────────────────────────────────── */
const geometry  = new THREE.BufferGeometry();
const positions = new Float32Array(PARTICLE_COUNT * 3);
const colors    = new Float32Array(PARTICLE_COUNT * 3);
const sizes     = new Float32Array(PARTICLE_COUNT);
const phases    = new Float32Array(PARTICLE_COUNT);

// Cosmic colour palette (blues, purples, pinks, warm whites)
const palette = [
  new THREE.Color('#4fc3f7'),  // electric blue
  new THREE.Color('#b388ff'),  // cosmic purple
  new THREE.Color('#f48fb1'),  // soft pink
  new THREE.Color('#e1f5fe'),  // icy white-blue
  new THREE.Color('#ce93d8'),  // light purple
  new THREE.Color('#ffffff'),  // pure white
];

for (let i = 0; i < PARTICLE_COUNT; i++) {
  const i3 = i * 3;

  // Spiral arm placement
  const arm     = Math.floor(Math.random() * GALAXY_ARMS);
  const t       = Math.pow(Math.random(), 0.6);        // bias towards centre
  const radius  = t * GALAXY_RADIUS;
  const angle   = (arm / GALAXY_ARMS) * Math.PI * 2
                + t * Math.PI * 3                      // spiral twist
                + (Math.random() - 0.5) * ARM_SPREAD;

  positions[i3]     = Math.cos(angle) * radius + (Math.random() - 0.5) * ARM_SPREAD * radius * 0.3;
  positions[i3 + 1] = (Math.random() - 0.5) * GALAXY_THICKNESS * (1 - t * 0.6);
  positions[i3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * ARM_SPREAD * radius * 0.3;

  // Random colour from palette
  const col = palette[Math.floor(Math.random() * palette.length)].clone();
  // Add slight random hue shift
  col.r += (Math.random() - 0.5) * 0.15;
  col.g += (Math.random() - 0.5) * 0.15;
  col.b += (Math.random() - 0.5) * 0.15;
  colors[i3]     = Math.max(0, Math.min(1, col.r));
  colors[i3 + 1] = Math.max(0, Math.min(1, col.g));
  colors[i3 + 2] = Math.max(0, Math.min(1, col.b));

  sizes[i]  = Math.random() * 1.6 + 0.4;
  phases[i] = Math.random() * Math.PI * 2;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('aColor',   new THREE.BufferAttribute(colors,    3));
geometry.setAttribute('aSize',    new THREE.BufferAttribute(sizes,     1));
geometry.setAttribute('aPhase',   new THREE.BufferAttribute(phases,    1));

/* ─── Material ────────────────────────────────────────────────── */
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTime:       { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uMouse:      { value: new THREE.Vector2(0, 0) },
  },
  transparent: true,
  depthWrite:  false,
  blending:    THREE.AdditiveBlending,
  vertexColors: false,
});

const points = new THREE.Points(geometry, material);
scene.add(points);

/* ─── Post-processing ─────────────────────────────────────────── */
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloom = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.1,   // strength
  0.5,   // radius
  0.05   // threshold
);
composer.addPass(bloom);

/* ─── Mouse tracking ──────────────────────────────────────────── */
const mouse       = new THREE.Vector2(0, 0);  // NDC
const mouseWorld  = new THREE.Vector2(0, 0);  // world XZ

window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth)  * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  // Approximate world-space XZ at y=0 plane
  mouseWorld.x = mouse.x * 9;
  mouseWorld.y = -mouse.y * 5;
});

/* ─── Camera orbit state ──────────────────────────────────────── */
let   cameraAngle    = 0;
const cameraRadius   = 14;
const cameraHeight   = 6;
let   targetCamX     = 0;
let   targetCamY     = cameraHeight;
let   currentCamX    = 0;
let   currentCamY    = cameraHeight;

/* ─── Clock & animation loop ──────────────────────────────────── */
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();

  // Rotate galaxy
  points.rotation.y += ROTATION_SPEED * delta;

  // Update uniforms
  material.uniforms.uTime.value  = elapsed;
  material.uniforms.uMouse.value = mouseWorld;

  // Camera: slow auto-orbit + subtle mouse parallax
  cameraAngle += 0.08 * delta;
  targetCamX = Math.sin(cameraAngle) * cameraRadius + mouse.x * 1.2;
  targetCamY = cameraHeight + mouse.y * 0.8;

  currentCamX += (targetCamX - currentCamX) * CAMERA_LERP;
  currentCamY += (targetCamY - currentCamY) * CAMERA_LERP;

  camera.position.x = currentCamX;
  camera.position.y = currentCamY;
  camera.position.z = Math.cos(cameraAngle) * cameraRadius;
  camera.lookAt(0, 0, 0);

  composer.render();
}

animate();

/* ─── Resize handler ──────────────────────────────────────────── */
window.addEventListener('resize', () => {
  const w = window.innerWidth;
  const h = window.innerHeight;

  camera.aspect = w / h;
  camera.updateProjectionMatrix();

  renderer.setSize(w, h);
  composer.setSize(w, h);

  material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
});

/* ─── Nav scroll effect ───────────────────────────────────────── */
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });

/* ─── Smooth scroll for nav links ─────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ─── Scroll reveal ───────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* ─── Contact form prevent default ───────────────────────────── */
const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
  });
}
