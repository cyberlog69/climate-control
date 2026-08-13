import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { CLIMATE_HOTSPOTS } from "../services/climateData";
import { GLOBAL_WILDFIRE_HOTSPOTS } from "../services/wildfireSatelliteApi";
import { Play, Pause, RotateCcw, ZoomIn, ZoomOut, Compass, Sparkles, MapPin, Flame } from "lucide-react";

// Convert Latitude/Longitude to 3D Cartesian Coordinates on Sphere of radius R
export function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Convert 3D Cartesian Coordinate on Sphere of radius R to Latitude/Longitude
export function vector3ToLatLon(vector, radius) {
  const norm = vector.clone().normalize();
  const lat = Math.asin(Math.max(-1, Math.min(1, norm.y))) * (180 / Math.PI);
  let lon = (Math.atan2(norm.z, -norm.x) * (180 / Math.PI)) - 180;
  while (lon < -180) lon += 360;
  while (lon > 180) lon -= 360;
  return { lat, lon };
}

// Procedural High-Res Earth Texture Generator (Canvas-based)
function createEarthCanvasTexture(theme = "dark") {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  const isDark = theme === "dark";
  const oceanColor = isDark ? "#061325" : "#0d2b45";
  const landBase = isDark ? "#112e2e" : "#1a4d4d";
  const landHighlight = isDark ? "#10b981" : "#22c55e";
  const gridColor = isDark ? "rgba(6, 182, 212, 0.12)" : "rgba(6, 182, 212, 0.22)";

  // Ocean base gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
  oceanGrad.addColorStop(0, isDark ? "#081d38" : "#10395c");
  oceanGrad.addColorStop(0.5, oceanColor);
  oceanGrad.addColorStop(1, isDark ? "#081d38" : "#10395c");
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, width, height);

  // Draw simplified world continents layout onto canvas
  const drawContinent = (pathData, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    const p = new Path2D(pathData);
    ctx.fill(p);
  };

  // Approximate major continent shapes
  // Eurasia / Africa / Americas / Australia / Antarctica
  ctx.fillStyle = landBase;

  // North America
  ctx.beginPath();
  ctx.ellipse(width * 0.22, height * 0.32, width * 0.12, height * 0.16, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // South America
  ctx.beginPath();
  ctx.ellipse(width * 0.32, height * 0.68, width * 0.07, height * 0.18, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Europe & Asia (Eurasia)
  ctx.beginPath();
  ctx.ellipse(width * 0.62, height * 0.32, width * 0.22, height * 0.18, 0.05, 0, Math.PI * 2);
  ctx.fill();

  // Africa
  ctx.beginPath();
  ctx.ellipse(width * 0.53, height * 0.56, width * 0.09, height * 0.2, -0.05, 0, Math.PI * 2);
  ctx.fill();

  // Australia
  ctx.beginPath();
  ctx.ellipse(width * 0.82, height * 0.72, width * 0.065, height * 0.085, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Greenland / Arctic
  ctx.beginPath();
  ctx.ellipse(width * 0.38, height * 0.15, width * 0.05, height * 0.06, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Antarctica
  ctx.beginPath();
  ctx.rect(0, height * 0.88, width, height * 0.12);
  ctx.fill();

  // Add terrain noise & details
  ctx.fillStyle = landHighlight;
  for (let i = 0; i < 350; i++) {
    const rx = (Math.sin(i * 99) * 0.5 + 0.5) * width;
    const ry = (Math.cos(i * 33) * 0.5 + 0.5) * height;
    const radius = 8 + (i % 22);
    ctx.beginPath();
    ctx.arc(rx, ry, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw Latitude & Longitude Grids
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;

  // Latitudes (horizontal)
  for (let lat = -80; lat <= 80; lat += 20) {
    const y = ((90 - lat) / 180) * height;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Longitudes (vertical)
  for (let lon = -180; lon <= 180; lon += 30) {
    const x = ((lon + 180) / 360) * width;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Equator highlight
  ctx.strokeStyle = isDark ? "rgba(6, 182, 212, 0.4)" : "rgba(6, 182, 212, 0.6)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, height * 0.5);
  ctx.lineTo(width, height * 0.5);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// Procedural Atmospheric Cloud Texture
function createCloudTexture() {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(255, 255, 255, 0.35)";

  // Draw procedural wispy cloud bands
  for (let i = 0; i < 90; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const r = 25 + Math.random() * 60;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, "rgba(255, 255, 255, 0.45)");
    grad.addColorStop(0.5, "rgba(240, 248, 255, 0.18)");
    grad.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export default function EarthGlobe3D({
  currentLocation,
  onSelectLocation,
  weatherData,
  theme = "dark"
}) {
  const mountRef = useRef(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [hoveredHotspot, setHoveredHotspot] = useState(null);
  const [coordsTooltip, setCoordsTooltip] = useState(null);

  // References for Three.js animation and event listeners
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const globeGroupRef = useRef(null);
  const cloudMeshRef = useRef(null);
  const markersGroupRef = useRef(null);
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const animFrameIdRef = useRef(null);

  const GLOBE_RADIUS = 2.5;

  // Navigate globe camera to a specific lat/lon smoothly
  const flyTo = useCallback((lat, lon) => {
    if (!globeGroupRef.current) return;
    const phi = (lat * Math.PI) / 180;
    const theta = ((lon + 90) * Math.PI) / 180;

    targetRotationRef.current = {
      x: phi,
      y: -theta
    };
  }, []);

  // Update target rotation when currentLocation changes
  useEffect(() => {
    if (currentLocation?.lat != null && currentLocation?.lon != null) {
      flyTo(currentLocation.lat, currentLocation.lon);
    }
  }, [currentLocation, flyTo]);

  // Main Three.js Scene Setup & Render Loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 400;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 6.8;
    cameraRef.current = camera;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 3. Globe Container Group (for unified rotation)
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    // 4. Earth Sphere Mesh
    const earthGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const earthTexture = createEarthCanvasTexture(theme);
    const earthMat = new THREE.MeshPhongMaterial({
      map: earthTexture,
      shininess: 25,
      specular: new THREE.Color(0x06b6d4),
      emissive: theme === "dark" ? new THREE.Color(0x021020) : new THREE.Color(0x052035)
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthMesh.name = "earthSphere";
    globeGroup.add(earthMesh);

    // 5. Cloud Layer Sphere Mesh
    const cloudGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.018, 48, 48);
    const cloudTexture = createCloudTexture();
    const cloudMat = new THREE.MeshPhongMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.45,
      blending: THREE.NormalBlending,
      depthWrite: false
    });
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    globeGroup.add(cloudMesh);
    cloudMeshRef.current = cloudMesh;

    // 6. Glowing Outer Atmosphere Shader
    const atmosphereGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.12, 32, 32);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.2);
          gl_FragColor = vec4(0.023, 0.713, 0.831, 1.0) * intensity * 1.4;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    scene.add(atmosphereMesh);

    // 7. Starfield Particles in background
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 650;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 80;
      starPositions[i + 1] = (Math.random() - 0.5) * 80;
      starPositions[i + 2] = -15 - Math.random() * 40;
    }
    starsGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starsMat = new THREE.PointsMaterial({
      color: 0x94a3b8,
      size: 0.35,
      transparent: true,
      opacity: 0.75
    });
    const starPoints = new THREE.Points(starsGeo, starsMat);
    scene.add(starPoints);

    // 8. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, theme === "dark" ? 0.7 : 1.0);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight(0x06b6d4, 0.8);
    dirLight2.position.set(-5, -2, -3);
    scene.add(dirLight2);

    // 9. Markers Container Group
    const markersGroup = new THREE.Group();
    globeGroup.add(markersGroup);
    markersGroupRef.current = markersGroup;

    // Initial position flight if currentLocation exists
    if (currentLocation?.lat != null && currentLocation?.lon != null) {
      const phi = (currentLocation.lat * Math.PI) / 180;
      const theta = ((currentLocation.lon + 90) * Math.PI) / 180;
      globeGroup.rotation.x = phi;
      globeGroup.rotation.y = -theta;
      targetRotationRef.current = { x: phi, y: -theta };
    }

    // 10. Animation Render Loop
    let lastTime = performance.now();
    const animate = (time) => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // Slow cloud rotation
      if (cloudMeshRef.current) {
        cloudMeshRef.current.rotation.y += 0.0008;
      }

      // Smooth camera interpolation towards target rotation when not dragging
      if (!isDraggingRef.current) {
        globeGroup.rotation.x += (targetRotationRef.current.x - globeGroup.rotation.x) * 0.06;
        globeGroup.rotation.y += (targetRotationRef.current.y - globeGroup.rotation.y) * 0.06;

        // Auto-rotation idle drift
        if (autoRotate) {
          targetRotationRef.current.y -= 0.0018;
        }
      }

      // Animate marker pulses
      markersGroup.children.forEach((child) => {
        if (child.userData?.isPulse) {
          const scale = 1 + Math.sin(time * 0.004 + child.userData.offset) * 0.25;
          child.scale.set(scale, scale, scale);
        }
      });

      renderer.render(scene, camera);
    };
    animFrameIdRef.current = requestAnimationFrame(animate);

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      renderer.dispose();
      container.innerHTML = "";
    };
  }, [theme]); // Re-init on theme switch

  // Update Hotspot and Active Location 3D Markers
  useEffect(() => {
    const markersGroup = markersGroupRef.current;
    if (!markersGroup) return;

    // Clear previous markers
    while (markersGroup.children.length > 0) {
      const obj = markersGroup.children[0];
      markersGroup.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    }

    // 1. Add Current Selected Location Marker
    if (currentLocation?.lat != null && currentLocation?.lon != null) {
      const pos = latLonToVector3(currentLocation.lat, currentLocation.lon, GLOBE_RADIUS * 1.01);

      // Main Marker Pin
      const pinGeo = new THREE.CylinderGeometry(0.04, 0.01, 0.22, 12);
      pinGeo.rotateX(Math.PI / 2);
      const pinMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos);
      pinMesh.lookAt(pos.clone().multiplyScalar(2));
      markersGroup.add(pinMesh);

      // Pulse Ring
      const ringGeo = new THREE.RingGeometry(0.06, 0.1, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos.clone().multiplyScalar(1.002));
      ringMesh.lookAt(pos.clone().multiplyScalar(2));
      ringMesh.userData = { isPulse: true, offset: 0 };
      markersGroup.add(ringMesh);
    }

    // 2. Add Climate Hotspots Markers
    CLIMATE_HOTSPOTS.forEach((hotspot, idx) => {
      const pos = latLonToVector3(hotspot.lat, hotspot.lon, GLOBE_RADIUS * 1.008);

      const sphereGeo = new THREE.SphereGeometry(0.055, 12, 12);
      const sphereMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
      const hotspotMesh = new THREE.Mesh(sphereGeo, sphereMat);
      hotspotMesh.position.copy(pos);
      hotspotMesh.userData = { isHotspot: true, hotspotData: hotspot };
      markersGroup.add(hotspotMesh);

      // Amber pulse ring
      const ringGeo = new THREE.RingGeometry(0.06, 0.09, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos.clone().multiplyScalar(1.001));
      ringMesh.lookAt(pos.clone().multiplyScalar(2));
      ringMesh.userData = { isPulse: true, offset: idx * 1.2 };
      markersGroup.add(ringMesh);
    });

    // 3. Add NASA Active Wildfire Thermal Anomaly 3D Markers
    GLOBAL_WILDFIRE_HOTSPOTS.forEach((fire, idx) => {
      const pos = latLonToVector3(fire.lat, fire.lon, GLOBE_RADIUS * 1.012);

      // Red/Orange fire cone
      const coneGeo = new THREE.ConeGeometry(0.045, 0.16, 8);
      coneGeo.rotateX(Math.PI / 2);
      const coneMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const coneMesh = new THREE.Mesh(coneGeo, coneMat);
      coneMesh.position.copy(pos);
      coneMesh.lookAt(pos.clone().multiplyScalar(2));
      coneMesh.userData = { isWildfire: true, fireData: fire };
      markersGroup.add(coneMesh);

      // Expanding thermal shockwave ring
      const fireRingGeo = new THREE.RingGeometry(0.07, 0.12, 16);
      const fireRingMat = new THREE.MeshBasicMaterial({
        color: 0xef4444,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const fireRingMesh = new THREE.Mesh(fireRingGeo, fireRingMat);
      fireRingMesh.position.copy(pos.clone().multiplyScalar(1.002));
      fireRingMesh.lookAt(pos.clone().multiplyScalar(2));
      fireRingMesh.userData = { isPulse: true, offset: idx * 0.9 + 2 };
      markersGroup.add(fireRingMesh);
    });
  }, [currentLocation]);

  // Mouse & Touch Orbit Controls & Click Raycasting
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = {
      x: e.clientX || (e.touches && e.touches[0].clientX) || 0,
      y: e.clientY || (e.touches && e.touches[0].clientY) || 0
    };
  };

  const handlePointerMove = (e) => {
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

    if (isDraggingRef.current && globeGroupRef.current) {
      const deltaX = clientX - previousMousePositionRef.current.x;
      const deltaY = clientY - previousMousePositionRef.current.y;

      targetRotationRef.current.y += deltaX * 0.005;
      targetRotationRef.current.x += deltaY * 0.005;

      // Clamp vertical pitch to prevent flipping upside down
      targetRotationRef.current.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, targetRotationRef.current.x));

      previousMousePositionRef.current = { x: clientX, y: clientY };
    }

    // Raycast hover coordinates for desktop
    if (!isDraggingRef.current && mountRef.current && cameraRef.current && globeGroupRef.current) {
      const rect = mountRef.current.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);
      const earthMesh = globeGroupRef.current.getObjectByName("earthSphere");

      if (earthMesh) {
        const intersects = raycaster.intersectObject(earthMesh);
        if (intersects.length > 0) {
          const hitPoint = intersects[0].point;
          // Invert globeGroup rotation to get coordinate on local sphere
          const localPoint = hitPoint.clone().applyEuler(
            new THREE.Euler(-globeGroupRef.current.rotation.x, -globeGroupRef.current.rotation.y, 0, "YXZ")
          );
          const coords = vector3ToLatLon(localPoint, GLOBE_RADIUS);
          setCoordsTooltip({
            lat: coords.lat.toFixed(2),
            lon: coords.lon.toFixed(2),
            x: clientX - rect.left,
            y: clientY - rect.top
          });
        } else {
          setCoordsTooltip(null);
        }
      }
    }
  };

  const handlePointerUp = (e) => {
    isDraggingRef.current = false;
  };

  // Click Raycaster: Click anywhere on 3D Globe to select location or hotspot
  const handleClick = (e) => {
    if (!mountRef.current || !cameraRef.current || !globeGroupRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    // 1. Check if clicked a hotspot marker or wildfire first
    if (markersGroupRef.current) {
      const markerHits = raycaster.intersectObjects(markersGroupRef.current.children, true);
      const wildfireHit = markerHits.find((h) => h.object.userData?.isWildfire);
      if (wildfireHit) {
        const fData = wildfireHit.object.userData.fireData;
        onSelectLocation({
          name: fData.name,
          cityName: fData.name.split(",")[0],
          lat: fData.lat,
          lon: fData.lon
        });
        flyTo(fData.lat, fData.lon);
        return;
      }

      const hotspotHit = markerHits.find((h) => h.object.userData?.isHotspot);
      if (hotspotHit) {
        const hData = hotspotHit.object.userData.hotspotData;
        onSelectLocation({
          name: hData.name,
          cityName: hData.name.split(",")[0],
          lat: hData.lat,
          lon: hData.lon
        });
        flyTo(hData.lat, hData.lon);
        return;
      }
    }

    // 2. Check if clicked Earth sphere
    const earthMesh = globeGroupRef.current.getObjectByName("earthSphere");
    if (earthMesh) {
      const intersects = raycaster.intersectObject(earthMesh);
      if (intersects.length > 0) {
        const hitPoint = intersects[0].point;
        const localPoint = hitPoint.clone().applyEuler(
          new THREE.Euler(-globeGroupRef.current.rotation.x, -globeGroupRef.current.rotation.y, 0, "YXZ")
        );
        const { lat, lon } = vector3ToLatLon(localPoint, GLOBE_RADIUS);
        onSelectLocation({
          name: `Lat: ${lat.toFixed(2)}°, Lon: ${lon.toFixed(2)}°`,
          cityName: "Custom Coordinates",
          lat: parseFloat(lat.toFixed(4)),
          lon: parseFloat(lon.toFixed(4))
        });
        flyTo(lat, lon);
      }
    }
  };

  // Zoom In / Zoom Out Controls
  const handleZoom = (delta) => {
    if (!cameraRef.current) return;
    cameraRef.current.position.z = Math.max(4.2, Math.min(10.5, cameraRef.current.position.z + delta));
  };

  // Reset to Current Location View
  const handleResetView = () => {
    if (currentLocation?.lat != null && currentLocation?.lon != null) {
      flyTo(currentLocation.lat, currentLocation.lon);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "360px",
        borderRadius: "16px",
        overflow: "hidden",
        background: theme === "dark" ? "radial-gradient(circle at 50% 50%, #081a2e 0%, #030811 100%)" : "radial-gradient(circle at 50% 50%, #0f2b48 0%, #04101e 100%)",
        cursor: "grab",
        userSelect: "none"
      }}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
      onClick={handleClick}
      onWheel={(e) => handleZoom(e.deltaY * 0.003)}
    >
      {/* Three.js Canvas Container */}
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />

      {/* Floating 3D Globe Control Toolbar */}
      <div
        style={{
          position: "absolute",
          top: "0.85rem",
          right: "0.85rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.4rem",
          zIndex: 10
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className="globe-ctrl-btn"
          title={autoRotate ? "Pause Auto-Rotation" : "Start Auto-Rotation"}
          style={{
            background: autoRotate ? "rgba(6, 182, 212, 0.25)" : "var(--bg-card)",
            borderColor: autoRotate ? "var(--accent-cyan)" : "var(--border-light)",
            color: autoRotate ? "var(--accent-cyan)" : "var(--text-main)"
          }}
        >
          {autoRotate ? <Pause size={15} /> : <Play size={15} />}
        </button>

        <button
          onClick={handleResetView}
          className="globe-ctrl-btn"
          title="Reset to Active Location"
        >
          <Compass size={15} />
        </button>

        <button
          onClick={() => handleZoom(-0.8)}
          className="globe-ctrl-btn"
          title="Zoom In"
        >
          <ZoomIn size={15} />
        </button>

        <button
          onClick={() => handleZoom(0.8)}
          className="globe-ctrl-btn"
          title="Zoom Out"
        >
          <ZoomOut size={15} />
        </button>
      </div>

      {/* Active Location 3D Label Overlay */}
      {currentLocation && (
        <div
          style={{
            position: "absolute",
            top: "0.85rem",
            left: "0.85rem",
            background: "rgba(15, 23, 42, 0.82)",
            backdropFilter: "blur(12px)",
            padding: "0.5rem 0.85rem",
            borderRadius: "14px",
            border: "1px solid var(--accent-cyan)",
            zIndex: 10,
            pointerEvents: "none"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span className="pulse-dot" style={{ background: "var(--accent-cyan)" }} />
            <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#fff" }}>
              {currentLocation.name}
            </span>
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--accent-cyan)", fontFamily: "monospace", marginTop: "0.15rem" }}>
            {currentLocation.lat.toFixed(2)}°, {currentLocation.lon.toFixed(2)}°
            {weatherData?.current?.temp != null && (
              <span style={{ marginLeft: "0.5rem", color: "#fff", fontWeight: 600 }}>
                • {weatherData.current.temp}°C
              </span>
            )}
          </div>
        </div>
      )}

      {/* Real-time Coordinate Raycast Inspector Tooltip */}
      {coordsTooltip && (
        <div
          style={{
            position: "absolute",
            left: Math.min(coordsTooltip.x + 12, (mountRef.current?.clientWidth || 300) - 130),
            top: Math.max(coordsTooltip.y - 30, 10),
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(8px)",
            padding: "0.25rem 0.6rem",
            borderRadius: "8px",
            border: "1px solid rgba(6, 182, 212, 0.4)",
            color: "var(--accent-cyan)",
            fontSize: "0.72rem",
            fontFamily: "monospace",
            pointerEvents: "none",
            zIndex: 20
          }}
        >
          {coordsTooltip.lat}°, {coordsTooltip.lon}°
        </div>
      )}

      {/* Bottom Hint Banner */}
      <div
        style={{
          position: "absolute",
          bottom: "0.85rem",
          left: "0.85rem",
          zIndex: 10,
          background: "rgba(15, 23, 42, 0.75)",
          backdropFilter: "blur(10px)",
          padding: "0.4rem 0.8rem",
          borderRadius: "12px",
          border: "1px solid var(--border-light)",
          fontSize: "0.75rem",
          color: "var(--text-muted)",
          pointerEvents: "none"
        }}
      >
        🌐 Drag to rotate • Scroll to zoom • Click anywhere on Earth to inspect
      </div>
    </div>
  );
}
