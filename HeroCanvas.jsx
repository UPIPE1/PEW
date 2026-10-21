"use client";
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Custom GLSL Cybernetic Neon Shader Material
const CyberShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec2 uMouse;
    varying vec2 vUv;

    void main() {
      vec2 st = gl_FragCoord.xy / uResolution.xy;
      vec3 color = vec3(0.02, 0.05, 0.12); // Obsidian base
      
      // Dynamic neon plasma waves
      float wave = sin(st.x * 10.0 + uTime * 2.0) * cos(st.y * 10.0 + uTime * 1.5);
      vec3 neonCyan = vec3(0.08, 0.72, 0.83);
      vec3 deepBlue = vec3(0.14, 0.39, 0.92);

      float dist = distance(st, uMouse / uResolution.xy);
      float glow = smoothstep(0.4, 0.0, dist);

      color += mix(deepBlue, neonCyan, wave * 0.5 + 0.5) * 0.3;
      color += neonCyan * glow * 1.5;

      gl_FragColor = vec4(color, 1.0);
    }
  `
};

function CyberBackground() {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[20, 20, 64, 64]} />
      <shaderMaterial args={[CyberShaderMaterial]} />
    </mesh>
  );
}

export default function WorldAdvancedHero() {
  return (
    <div className="relative w-full h-screen bg-[#030712] overflow-hidden">
      {/* WebGL GPU-Accelerated Canvas */}
      <Canvas className="absolute inset-0 z-0 pointer-events-none" camera={{ position: [0, 0, 5] }}>
        <CyberBackground />
      </Canvas>

      {/* Cinematic Content Layer */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <span className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 uppercase mb-6 backdrop-blur-md">
          Awwwards-Grade Architecture
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight max-w-4xl leading-tight">
          Poonam Electronics <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">Redefined</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl font-light">
          Built with real-time WebGL fragment shaders, custom inertial physics, and zero-latency edge performance.
        </p>
      </div>
    </div>
  );
}
