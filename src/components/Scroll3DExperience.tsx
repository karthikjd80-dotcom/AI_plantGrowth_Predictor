import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  Sparkles, 
  Sprout, 
  Scan, 
  Activity, 
  RotateCw, 
  Sun, 
  Moon, 
  Camera, 
  Upload, 
  ArrowRight, 
  ChevronDown, 
  Eye, 
  Cpu, 
  CheckCircle2, 
  Compass, 
  Layers, 
  Maximize2,
  Minimize2,
  Leaf
} from 'lucide-react';
import { PlantSpeciesId } from '../data/plantProfiles';

interface Scroll3DExperienceProps {
  onStartApp?: () => void;
  onOpenCamera?: () => void;
  onOpenUpload?: () => void;
  onOpenChat?: () => void;
  onExploreCareGuide?: () => void;
  isDarkMode?: boolean;
}

interface StageMeta {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  stats: { label: string; value: string; color?: string }[];
  cameraPos: [number, number, number];
  cameraTarget: [number, number, number];
}

const STAGES: StageMeta[] = [
  {
    id: 1,
    badge: 'PHASE 01 // SEED GENESIS',
    title: 'From Spore to Living Meristem',
    subtitle: 'Embryonic Germination & Cotyledon Emergence',
    description: 'Real-time procedural simulation of seed coat imbibition, radicle anchoring into humus loam, and initial cotyledon phototropism.',
    stats: [
      { label: 'Plant Height', value: '1.4 cm', color: 'text-emerald-500' },
      { label: 'Soil Moisture', value: '88% Optimal', color: 'text-sky-500' },
      { label: 'Solar Spectrum', value: 'Dawn 4,200K', color: 'text-amber-500' },
    ],
    cameraPos: [1.8, 0.9, 2.6],
    cameraTarget: [0, 0.35, 0],
  },
  {
    id: 2,
    badge: 'PHASE 02 // CANOPY EXPANSION',
    title: 'Procedural Stem & Leaf Elongation',
    subtitle: 'Fibonacci Phyllotaxis & Internode Dynamics',
    description: 'L-system branching algorithms calculate cellular turgor pressure as the central xylem elongates and broad leaves unfurl in 137.5° golden spirals.',
    stats: [
      { label: 'Vegetative Height', value: '18.2 cm', color: 'text-emerald-500' },
      { label: 'Canopy Spread', value: '24.5 cm', color: 'text-teal-500' },
      { label: 'Leaf Area Index', value: '142 cm²', color: 'text-orange-500' },
    ],
    cameraPos: [-2.6, 2.4, 3.4],
    cameraTarget: [0, 1.4, 0],
  },
  {
    id: 3,
    badge: 'PHASE 03 // COMPUTER VISION SCAN',
    title: 'Optical Microscopic Pathology',
    subtitle: 'Real-Time Deep Feature Laser Diagnostics',
    description: 'Holographic laser scan sweeps the leaf epidermal plane. Convolutional vision models isolate chlorotic halos, fungal hyphae, and powdery mildew lesions before necrosis spreads.',
    stats: [
      { label: 'Detection Accuracy', value: '98.4%', color: 'text-emerald-400' },
      { label: 'Pathogen Risk', value: '0.0% (Clean)', color: 'text-teal-400' },
      { label: 'Scan Latency', value: '42 ms', color: 'text-orange-400' },
    ],
    cameraPos: [1.1, 1.8, 1.5],
    cameraTarget: [0.25, 1.6, 0.1],
  },
  {
    id: 4,
    badge: 'PHASE 04 // REPRODUCTIVE PHENOLOGY',
    title: 'Budding, Flowering & Fruit Ripening',
    subtitle: 'Golden Petals & Specular Cherry Tomatoes',
    description: 'Yellow floral blossoms synthesize nutrients, transforming into succulent, high-gloss botanical tomatoes with natural skin translucency and dewdrop physics.',
    stats: [
      { label: 'Fruit Clusters', value: '7 Ripe', color: 'text-rose-500' },
      { label: 'Brix Sugar Est.', value: '9.2° Brix', color: 'text-amber-500' },
      { label: 'Harvest Window', value: 'Day 55–65', color: 'text-emerald-500' },
    ],
    cameraPos: [2.8, 2.0, 2.9],
    cameraTarget: [0, 1.5, 0],
  },
  {
    id: 5,
    badge: 'PHASE 05 // 3D COCKPIT SANDBOX',
    title: 'Autonomous Botanical Cockpit',
    subtitle: 'Interactive 360° Inspection & Real-World AI Toolkit',
    description: 'Full 3D orbit controls unlocked. Drag to rotate, zoom into micro-leaf structures, calibrate lighting, and launch the real AI scanner on your own live houseplants.',
    stats: [
      { label: 'Model Engine', value: 'Three.js PBR', color: 'text-emerald-400' },
      { label: 'AI Accuracy', value: '98.4% Top-1', color: 'text-orange-400' },
      { label: 'Trajectory R²', value: '0.894 ML', color: 'text-sky-400' },
    ],
    cameraPos: [0, 1.9, 4.4],
    cameraTarget: [0, 1.3, 0],
  },
];

/**
 * Creates a procedural leaf texture with realistic veins and cellular gradients
 */
function createProceduralLeafTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createLinearGradient(0, 512, 0, 0);
  grad.addColorStop(0, '#66b863');
  grad.addColorStop(0.35, '#3b9444');
  grad.addColorStop(1, '#236e2d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Micro cellular noise
  for (let i = 0; i < 350; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)';
    ctx.beginPath();
    ctx.arc(Math.random() * 512, Math.random() * 512, Math.random() * 3.5 + 1, 0, Math.PI * 2);
    ctx.fill();
  }

  // Primary midrib
  ctx.beginPath();
  ctx.moveTo(256, 512);
  ctx.quadraticCurveTo(256, 260, 256, 15);
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#8ee088';
  ctx.stroke();

  ctx.lineWidth = 3;
  ctx.strokeStyle = '#ebffe6';
  ctx.stroke();

  // Lateral secondary veins
  for (let i = 0; i < 14; i++) {
    const y = 470 - i * 32;
    const spread = 105 + Math.sin(i * 0.45) * 45;

    ctx.beginPath();
    ctx.moveTo(256, y);
    ctx.quadraticCurveTo(256 + spread * 0.5, y - 22, 256 + spread, y - 44);
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = '#8ee088';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(256, y);
    ctx.quadraticCurveTo(256 - spread * 0.5, y - 22, 256 - spread, y - 44);
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = '#8ee088';
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Creates potting soil texture with organic humus chunks
 */
function createProceduralSoilTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#221810';
  ctx.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 800; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const r = Math.random() * 2.5 + 0.8;
    const isPerlite = Math.random() < 0.08;
    ctx.fillStyle = isPerlite ? '#ebe5d8' : Math.random() > 0.5 ? '#150e09' : '#3d2b1d';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

export function Scroll3DExperience({
  onStartApp,
  onOpenCamera,
  onOpenUpload,
  onOpenChat,
  onExploreCareGuide,
  isDarkMode = false,
}: Scroll3DExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  
  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const plantGroupRef = useRef<THREE.Group | null>(null);
  const laserScannerRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const fruitsGroupRef = useRef<THREE.Group | null>(null);
  const leavesRef = useRef<THREE.Mesh[]>([]);
  const stemSegmentsRef = useRef<THREE.Mesh[]>([]);
  const sproutRef = useRef<THREE.Group | null>(null);
  const flowersGroupRef = useRef<THREE.Group | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);

  // Scroll state & progress
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeStageId, setActiveStageId] = useState(1);
  const [isInteractiveMode, setIsInteractiveMode] = useState(false);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [lightingMode, setLightingMode] = useState<'sunlight' | 'golden' | 'bioluminescent'>('sunlight');
  const [autoRotate, setAutoRotate] = useState(false);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

  // Smooth lerp refs for 60fps animation
  const currentScrollRef = useRef(0);
  const targetScrollRef = useRef(0);

  // 1. SETUP THREE.JS SCENE ON MOUNT
  useEffect(() => {
    if (!canvasContainerRef.current) return;

    const width = canvasContainerRef.current.clientWidth;
    const height = canvasContainerRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
    camera.position.set(...STAGES[0].cameraPos);
    camera.lookAt(new THREE.Vector3(...STAGES[0].cameraTarget));
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    canvasContainerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // OrbitControls (Disabled during scroll, enabled in cockpit mode)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 8.5;
    controls.minDistance = 1.2;
    controls.maxPolarAngle = Math.PI / 2 + 0.1; // Don't go below ground
    controls.target.set(0, 1.3, 0);
    controls.enabled = false;
    controlsRef.current = controls;

    // LIGHTING RIG
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff5e6, 2.2);
    sunLight.position.set(4, 7, 5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // Secondary fill light
    const fillLight = new THREE.DirectionalLight(0x73a8ff, 0.7);
    fillLight.position.set(-4, 3, -3);
    scene.add(fillLight);

    // Subtle green bounce light
    const bounceLight = new THREE.DirectionalLight(0x44dd88, 0.4);
    bounceLight.position.set(0, -2, 2);
    scene.add(bounceLight);

    // ROOT PLANT CONTAINER
    const plantGroup = new THREE.Group();
    scene.add(plantGroup);
    plantGroupRef.current = plantGroup;

    // -------------------------------------------------------------
    // A. TERRACOTTA POT & SOIL BED
    // -------------------------------------------------------------
    const potMat = new THREE.MeshStandardMaterial({
      color: 0xc86438,
      roughness: 0.85,
      metalness: 0.05,
    });
    
    // Pot body
    const potGeo = new THREE.CylinderGeometry(0.85, 0.65, 1.2, 32);
    const potMesh = new THREE.Mesh(potGeo, potMat);
    potMesh.position.y = 0.6;
    potMesh.castShadow = true;
    potMesh.receiveShadow = true;
    plantGroup.add(potMesh);

    // Pot upper rim
    const rimGeo = new THREE.CylinderGeometry(0.92, 0.88, 0.18, 32);
    const rimMesh = new THREE.Mesh(rimGeo, potMat);
    rimMesh.position.y = 1.2;
    rimMesh.castShadow = true;
    plantGroup.add(rimMesh);

    // Pot soil disc
    const soilTex = createProceduralSoilTexture();
    const soilMat = new THREE.MeshStandardMaterial({
      map: soilTex,
      roughness: 0.95,
      color: 0x3d2a1c,
    });
    const soilGeo = new THREE.CylinderGeometry(0.83, 0.83, 0.08, 32);
    const soilMesh = new THREE.Mesh(soilGeo, soilMat);
    soilMesh.position.y = 1.15;
    soilMesh.receiveShadow = true;
    plantGroup.add(soilMesh);

    // -------------------------------------------------------------
    // B. PHASE 1 SPROUT (Emerging cotyledons from soil)
    // -------------------------------------------------------------
    const sproutGroup = new THREE.Group();
    sproutGroup.position.set(0, 1.18, 0);

    const sproutMat = new THREE.MeshStandardMaterial({
      color: 0x76dd65,
      roughness: 0.35,
    });
    const sproutStemGeo = new THREE.CylinderGeometry(0.02, 0.03, 0.25, 8);
    const sproutStem = new THREE.Mesh(sproutStemGeo, sproutMat);
    sproutStem.position.y = 0.12;
    sproutGroup.add(sproutStem);

    // 2 small seed leaf cotyledons
    const cotyledonGeo = new THREE.SphereGeometry(0.06, 12, 8);
    cotyledonGeo.scale(1.2, 0.2, 2.0);
    const cotyledonLeft = new THREE.Mesh(cotyledonGeo, sproutMat);
    cotyledonLeft.position.set(-0.06, 0.24, 0);
    cotyledonLeft.rotation.z = Math.PI / 5;
    sproutGroup.add(cotyledonLeft);

    const cotyledonRight = new THREE.Mesh(cotyledonGeo, sproutMat);
    cotyledonRight.position.set(0.06, 0.24, 0);
    cotyledonRight.rotation.z = -Math.PI / 5;
    sproutGroup.add(cotyledonRight);

    plantGroup.add(sproutGroup);
    sproutRef.current = sproutGroup;

    // -------------------------------------------------------------
    // C. FULL VEGETATIVE STEM & LEAVES
    // -------------------------------------------------------------
    const leafTex = createProceduralLeafTexture();
    const leafMat = new THREE.MeshStandardMaterial({
      map: leafTex,
      color: 0xffffff,
      roughness: 0.45,
      metalness: 0.08,
      side: THREE.DoubleSide,
    });

    const stemMat = new THREE.MeshStandardMaterial({
      color: 0x3e8a42,
      roughness: 0.6,
      metalness: 0.05,
    });

    // We build 7 progressive vertical stem segments
    const stemSegments: THREE.Mesh[] = [];
    const leafMeshes: THREE.Mesh[] = [];
    const totalSegments = 7;
    const segmentHeight = 0.32;

    for (let i = 0; i < totalSegments; i++) {
      const radiusTop = 0.045 - i * 0.0035;
      const radiusBottom = 0.05 - i * 0.0035;
      const stemGeo = new THREE.CylinderGeometry(radiusTop, radiusBottom, segmentHeight, 12);
      const stemMesh = new THREE.Mesh(stemGeo, stemMat);
      
      const baseY = 1.18 + i * segmentHeight + segmentHeight / 2;
      stemMesh.position.set(
        Math.sin(i * 0.6) * 0.02,
        baseY,
        Math.cos(i * 0.6) * 0.02
      );
      stemMesh.rotation.z = Math.sin(i * 0.7) * 0.04;
      stemMesh.castShadow = true;
      plantGroup.add(stemMesh);
      stemSegments.push(stemMesh);

      // Add 2 leaves at this node, rotated with golden angle ~137.5 degrees
      const angle = i * 2.4;
      for (let side = -1; side <= 1; side += 2) {
        if (side === 0) continue;
        const leafAngle = angle + (side > 0 ? 0.3 : Math.PI - 0.3);
        
        // Procedural leaf shape
        const leafShape = new THREE.Shape();
        leafShape.moveTo(0, 0);
        leafShape.quadraticCurveTo(0.22, 0.18, 0.38, 0.45);
        leafShape.quadraticCurveTo(0.18, 0.75, 0, 0.95);
        leafShape.quadraticCurveTo(-0.18, 0.75, -0.38, 0.45);
        leafShape.quadraticCurveTo(-0.22, 0.18, 0, 0);

        const leafGeo = new THREE.ShapeGeometry(leafShape, 12);
        // Adjust UV mapping
        const pos = leafGeo.attributes.position;
        const uvs = new Float32Array(pos.count * 2);
        for (let p = 0; p < pos.count; p++) {
          uvs[p * 2] = (pos.getX(p) + 0.4) / 0.8;
          uvs[p * 2 + 1] = pos.getY(p) / 0.95;
        }
        leafGeo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

        const leafMesh = new THREE.Mesh(leafGeo, leafMat);
        const leafScale = 0.65 + i * 0.06;
        leafMesh.scale.set(leafScale, leafScale, leafScale);
        
        // Position at stem joint
        leafMesh.position.set(
          Math.sin(leafAngle) * 0.05,
          baseY + 0.1,
          Math.cos(leafAngle) * 0.05
        );
        // Tilt outwards & downwards
        leafMesh.rotation.y = leafAngle;
        leafMesh.rotation.x = -Math.PI / 3.2 + Math.sin(i * 0.8) * 0.1;
        leafMesh.rotation.z = side * 0.15;
        leafMesh.castShadow = true;
        
        plantGroup.add(leafMesh);
        leafMeshes.push(leafMesh);
      }
    }

    stemSegmentsRef.current = stemSegments;
    leavesRef.current = leafMeshes;

    // -------------------------------------------------------------
    // D. YELLOW FLOWERS & BLOOMS (Phase 4)
    // -------------------------------------------------------------
    const flowersGroup = new THREE.Group();
    plantGroup.add(flowersGroup);
    flowersGroupRef.current = flowersGroup;

    const flowerMat = new THREE.MeshStandardMaterial({
      color: 0xffd524,
      roughness: 0.35,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });

    // 3 flower clusters
    const flowerPositions: [number, number, number][] = [
      [0.25, 2.5, 0.15],
      [-0.22, 2.8, -0.1],
      [0.1, 3.1, -0.2],
    ];

    flowerPositions.forEach(([fx, fy, fz]) => {
      const flowerSub = new THREE.Group();
      flowerSub.position.set(fx, fy, fz);

      // 5 star petals
      for (let p = 0; p < 5; p++) {
        const petalAngle = (p / 5) * Math.PI * 2;
        const petalGeo = new THREE.ConeGeometry(0.045, 0.14, 5);
        petalGeo.scale(1, 0.25, 1);
        const petalMesh = new THREE.Mesh(petalGeo, flowerMat);
        petalMesh.position.set(Math.sin(petalAngle) * 0.07, 0, Math.cos(petalAngle) * 0.07);
        petalMesh.rotation.y = petalAngle;
        petalMesh.rotation.x = Math.PI / 2.3;
        flowerSub.add(petalMesh);
      }

      // Center pistil / stamen
      const centerGeo = new THREE.SphereGeometry(0.035, 8, 8);
      const centerMat = new THREE.MeshStandardMaterial({ color: 0x88cc22 });
      const centerMesh = new THREE.Mesh(centerGeo, centerMat);
      flowerSub.add(centerMesh);

      flowersGroup.add(flowerSub);
    });

    // -------------------------------------------------------------
    // E. RED CHERRY TOMATO FRUITS (Phase 4 & 5)
    // -------------------------------------------------------------
    const fruitsGroup = new THREE.Group();
    plantGroup.add(fruitsGroup);
    fruitsGroupRef.current = fruitsGroup;

    const tomatoMat = new THREE.MeshPhysicalMaterial({
      color: 0xdf2218,
      roughness: 0.18,
      metalness: 0.05,
      clearcoat: 0.9,
      clearcoatRoughness: 0.12,
    });

    const calyxMat = new THREE.MeshStandardMaterial({
      color: 0x22882e,
      roughness: 0.6,
    });

    const fruitCoords = [
      { pos: [0.32, 2.15, 0.22], size: 0.14 },
      { pos: [0.22, 2.05, 0.35], size: 0.12 },
      { pos: [-0.28, 2.3, 0.18], size: 0.13 },
      { pos: [-0.18, 2.1, -0.25], size: 0.15 },
      { pos: [0.12, 2.65, -0.22], size: 0.11 },
      { pos: [0.35, 2.45, -0.05], size: 0.13 },
      { pos: [-0.25, 1.85, 0.28], size: 0.12 },
    ];

    fruitCoords.forEach(({ pos: [fx, fy, fz], size }) => {
      const singleFruit = new THREE.Group();
      singleFruit.position.set(fx, fy, fz);

      // Red tomato body
      const fruitGeo = new THREE.SphereGeometry(size, 20, 16);
      fruitGeo.scale(1.05, 0.95, 1.05); // slightly oblate like cherry tomatoes
      const fruitMesh = new THREE.Mesh(fruitGeo, tomatoMat);
      fruitMesh.castShadow = true;
      singleFruit.add(fruitMesh);

      // Green star calyx on top
      for (let c = 0; c < 5; c++) {
        const calyxAngle = (c / 5) * Math.PI * 2;
        const sepGeo = new THREE.ConeGeometry(0.02, size * 0.65, 4);
        const sepMesh = new THREE.Mesh(sepGeo, calyxMat);
        sepMesh.position.set(
          Math.sin(calyxAngle) * (size * 0.4),
          size * 0.85,
          Math.cos(calyxAngle) * (size * 0.4)
        );
        sepMesh.rotation.y = calyxAngle;
        sepMesh.rotation.x = Math.PI / 3;
        singleFruit.add(sepMesh);
      }

      fruitsGroup.add(singleFruit);
    });

    // -------------------------------------------------------------
    // F. HOLOGRAPHIC OPTICAL SCANNER (Phase 3)
    // -------------------------------------------------------------
    const laserScannerGroup = new THREE.Group();
    laserScannerGroup.position.set(0, 1.7, 0);

    // Glowing scan ring
    const ringGeo = new THREE.TorusGeometry(0.85, 0.015, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00ffcc,
      transparent: true,
      opacity: 0.85,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    laserScannerGroup.add(ringMesh);

    // Laser scan plane disc with animated scan beam
    const planeGeo = new THREE.CircleGeometry(0.85, 32);
    const planeMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
    });
    const planeMesh = new THREE.Mesh(planeGeo, planeMat);
    planeMesh.rotation.x = Math.PI / 2;
    laserScannerGroup.add(planeMesh);

    scene.add(laserScannerGroup);
    laserScannerRef.current = laserScannerGroup;
    laserScannerGroup.visible = false;

    // -------------------------------------------------------------
    // G. FLOATING BOTANICAL PARTICLES (Spores, Pollen & Sunlight Motes)
    // -------------------------------------------------------------
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; z: number }[] = [];

    for (let p = 0; p < particleCount; p++) {
      particlePositions[p * 3] = (Math.random() - 0.5) * 5;
      particlePositions[p * 3 + 1] = Math.random() * 4.5 + 0.2;
      particlePositions[p * 3 + 2] = (Math.random() - 0.5) * 5;

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.003,
        y: Math.random() * 0.004 + 0.002,
        z: (Math.random() - 0.5) * 0.003,
      });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffd97d,
      size: 0.045,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // -------------------------------------------------------------
    // H. ANIMATION LOOP (Runs smooth 60fps lerp)
    // -------------------------------------------------------------
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Lerp current scroll toward target scroll
      currentScrollRef.current += (targetScrollRef.current - currentScrollRef.current) * 0.085;
      const progress = Math.max(0, Math.min(1, currentScrollRef.current));
      setScrollProgress(progress);

      // Determine active stage from progress
      const stageIdx = Math.min(
        STAGES.length - 1,
        Math.floor(progress * (STAGES.length - 0.0001))
      );
      setActiveStageId(STAGES[stageIdx].id);

      // Check if in Stage 5 (Cockpit mode)
      const inCockpit = progress >= 0.88;
      setIsInteractiveMode(inCockpit);
      if (controlsRef.current) {
        controlsRef.current.enabled = inCockpit;
        if (inCockpit) {
          controlsRef.current.autoRotate = autoRotate;
          controlsRef.current.autoRotateSpeed = 1.2;
          controlsRef.current.update();
        }
      }

      // CAMERA POSITION INTERPOLATION (when not in cockpit mode)
      if (cameraRef.current && !inCockpit) {
        // Find segment between stages
        const stageProgress = progress * (STAGES.length - 1);
        const lowerStage = Math.floor(stageProgress);
        const upperStage = Math.min(STAGES.length - 1, lowerStage + 1);
        const localT = stageProgress - lowerStage;

        const s1 = STAGES[lowerStage];
        const s2 = STAGES[upperStage];

        const cx = THREE.MathUtils.lerp(s1.cameraPos[0], s2.cameraPos[0], localT);
        const cy = THREE.MathUtils.lerp(s1.cameraPos[1], s2.cameraPos[1], localT);
        const cz = THREE.MathUtils.lerp(s1.cameraPos[2], s2.cameraPos[2], localT);

        const tx = THREE.MathUtils.lerp(s1.cameraTarget[0], s2.cameraTarget[0], localT);
        const ty = THREE.MathUtils.lerp(s1.cameraTarget[1], s2.cameraTarget[1], localT);
        const tz = THREE.MathUtils.lerp(s1.cameraTarget[2], s2.cameraTarget[2], localT);

        cameraRef.current.position.set(cx, cy, cz);
        cameraRef.current.lookAt(tx, ty, tz);
        if (controlsRef.current && !inCockpit) {
          controlsRef.current.target.set(tx, ty, tz);
        }
      }

      // -----------------------------------------------------------
      // MORPHOLOGICAL BOTANICAL GROWTH SYNCHRONIZED TO SCROLL
      // -----------------------------------------------------------
      // Phase 1 (0.0 to 0.25): Sprout visible, scales up
      if (sproutRef.current) {
        if (progress < 0.28) {
          sproutRef.current.visible = true;
          const sproutScale = Math.min(1.5, progress * 6.0);
          sproutRef.current.scale.set(sproutScale, sproutScale, sproutScale);
        } else {
          sproutRef.current.visible = false;
        }
      }

      // Phase 2 onwards: Main stem segments grow progressively
      const stemProg = Math.max(0, (progress - 0.08) / 0.55); // 0 at progress=0.08, 1 at progress=0.63
      stemSegmentsRef.current.forEach((stem, idx) => {
        const threshold = idx / stemSegmentsRef.current.length;
        if (stemProg >= threshold) {
          stem.visible = true;
          const localScaleY = Math.min(1, (stemProg - threshold) * stemSegmentsRef.current.length);
          stem.scale.set(1, localScaleY, 1);
        } else {
          stem.visible = false;
        }
      });

      // Leaves unfurl based on stem height & scroll
      const leafProg = Math.max(0, (progress - 0.12) / 0.55);
      leavesRef.current.forEach((leaf, idx) => {
        const leafThreshold = idx / leavesRef.current.length;
        if (leafProg >= leafThreshold) {
          leaf.visible = true;
          const scaleFactor = Math.min(1, (leafProg - leafThreshold) * 3.5);
          leaf.scale.set(scaleFactor, scaleFactor, scaleFactor);
          // Subtle fluttering in the gentle breeze
          leaf.rotation.z = Math.sin(elapsedTime * 1.5 + idx) * 0.035;
        } else {
          leaf.visible = false;
        }
      });

      // Phase 3: Laser Scanner activates during progress 0.42 to 0.72
      if (laserScannerRef.current) {
        if (progress >= 0.42 && progress <= 0.72) {
          laserScannerRef.current.visible = true;
          // Sweep laser up and down
          const scanY = 1.35 + Math.sin(elapsedTime * 3.2) * 0.55;
          laserScannerRef.current.position.y = scanY;
        } else {
          laserScannerRef.current.visible = false;
        }
      }

      // Phase 4: Flowers emerge (0.60 to 0.82)
      if (flowersGroupRef.current) {
        if (progress >= 0.60 && progress <= 0.88) {
          flowersGroupRef.current.visible = true;
          const fScale = Math.min(1, (progress - 0.60) * 4);
          flowersGroupRef.current.scale.set(fScale, fScale, fScale);
        } else {
          flowersGroupRef.current.visible = false;
        }
      }

      // Phase 4 & 5: Tomatoes emerge & scale up (0.72 to 1.0)
      if (fruitsGroupRef.current) {
        if (progress >= 0.72) {
          fruitsGroupRef.current.visible = true;
          const fruitScale = Math.min(1, (progress - 0.72) * 4.5);
          fruitsGroupRef.current.scale.set(fruitScale, fruitScale, fruitScale);
        } else {
          fruitsGroupRef.current.visible = false;
        }
      }

      // Animate floating botanical spores/particles
      if (particlesRef.current) {
        const posAttr = particlesRef.current.geometry.attributes.position;
        for (let p = 0; p < particleCount; p++) {
          let py = posAttr.getY(p) + particleVelocities[p].y;
          let px = posAttr.getX(p) + particleVelocities[p].x + Math.sin(elapsedTime * 0.8 + p) * 0.001;
          let pz = posAttr.getZ(p) + particleVelocities[p].z;

          if (py > 5.0) py = 0.3; // Loop from bottom
          posAttr.setY(p, py);
          posAttr.setX(p, px);
          posAttr.setZ(p, pz);
        }
        posAttr.needsUpdate = true;
      }

      // Gentle continuous ambient plant breathing motion
      if (plantGroupRef.current && !inCockpit) {
        plantGroupRef.current.rotation.y = Math.sin(elapsedTime * 0.35) * 0.08;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!canvasContainerRef.current || !rendererRef.current || !cameraRef.current) return;
      const newW = canvasContainerRef.current.clientWidth;
      const newH = canvasContainerRef.current.clientHeight;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // CLEANUP
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      if (rendererRef.current && canvasContainerRef.current) {
        canvasContainerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }

      // Dispose geometries and materials
      potGeo.dispose();
      rimGeo.dispose();
      soilGeo.dispose();
      potMat.dispose();
      soilMat.dispose();
      soilTex.dispose();
      leafTex.dispose();
      leafMat.dispose();
      stemMat.dispose();
      flowerMat.dispose();
      tomatoMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      controls.dispose();
    };
  }, []);

  // 2. WINDOW SCROLL LISTENER (Computes percentage 0.0 -> 1.0)
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollY = window.scrollY;
      const totalHeight = containerRef.current.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;

      const rawProgress = scrollY / totalHeight;
      targetScrollRef.current = Math.max(0, Math.min(1, rawProgress));
      setIsScrolledToBottom(rawProgress > 0.95);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Jump to specific stage on click
  const scrollToStage = (stageId: number) => {
    if (!containerRef.current) return;
    const totalHeight = containerRef.current.scrollHeight - window.innerHeight;
    const targetFraction = (stageId - 1) / (STAGES.length - 1);
    window.scrollTo({
      top: targetFraction * totalHeight,
      behavior: 'smooth',
    });
  };

  // Wireframe toggle
  useEffect(() => {
    if (!sceneRef.current) return;
    sceneRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => {
            if ('wireframe' in m) {
              (m as THREE.MeshStandardMaterial).wireframe = wireframeMode;
            }
          });
        } else if (mesh.material && 'wireframe' in mesh.material) {
          (mesh.material as THREE.MeshStandardMaterial).wireframe = wireframeMode;
        }
      }
    });
  }, [wireframeMode]);

  // Lighting mode switcher
  useEffect(() => {
    if (!sunLightRef.current || !sceneRef.current) return;
    if (lightingMode === 'sunlight') {
      sunLightRef.current.color.setHex(0xfff5e6);
      sunLightRef.current.intensity = 2.2;
    } else if (lightingMode === 'golden') {
      sunLightRef.current.color.setHex(0xffaa44);
      sunLightRef.current.intensity = 2.8;
    } else if (lightingMode === 'bioluminescent') {
      sunLightRef.current.color.setHex(0x00ffaa);
      sunLightRef.current.intensity = 1.6;
    }
  }, [lightingMode]);

  const currentStage = STAGES.find((s) => s.id === activeStageId) || STAGES[0];

  return (
    <div ref={containerRef} className="relative w-full text-slate-900 dark:text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
      
      {/* ========================================================= */}
      {/* 1. FIXED FULLSCREEN 3D WEBGL CANVAS BACKGROUND            */}
      {/* ========================================================= */}
      <div 
        ref={canvasContainerRef}
        className="fixed inset-0 w-full h-full z-0 pointer-events-auto overflow-hidden bg-gradient-to-b from-[#FAF8F3] via-[#F4F0E8] to-[#EBE4D5] dark:from-[#070D08] dark:via-[#0A140D] dark:to-[#040805]"
      />

      {/* Atmospheric Vignette & Subtle Grid Lines Overlay */}
      <div className="fixed inset-0 pointer-events-none z-1 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.18)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]" />

      {/* ========================================================= */}
      {/* 2. HUD: STAGE NAVIGATION MILESTONES (Left Pinned Dots)    */}
      {/* ========================================================= */}
      <div className="fixed left-3 sm:left-8 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-start gap-3">
        <div className="flex flex-col items-start gap-2.5 p-2 rounded-2xl bg-white/40 dark:bg-black/35 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-lg">
          {STAGES.map((s) => {
            const isActive = activeStageId === s.id;
            return (
              <button
                key={s.id}
                onClick={() => scrollToStage(s.id)}
                className={`group flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30'
                    : 'hover:bg-white/50 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400'
                }`}
                title={s.title}
              >
                <span className={`text-[10px] font-mono font-black ${isActive ? 'text-white' : 'text-slate-500'}`}>
                  0{s.id}
                </span>
                <span className={`text-xs font-bold transition-all ${isActive ? 'opacity-100 max-w-[130px]' : 'opacity-70 group-hover:opacity-100 max-w-0 sm:group-hover:max-w-[130px] overflow-hidden whitespace-nowrap'}`}>
                  {s.badge.split('// ')[1] || s.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Scroll Percentage Gauge */}
        <div className="px-3 py-1 rounded-full bg-white/60 dark:bg-black/50 backdrop-blur-md border border-white/60 dark:border-white/10 text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300">
          Scroll: {Math.round(scrollProgress * 100)}%
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. TOP RIGHT 3D HUD CONTROLS (Wireframe, Sun, Orbit)     */}
      {/* ========================================================= */}
      <div className="fixed top-18 right-3 sm:right-8 z-30 flex items-center gap-2">
        {/* Wireframe toggle */}
        <button
          onClick={() => setWireframeMode(!wireframeMode)}
          className={`p-2 sm:px-3 sm:py-2 rounded-xl backdrop-blur-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
            wireframeMode
              ? 'bg-orange-500 text-white border-orange-400 shadow-orange-500/30'
              : 'bg-white/70 dark:bg-black/40 text-slate-700 dark:text-slate-200 border-white/80 dark:border-white/10 hover:border-orange-400/50'
          }`}
          title="Toggle Procedural Wireframe Mesh"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Wireframe</span>
        </button>

        {/* Lighting preset */}
        <button
          onClick={() => {
            const nextMode = lightingMode === 'sunlight' ? 'golden' : lightingMode === 'golden' ? 'bioluminescent' : 'sunlight';
            setLightingMode(nextMode);
          }}
          className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-white/80 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-orange-400/50 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          title="Switch Sunlight Spectrum"
        >
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden sm:inline capitalize">{lightingMode}</span>
        </button>

        {/* Free Orbit indicator */}
        {isInteractiveMode && (
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl backdrop-blur-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              autoRotate
                ? 'bg-emerald-600 text-white border-emerald-400'
                : 'bg-white/70 dark:bg-black/40 text-slate-700 dark:text-slate-200 border-white/80 dark:border-white/10'
            }`}
            title="Toggle 360 Turntable Auto-Rotation"
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Turntable</span>
          </button>
        )}
      </div>

      {/* ========================================================= */}
      {/* 4. SCROLL TRACK (5 Sections = 500vh of smooth scroll)    */}
      {/* ========================================================= */}
      <div className="relative z-10 w-full pointer-events-none">
        
        {/* ------------------------------------------------------- */}
        {/* SECTION 1: GENESIS (0vh - 100vh)                       */}
        {/* ------------------------------------------------------- */}
        <section className="min-h-screen w-full flex flex-col justify-center px-4 sm:px-12 lg:px-24 max-w-6xl mx-auto pointer-events-none">
          <div className="max-w-xl pointer-events-auto p-5 sm:p-8 rounded-3xl bg-white/50 dark:bg-black/35 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-2xl relative overflow-hidden animate-page-enter">
            {/* Top hairline reflection */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white dark:via-white/20 to-transparent" />

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono font-black mb-3">
              <Sprout className="w-3.5 h-3.5 text-emerald-600" />
              <span>PHASE 01 // SEED GENESIS</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08] mb-2">
              From Spore to <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500 bg-clip-text text-transparent">
                Living Meristem
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5 font-medium">
              Real-time procedural simulation of seed coat imbibition, radicle anchoring into organic humus loam, and cotyledon phototropism.
            </p>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-200/60 dark:border-white/10 mb-5">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Plant Height</span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">1.4 cm</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Soil Loam</span>
                <span className="text-sm font-black text-sky-600 dark:text-sky-400">88% Moist</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Lighting</span>
                <span className="text-sm font-black text-amber-600 dark:text-amber-400">Dawn 4,200K</span>
              </div>
            </div>

            {/* Scroll indicator prompt */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 animate-pulse">
              <ChevronDown className="w-4 h-4 text-orange-500" />
              <span>Scroll down to grow the plant in real-time</span>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- */}
        {/* SECTION 2: CANOPY EXPANSION (100vh - 200vh)            */}
        {/* ------------------------------------------------------- */}
        <section className="min-h-screen w-full flex flex-col justify-center items-end px-4 sm:px-12 lg:px-24 max-w-6xl mx-auto pointer-events-none">
          <div className="max-w-xl pointer-events-auto p-5 sm:p-8 rounded-3xl bg-white/50 dark:bg-black/35 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white dark:via-white/20 to-transparent" />

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-800 dark:text-teal-300 text-[10px] font-mono font-black mb-3">
              <Leaf className="w-3.5 h-3.5 text-teal-600" />
              <span>PHASE 02 // CANOPY EXPANSION</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight mb-2">
              Procedural Stem &amp; Leaf Elongation
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5 font-medium">
              L-system branching algorithms calculate cellular turgor pressure as the central xylem elongates and broad leaves unfurl in 137.5° golden Fibonacci spirals.
            </p>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-200/60 dark:border-white/10">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Stem Height</span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">18.2 cm</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Canopy Spread</span>
                <span className="text-sm font-black text-teal-600 dark:text-teal-400">24.5 cm</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Leaf Area</span>
                <span className="text-sm font-black text-orange-600 dark:text-orange-400">142 cm²</span>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- */}
        {/* SECTION 3: AI OPTICAL LASER SCAN (200vh - 300vh)        */}
        {/* ------------------------------------------------------- */}
        <section className="min-h-screen w-full flex flex-col justify-center px-4 sm:px-12 lg:px-24 max-w-6xl mx-auto pointer-events-none">
          <div className="max-w-xl pointer-events-auto p-5 sm:p-8 rounded-3xl bg-white/50 dark:bg-black/45 backdrop-blur-2xl border border-emerald-400/40 dark:border-emerald-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-[10px] font-mono font-black mb-3">
              <Scan className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>PHASE 03 // COMPUTER VISION SCAN</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight mb-2">
              Optical Microscopic Pathology
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5 font-medium">
              Holographic laser scan sweeps the leaf epidermal plane. Convolutional vision models isolate chlorotic halos, fungal hyphae, and powdery mildew lesions before necrosis spreads.
            </p>

            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  Specimen Clean: 0 Lesions Detected
                </span>
              </div>
              <span className="text-[10px] font-mono font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                98.4% Conf.
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 dark:border-white/10">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Accuracy</span>
                <span className="text-sm font-black text-emerald-500">98.4%</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Pathogen Risk</span>
                <span className="text-sm font-black text-teal-500">0.0%</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Inference</span>
                <span className="text-sm font-black text-orange-500">42 ms</span>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- */}
        {/* SECTION 4: FLOWERING & RIPENING (300vh - 400vh)         */}
        {/* ------------------------------------------------------- */}
        <section className="min-h-screen w-full flex flex-col justify-center items-end px-4 sm:px-12 lg:px-24 max-w-6xl mx-auto pointer-events-none">
          <div className="max-w-xl pointer-events-auto p-5 sm:p-8 rounded-3xl bg-white/50 dark:bg-black/35 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white dark:via-white/20 to-transparent" />

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-800 dark:text-rose-300 text-[10px] font-mono font-black mb-3">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>PHASE 04 // REPRODUCTIVE MATURITY</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight mb-2">
              Budding, Flowering &amp; Fruit Ripening
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5 font-medium">
              Yellow floral blossoms synthesize nutrients, transforming into succulent, high-gloss cherry tomatoes with natural skin translucency and dewdrop physics.
            </p>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-200/60 dark:border-white/10">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Ripe Fruits</span>
                <span className="text-sm font-black text-rose-600 dark:text-rose-400">7 Tomatoes</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Sugar Brix</span>
                <span className="text-sm font-black text-amber-600 dark:text-amber-400">9.2° Brix</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Maturity</span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">Optimal</span>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- */}
        {/* SECTION 5: INTERACTIVE 3D COCKPIT (400vh - 500vh)       */}
        {/* ------------------------------------------------------- */}
        <section className="min-h-screen w-full flex flex-col justify-end pb-24 sm:pb-32 px-4 sm:px-12 lg:px-24 max-w-6xl mx-auto pointer-events-none">
          <div className="w-full pointer-events-auto p-5 sm:p-8 rounded-3xl bg-white/70 dark:bg-black/55 backdrop-blur-2xl border border-white/90 dark:border-white/15 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-800 dark:text-orange-300 text-[10px] font-mono font-black mb-2">
                  <Compass className="w-3.5 h-3.5 text-orange-500" />
                  <span>PHASE 05 // AUTONOMOUS 3D COCKPIT</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  Drag &amp; Rotate in 360° Free Orbit
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                  Use your mouse or touch to rotate, pinch to zoom, and inspect micro-leaf structures. Launch our AI tools below!
                </p>
              </div>

              {/* Action Buttons: Launch Camera / 14-Day Trajectory */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  onClick={onOpenCamera}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-black text-xs sm:text-sm shadow-lg shadow-orange-500/30 flex items-center gap-2 transition-all active:scale-95 cursor-pointer border border-amber-300/40"
                >
                  <Camera className="w-4 h-4 stroke-[2.4]" />
                  <span>Scan Leaf with Camera</span>
                </button>

                <button
                  onClick={onStartApp}
                  className="px-5 py-3 rounded-2xl bg-white/80 dark:bg-white/10 hover:bg-white text-slate-900 dark:text-white font-black text-xs sm:text-sm border border-white/90 dark:border-white/20 shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer backdrop-blur-xl"
                >
                  <span>14-Day Growth Trajectory</span>
                  <ArrowRight className="w-4 h-4 text-orange-500" />
                </button>
              </div>
            </div>

            {/* Quick feature highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-200/60 dark:border-white/10 text-xs">
              <div className="p-2.5 rounded-xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10">
                <span className="font-bold text-slate-900 dark:text-white block">Optical Diagnostics</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">38 disease lesion patterns</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10">
                <span className="font-bold text-slate-900 dark:text-white block">Temporal Regressor</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">14-day cm height curve</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10">
                <span className="font-bold text-slate-900 dark:text-white block">Procedural WebGL</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Three.js dynamic growth</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10">
                <span className="font-bold text-slate-900 dark:text-white block">Closed-Loop Care</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">3 daily actionable boosts</span>
              </div>
            </div>
          </div>
        </section>

      </div>

    </div>
  );
}

export default Scroll3DExperience;
