import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type IndustrialSceneProps = { mode?: "hero" | "story"; className?: string };

// MacBook Silver — bright Apple aluminium body (~80%)
const steel = new THREE.MeshStandardMaterial({ color: 0xe2e4e8, metalness: 0.85, roughness: 0.15, envMapIntensity: 1.6 });
const edgeSteel = new THREE.MeshStandardMaterial({ color: 0xd4d8dc, metalness: 0.85, roughness: 0.14, envMapIntensity: 1.6 });
// Brand Accent Blue — electric KZMK logo blue (~20% details: pipes, railings, flanges, valves)
const accentBlue = new THREE.MeshStandardMaterial({
  color: 0x1d69d8,
  metalness: 0.65,
  roughness: 0.20,
  emissive: 0x082454,
  emissiveIntensity: 0.35,
  envMapIntensity: 1.8,
});
const warning = new THREE.MeshStandardMaterial({ color: 0x1d69d8, metalness: 0.70, roughness: 0.18, envMapIntensity: 1.6 });

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
    const camera = new THREE.PerspectiveCamera(20, 1, 0.1, 100);
    // Camera tuned: model centered in right column, fully visible
    camera.position.set(mode === "hero" ? 6.5 : 5.8, 3.5, mode === "hero" ? 9.0 : 7.2);
    camera.lookAt(0, 0.5, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.45;

    // Generate procedural studio environment map for bright silver metal reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnvironment = new RoomEnvironment();
    const envTexture = pmremGenerator.fromScene(roomEnvironment).texture;
    scene.environment = envTexture;
    roomEnvironment.dispose();
    pmremGenerator.dispose();

    // Neutral bright ambient light
    const ambient = new THREE.HemisphereLight(0xffffff, 0x444444, 1.8);
    scene.add(ambient);
    // Bright key light from top-left
    const key = new THREE.DirectionalLight(0xffffff, 4.5);
    key.position.set(-5, 8, 8);
    scene.add(key);
    // Apple cold blue rim light from back-right
    const rim = new THREE.DirectionalLight(0x5a9ee6, 4.8);
    rim.position.set(6, 3, -5);
    scene.add(rim);
    // Front fill light to illuminate dark metal pockets
    const fillFront = new THREE.DirectionalLight(0xffffff, 2.0);
    fillFront.position.set(0, 2, 8);
    scene.add(fillFront);
    // Subtle bounce from below
    const fillBottom = new THREE.DirectionalLight(0xffffff, 1.2);
    fillBottom.position.set(0, -4, 2);
    scene.add(fillBottom);

    const isMobile = window.innerWidth <= 800;

    const group = new THREE.Group();
    group.rotation.order = "YXZ";
    if (mode === "hero") {
      group.rotation.set(0, -0.42, 0);
      group.position.set(0, 0.5, 0); // lift so base is in frame
    } else {
      group.rotation.set(0, -0.35, 0);
      // On mobile (< 800px), center model in viewport (x = -0.1). On desktop, shift right (x = 1.5)
      group.position.set(isMobile ? -0.1 : 1.5, isMobile ? -0.1 : 0.1, 0);
    }
    scene.add(group);
    sceneGroupRef.current = group;
    group.scale.setScalar(isMobile ? 0.72 : 0.82);

    // Inner group for user drag rotation
    const userDragGroup = new THREE.Group();
    group.add(userDragGroup);

    const modelRoot = new THREE.Group();
    modelRoot.name = "Imported tank model";
    userDragGroup.add(modelRoot);
    let modelReady = false;

    // Manual pointer drag interaction
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let userRotX = 0;
    let userRotY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {}
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      startX = e.clientX;
      startY = e.clientY;

      userRotY += deltaX * 0.007;
      userRotX += deltaY * 0.007;
      userRotX = THREE.MathUtils.clamp(userRotX, -Math.PI / 2.2, Math.PI / 2.2);

      userDragGroup.rotation.y = userRotY;
      userDragGroup.rotation.x = userRotX;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {}
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    // Setup local Draco decoder for compressed model
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      "/models/tank.glb",
      (gltf) => {
        const silver = new THREE.Color(0xe0e2e5); // Bright MacBook Silver
        const brandBlue = new THREE.Color(0x1d69d8); // KZMK Brand Electric Blue

        gltf.scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.castShadow = true;
            object.receiveShadow = true;

            const geometry = object.geometry.clone();
            const pos = geometry.attributes.position;
            if (pos) {
              const colors = new Float32Array(pos.count * 3);

              for (let i = 0; i < pos.count; i++) {
                const x = pos.getX(i);
                const y = pos.getY(i);
                const z = pos.getZ(i);
                const radius = Math.hypot(x, z);

                // ~20% accent blue for outer railings, platform levels, stairs, rings & top nozzles
                const isAccent =
                  (radius > 1.02 && radius < 1.32) || // Middle platform railings & stairs
                  (y > 0.42 && y < 0.58) ||           // Upper structural ring & beam level
                  (y > 1.62) ||                       // Top nozzles & valves
                  (radius > 1.82);                    // Outer pipe racks

                const col = isAccent ? brandBlue : silver;
                colors[i * 3] = col.r;
                colors[i * 3 + 1] = col.g;
                colors[i * 3 + 2] = col.b;
              }

              geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
              object.geometry = geometry;

              object.material = new THREE.MeshStandardMaterial({
                vertexColors: true,
                metalness: 0.82,
                roughness: 0.16,
                envMapIntensity: 1.8,
              });
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
        .to(camera.position, { x: 5.8, y: 3.0, z: 8.2, duration: 1 }, 0)
        .to(group.rotation, { x: 0, y: -0.1, z: 0, duration: 1 }, 0)
        .to(group.position, { x: -0.05, y: 0, duration: 1 }, 0)
        .to(group.scale, { x: 0.85, y: 0.85, z: 0.85, duration: 1 }, 0);
    } else {
      // Story: centered on mobile (x = -0.05), right column on desktop (x = 1.5)
      scrollTimeline
        .to(camera.position, { x: 5.6, y: 3.0, z: 8.0, duration: 1 }, 0)
        .to(group.rotation, { x: 0, y: -0.05, z: 0, duration: 1 }, 0)
        .to(group.position, { x: isMobile ? -0.05 : 1.5, y: isMobile ? -0.1 : 0.1, duration: 1 }, 0)
        .to(group.scale, { x: isMobile ? 0.72 : 0.80, y: isMobile ? 0.72 : 0.80, z: isMobile ? 0.72 : 0.80, duration: 1 }, 0);
    }

    let frame = 0;
    let active = true;
    let lastWidth = 0;
    let lastHeight = 0;
    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const width = Math.max(1, bounds.width);
      const height = Math.max(1, bounds.height);
      // Avoid canvas buffer clearing on minor mobile address bar height shifts
      if (lastWidth > 0 && Math.abs(width - lastWidth) < 2 && Math.abs(height - lastHeight) < 60) return;
      lastWidth = width;
      lastHeight = height;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const render = () => {
      if (!active) return;
      if (!reduceMotion && sceneGroupRef.current && !scrollTimeline.scrollTrigger?.isActive) {
        sceneGroupRef.current.rotation.y += 0.00025;
      }
      // Smoothly return user drag rotation to 0 so default scroll animation seamlessly resumes
      if (!isDragging) {
        userRotX += (0 - userRotX) * 0.045;
        userRotY += (0 - userRotY) * 0.045;
        userDragGroup.rotation.x = userRotX;
        userDragGroup.rotation.y = userRotY;
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
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
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

  return <canvas ref={canvasRef} className={`scene-canvas ${className}`} aria-label="Трёхмерная модель промышленной металлоконструкции" data-testid={`canvas-industrial-scene-${mode}`} />;
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
