import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type IndustrialSceneProps = { mode?: "hero" | "story"; className?: string };

// Procedural fallback materials
const steel = new THREE.MeshStandardMaterial({ color: 0x929089, metalness: 0.88, roughness: 0.3 });
const edgeSteel = new THREE.MeshStandardMaterial({ color: 0xc5bdb0, metalness: 0.92, roughness: 0.24 });
const accentBlue = new THREE.MeshStandardMaterial({ color: 0x1f5ba3, metalness: 0.82, roughness: 0.3 });
const warning = new THREE.MeshStandardMaterial({ color: 0xe8a020, metalness: 0.55, roughness: 0.35 });

export function IndustrialScene({ mode = "hero", className = "" }: IndustrialSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const host = canvas.parentElement;
    if (!host) return;
    let webglAvailable = false;
    try {
      const contextOptions = { failIfMajorPerformanceCaveat: true };
      webglAvailable = Boolean(canvas.getContext("webgl2", contextOptions) || canvas.getContext("webgl", contextOptions));
    } catch {
      webglAvailable = false;
    }
    if (!webglAvailable) {
      return mountFallbackScene(canvas, host, mode);
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return;
    }
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
    camera.position.set(mode === "hero" ? 5.2 : 5.0, 2.4, 6.8);
    camera.lookAt(0, 0, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    const ambient = new THREE.HemisphereLight(0xd7d0c3, 0x181816, 1.35);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xffead7, 3.4);
    key.position.set(-4, 6, 7);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x4e88c7, 2.1);
    rim.position.set(5, 1, -4);
    scene.add(rim);

    const group = new THREE.Group();
    group.rotation.order = "YXZ";
    // Set initial orientation (standing straight on the ground, level X and Z)
    if (mode === "hero") {
      group.rotation.set(0, -0.42, 0);
    } else {
      group.rotation.set(0, -0.35, 0);
    }
    scene.add(group);
    sceneGroupRef.current = group;
    const modelRoot = new THREE.Group();
    modelRoot.name = "Imported tank model";
    group.add(modelRoot);
    let modelReady = false;

    // Setup local Draco decoder for compressed model
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      "/models/tank.glb",
      (gltf) => {
        gltf.scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            // Keep the model's baked steel-gray material, just ensure shadows
            object.castShadow = true;
            object.receiveShadow = true;
            // If material exists, tweak to match scene lighting
            if (object.material instanceof THREE.MeshStandardMaterial) {
              object.material.envMapIntensity = 0.6;
              object.material.needsUpdate = true;
            }
          }
        });
        modelRoot.add(gltf.scene);
        dracoLoader.dispose();
        modelReady = true;
      },
      undefined,
      (err) => {
        console.error("Error loading GLTF model:", err);
        // Fallback if model fails
        buildSeparator(modelRoot);
        dracoLoader.dispose();
        modelReady = true;
      }
    );

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const storyElement = host.closest(".story") || host;
    const scrollTimeline = gsap.timeline({
      defaults: { ease: "power1.out" },
      paused: reduceMotion,
      scrollTrigger: {
        trigger: mode === "story" ? storyElement : host,
        start: mode === "story" ? "top bottom" : "top top",
        end: mode === "story" ? "bottom top" : "bottom top",
        scrub: reduceMotion ? false : 1.8,
        invalidateOnRefresh: true,
      },
    });

    if (mode === "hero") {
      scrollTimeline
        .to(camera.position, { x: 4.4, y: 2.2, z: 6.2, duration: 1 }, 0)
        .to(group.rotation, { x: 0, y: -0.1, z: 0, duration: 1 }, 0)
        .to(group.position, { x: -0.12, y: 0.05, duration: 1 }, 0)
        .to(group.scale, { x: 1.05, y: 1.05, z: 1.05, duration: 1 }, 0);
    } else {
      // Story mode: model stays level and upright throughout sticky section scroll
      scrollTimeline
        .to(camera.position, { x: 4.5, y: 1.8, z: 5.8, duration: 1 }, 0)
        .to(group.rotation, { x: 0, y: -0.05, z: 0, duration: 1 }, 0)
        .to(group.position, { x: 0, y: 0, duration: 1 }, 0)
        .to(group.scale, { x: 1.1, y: 1.1, z: 1.1, duration: 1 }, 0);
    }

    let frame = 0;
    let active = true;
    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const width = Math.max(1, bounds.width);
      const height = Math.max(1, bounds.height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const render = () => {
      if (!active) return;
      if (!reduceMotion && sceneGroupRef.current && !scrollTimeline.scrollTrigger?.isActive) {
        sceneGroupRef.current.rotation.y += 0.00025;
      }
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();
    render();
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      scrollTimeline.scrollTrigger?.kill();
      scrollTimeline.kill();
      group.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
      if (!modelReady) modelRoot.clear();
      sceneGroupRef.current = null;
    };
  }, [mode]);

  return <canvas ref={canvasRef} className={`scene-canvas ${className}`} aria-label="Трёхмерная модель промышленного сепаратора" data-testid={`canvas-industrial-scene-${mode}`} />;
}

