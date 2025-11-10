// Sistema Solar Interactivo.tsx
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function SistemaSolarInteractivo() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const isRunningRef = useRef(isRunning);
  const [selectedPlanet, setSelectedPlanet] = useState<any | null>(null);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  const loader = new THREE.TextureLoader();

  const planets = [
    { name: "Sol", size: 1.2, distance: 0, color: 0xffff00, speed: 0, realSize: 109, description: "Estrella de tipo G que mantiene unido el sistema solar", texture: null },
    { name: "Mercurio", size: 0.3, distance: 4, color: 0x8c7853, speed: 4.15, realSize: 0.38, description: "Planeta más cercano al Sol, sin atmósfera", texture: loader.load("/textures/mercury.jpg") },
    { name: "Venus", size: 0.6, distance: 6, color: 0xffd700, speed: 1.62, realSize: 0.95, description: "Planeta con atmósfera densa y efecto invernadero extremo", texture: loader.load("/textures/venus.jpg") },
    { name: "Tierra", size: 0.6, distance: 8, color: 0x4a90e2, speed: 1, realSize: 1.0, description: "Único planeta conocido con vida", texture: loader.load("/textures/earth.jpg") },
    { name: "Marte", size: 0.4, distance: 10, color: 0xcd5c5c, speed: 0.53, realSize: 0.53, description: "Planeta rojo con casquetes polares", texture: loader.load("/textures/mars.jpg") },
    { name: "Júpiter", size: 1.0, distance: 14, color: 0xd2691e, speed: 0.084, realSize: 11.2, description: "Gigante gaseoso con la Gran Mancha Roja", texture: loader.load("/textures/jupiter.jpg") },
    { name: "Saturno", size: 0.9, distance: 18, color: 0xf4a460, speed: 0.034, realSize: 9.4, description: "Planeta con el sistema de anillos más espectacular", texture: loader.load("/textures/saturn.jpg") },
    { name: "Urano", size: 0.7, distance: 22, color: 0x87ceeb, speed: 0.012, realSize: 4.0, description: "Planeta que rota sobre su lado", texture: loader.load("/textures/uranus.jpg") },
    { name: "Neptuno", size: 0.7, distance: 26, color: 0x4169e1, speed: 0.006, realSize: 3.9, description: "Planeta más lejano con vientos supersónicos", texture: loader.load("/textures/neptune.jpg") }
  ];

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x000011, 1);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.enableRotate = true;
    controls.minDistance = 5;
    controls.maxDistance = 100;

    scene.add(new THREE.AmbientLight(0x404040, 0.3));
    const sunLight = new THREE.PointLight(0xffffff, 2, 200);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Estrellas
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 800;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 400;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 400;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 400;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    const planetMeshes: THREE.Mesh[] = [];
    const orbitMeshes: THREE.Mesh[] = [];

    planets.forEach((planet: any) => {
      const geometry = new THREE.SphereGeometry(planet.size, 64, 64);
      let material;
      if (planet.name === "Sol") {
        // Sol amarillo brillante
        material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const glowGeometry = new THREE.SphereGeometry(planet.size * 1.3, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({ color: 0xffff33, transparent: true, opacity: 0.2 });
        const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
        glowMesh.position.x = planet.distance;
        scene.add(glowMesh);
      } else {
        material = new THREE.MeshStandardMaterial({
          map: planet.texture,
          color: planet.color,
          roughness: planet.name === "Tierra" ? 0.3 : planet.name === "Marte" ? 0.8 : 0.5,
          metalness: planet.name === "Venus" ? 0.1 : planet.name === "Mercurio" ? 0.2 : 0.0,
          emissive: planet.color,
          emissiveIntensity: 0.1
        });
      }

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = planet.distance;
      mesh.position.z = 0;
      mesh.userData = { planet, angle: 0 };
      scene.add(mesh);
      planetMeshes.push(mesh);

      // Anillos de Saturno
      if (planet.name === "Saturno") {
        const ringGeometry1 = new THREE.RingGeometry(1.3, 1.9, 64);
        const ringMaterial1 = new THREE.MeshBasicMaterial({ color: 0xf4a460, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });
        const ring1 = new THREE.Mesh(ringGeometry1, ringMaterial1);
        ring1.rotation.x = -Math.PI / 2;
        mesh.add(ring1);

        const ringGeometry2 = new THREE.RingGeometry(1.1, 1.25, 32);
        const ringMaterial2 = new THREE.MeshBasicMaterial({ color: 0xdaa520, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
        const ring2 = new THREE.Mesh(ringGeometry2, ringMaterial2);
        ring2.rotation.x = -Math.PI / 2;
        mesh.add(ring2);
      }

      if (planet.distance > 0) {
        const orbitGeometry = new THREE.RingGeometry(planet.distance - 0.02, planet.distance + 0.02, 64);
        const orbitMaterial = new THREE.MeshBasicMaterial({ color: planet.color, side: THREE.DoubleSide, transparent: true, opacity: 0.2 });
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.x = -Math.PI / 2;
        scene.add(orbit);
        orbitMeshes.push(orbit);
      }
    });

    camera.position.set(0, 8, 20);
    camera.lookAt(0, 0, 0);

    const animate = () => {
      requestAnimationFrame(animate);
      if (isRunningRef.current) {
        planetMeshes.forEach(mesh => {
          const planet = mesh.userData.planet;
          if (planet.distance > 0) {
            mesh.userData.angle += planet.speed * 0.004;
            mesh.position.x = Math.cos(mesh.userData.angle) * planet.distance;
            mesh.position.z = Math.sin(mesh.userData.angle) * planet.distance;
          }
          mesh.rotation.y += 0.001;
        });
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const checkPlanet = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(planetMeshes);
      if (intersects.length > 0) {
        setSelectedPlanet(intersects[0].object.userData.planet);
      } else {
        setSelectedPlanet(null);
      }
    };

    renderer.domElement.addEventListener("pointermove", (e) => checkPlanet(e.clientX, e.clientY));
    renderer.domElement.addEventListener("pointerdown", (e) => checkPlanet(e.clientX, e.clientY));

    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
      planetMeshes.forEach(m => { m.geometry.dispose(); if (m.material instanceof THREE.Material) m.material.dispose(); });
      orbitMeshes.forEach(m => { m.geometry.dispose(); if (m.material instanceof THREE.Material) m.material.dispose(); });
    };
  }, []);

  const resetSystem = () => window.location.reload();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-8 text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text">
          Sistema Solar Interactivo
        </h1>

        <div className="flex justify-center gap-6 mb-8">
          <button onClick={() => setIsRunning(!isRunning)}
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl shadow-2xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105">
            {isRunning ? "Pausar Orbitas" : "Iniciar Orbitas"}
          </button>

          <button onClick={resetSystem}
            className="px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-xl shadow-2xl hover:from-rose-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105">
            🔄 Reiniciar Sistema
          </button>
        </div>

        <div ref={mountRef} className="w-full border-4 border-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-2xl bg-black overflow-hidden" style={{ height: "650px" }} />

        {selectedPlanet && (
          <div className="fixed bottom-4 left-4 bg-black/90 text-white p-4 rounded-lg border border-cyan-400 shadow-xl max-w-sm z-10">
            <h3 className="text-xl font-bold text-cyan-400 mb-3">{selectedPlanet.name}</h3>
            <div className="space-y-2 text-sm">
              <div><strong>Masa:</strong> {selectedPlanet.name === "Sol" ? "1.989 × 10³⁰ kg" :
                selectedPlanet.name === "Mercurio" ? "3.301 × 10²³ kg" :
                selectedPlanet.name === "Venus" ? "4.867 × 10²⁴ kg" :
                selectedPlanet.name === "Tierra" ? "5.972 × 10²⁴ kg" :
                selectedPlanet.name === "Marte" ? "6.39 × 10²³ kg" :
                selectedPlanet.name === "Júpiter" ? "1.898 × 10²⁷ kg" :
                selectedPlanet.name === "Saturno" ? "5.683 × 10²⁶ kg" :
                selectedPlanet.name === "Urano" ? "8.681 × 10²⁵ kg" :
                "1.024 × 10²⁶ kg"}</div>
              <div><strong>Temperatura:</strong> {selectedPlanet.name === "Sol" ? "5,778 K" :
                selectedPlanet.name === "Mercurio" ? "167°C/-173°C" :
                selectedPlanet.name === "Venus" ? "462°C" :
                selectedPlanet.name === "Tierra" ? "15°C" :
                selectedPlanet.name === "Marte" ? "-65°C" :
                selectedPlanet.name === "Júpiter" ? "-110°C" :
                selectedPlanet.name === "Saturno" ? "-140°C" :
                selectedPlanet.name === "Urano" ? "-195°C" :
                "-200°C"}</div>
              <div><strong>Período Orbital:</strong> {selectedPlanet.name === "Sol" ? "-" :
                selectedPlanet.name === "Mercurio" ? "88 días" :
                selectedPlanet.name === "Venus" ? "225 días" :
                selectedPlanet.name === "Tierra" ? "365.25 días" :
                selectedPlanet.name === "Marte" ? "687 días" :
                selectedPlanet.name === "Júpiter" ? "4,333 días" :
                selectedPlanet.name === "Saturno" ? "10,759 días" :
                selectedPlanet.name === "Urano" ? "30,687 días" :
                "60,190 días"}</div>
              <div><strong>Composición:</strong> {selectedPlanet.name === "Sol" ? "74% H, 24% He" :
                selectedPlanet.name === "Mercurio" ? "70% Metales" :
                selectedPlanet.name === "Venus" ? "96% CO₂" :
                selectedPlanet.name === "Tierra" ? "71% Agua" :
                selectedPlanet.name === "Marte" ? "95% CO₂" :
                selectedPlanet.name === "Júpiter" ? "89% H, 10% He" :
                selectedPlanet.name === "Saturno" ? "96% H, 3% He" :
                selectedPlanet.name === "Urano" ? "83% H, 15% He" :
                "80% H, 19% He"}</div>
            </div>
          </div>
        )}

        <div className="text-center mt-8 text-slate-400">
          <p className="text-xl mb-3">🎮 Controles Interactivos</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-slate-800/50 rounded-lg p-3">
              <span className="text-cyan-400">🖱️</span> Arrastrar = Rotar vista
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <span className="text-cyan-400">🔍</span> Rueda = Zoom in/out
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <span className="text-cyan-400">📦</span> Shift + arrastrar = Desplazar
            </div>
          </div>
          <p className="text-lg mt-4 text-slate-300">
            Pasa el cursor sobre los planetas para ver datos astronómicos • Haz clic para información detallada
          </p>
        </div>
      </div>
    </div>
  );
}
