/* Poonam Electronics: Real WebGL GLSL Shader & Quantum Physics Engine */
(function () {
  "use strict";

  /* ---------- 1. Custom Quantum Cursor ---------- */
  var dot = document.getElementById("cursorDot");
  var ring = document.getElementById("cursorRing");
  if (dot && ring) {
    var mouseX = -100, mouseY = -100, ringX = -100, ringY = -100;
    window.addEventListener("mousemove", function (e) {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.transform = "translate(" + mouseX + "px, " + mouseY + "px) translate(-50%, -50%)";
    });
    function renderCursor() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = "translate(" + ringX + "px, " + ringY + "px) translate(-50%, -50%)";
      requestAnimationFrame(renderCursor);
    }
    renderCursor();
  }

  /* ---------- 2. Real Three.js WebGL GLSL Shader Background ---------- */
  var container = document.getElementById("webglCanvas");
  if (container && window.THREE) {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    camera.position.z = 5;

    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    var geometry = new THREE.PlaneGeometry(20, 20, 32, 32);
    var material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(container.offsetWidth, container.offsetHeight) }
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
        varying vec2 vUv;
        void main() {
          vec2 st = vUv;
          vec3 color = vec3(0.03, 0.07, 0.15);
          float wave = sin(st.x * 12.0 + uTime * 1.8) * cos(st.y * 12.0 + uTime * 1.2);
          vec3 neonCyan = vec3(0.08, 0.72, 0.83);
          vec3 deepBlue = vec3(0.14, 0.39, 0.92);
          color += mix(deepBlue, neonCyan, wave * 0.5 + 0.5) * 0.35;
          gl_FragColor = vec4(color, 1.0);
        }
      `
    });

    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    var clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      material.uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener("resize", function () {
      if (!container) return;
      camera.aspect = container.offsetWidth / container.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.offsetWidth, container.offsetHeight);
    });
  }

  /* ---------- 3. Holographic 3D Tilt Cards ---------- */
  document.querySelectorAll(".tilt-card").forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", x + "px");
      card.style.setProperty("--mouse-y", y + "px");

      var xc = rect.width / 2, yc = rect.height / 2;
      var dx = (x - xc) / (xc / 15), dy = (y - yc) / (yc / 15);
      card.style.transform = "perspective(1200px) rotateY(" + dx + "deg) rotateX(" + (-dy) + "deg) translateY(-8px)";
    });
    card.addEventListener("mouseleave", function () {
      card.style.transform = "perspective(1200px) rotateY(0deg) rotateX(0deg) translateY(0)";
    });
  });

  /* ---------- 4. Scroll Reveal Intersection Observer ---------- */
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".reveal-text").forEach(function (el) {
    observer.observe(el);
  });
})();