function mountFallbackScene(canvas: HTMLCanvasElement, host: HTMLElement, mode: "hero" | "story") {
  const context = canvas.getContext("2d");
  if (!context) return;
  const draw = () => {
    const bounds = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 1.7);
    const width = Math.max(1, bounds.width);
    const height = Math.max(1, bounds.height);
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    context.strokeStyle = mode === "story" ? "rgba(66,59,51,.18)" : "rgba(196,185,168,.12)";
    context.lineWidth = 1;
    for (let x = 35; x < width; x += 45) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }
    const scale = Math.min(width, height) / 470;
    const centerX = width * (mode === "story" ? .58 : .54);
    const centerY = height * .54;
    context.save();
    context.translate(centerX, centerY);
    context.rotate(mode === "story" ? -.02 : 0);
    context.scale(scale, scale);
    const metal = context.createLinearGradient(-155, -70, 160, 70);
    metal.addColorStop(0, "#252525");
    metal.addColorStop(.28, "#aaa79f");
    metal.addColorStop(.52, "#545551");
    metal.addColorStop(.74, "#c7c1b5");
    metal.addColorStop(1, "#292a28");
    const left = -82;
    const top = -145;
    context.fillStyle = metal;
    context.strokeStyle = "#232421";
    context.lineWidth = 2;
    context.beginPath();
    context.roundRect(left, top, 164, 290, 32);
    context.fill();
    context.stroke();
    context.fillStyle = "#1f5ba3";
    context.fillRect(-17, top - 25, 34, 15);
    context.strokeRect(-17, top - 25, 34, 15);
    context.strokeStyle = "#d1cabf";
    context.lineWidth = 1;
    [-92, 0, 92].forEach((seamY) => {
      context.beginPath();
      context.ellipse(0, seamY, 82, 7, 0, 0, Math.PI * 2);
      context.stroke();
    });
    context.strokeStyle = "#1f5ba3";
    context.beginPath();
    context.arc(0, 0, 112, 0, Math.PI * 2);
    context.stroke();
    context.restore();
  };
  const observer = new ResizeObserver(draw);
  observer.observe(host);
  draw();
  return () => observer.disconnect();
}

function buildSeparator(group: THREE.Group) {
  const bodyLength = 3.8;
  const bodyRadius = 0.88;
  const body = new THREE.Mesh(new THREE.CylinderGeometry(bodyRadius, bodyRadius, bodyLength, 24, 1, false), steel);
  group.add(body);

  const domeGeometry = new THREE.SphereGeometry(bodyRadius, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2);
  const topDome = new THREE.Mesh(domeGeometry, steel);
  topDome.position.y = bodyLength / 2;
  group.add(topDome);
  const bottomDome = new THREE.Mesh(domeGeometry.clone(), steel);
  bottomDome.rotation.x = Math.PI;
  bottomDome.position.y = -bodyLength / 2;
  group.add(bottomDome);

  [-1.9, -0.95, 0, 0.95, 1.9].forEach((y) => addSeam(group, y, bodyRadius));
  addNozzle(group, 0, bodyRadius, 0.42, 0.22, accentBlue);
  addNozzle(group, 0.9, -bodyRadius, 0.28, 0.18, edgeSteel);
  addNozzle(group, 1.45, 0.16, 0.45, 0.18, edgeSteel, true);

  const topGauge = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.08, 12), warning);
  topGauge.position.set(0, bodyRadius + 0.46, 0);
  group.add(topGauge);
}

function addSeam(group: THREE.Group, y: number, radius: number) {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(radius + 0.012, 0.027, 6, 16), edgeSteel);
  ring.position.y = y;
  group.add(ring);
}

function addNozzle(group: THREE.Group, x: number, y: number, height: number, radius: number, material: THREE.Material, side = false) {
  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 12), material);
  if (side) pipe.rotation.z = Math.PI / 2;
  pipe.position.set(x, y + (side ? 0 : Math.sign(y) * height / 2), side ? 0 : 0);
  group.add(pipe);
  const flange = new THREE.Mesh(new THREE.TorusGeometry(radius * 1.35, 0.065, 6, 12), material);
  if (side) flange.rotation.y = Math.PI / 2;
  flange.position.copy(pipe.position);
  flange.position.y += side ? 0 : Math.sign(y) * height / 2;
  flange.position.x += side ? Math.sign(x - 1.75) * height / 2 : 0;
  group.add(flange);
}
