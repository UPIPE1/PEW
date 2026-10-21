/* Poonam Electronics: Error-Free Interactive & WebGL Runtime */
(function () {
  "use strict";

  // Fallback config if window.SITE fails to load
  var S = window.SITE || {
    name: "Poonam Electronics",
    whatsappMessage: "Hello Poonam Electronics, I would like to enquire.",
    owner: { phone: "+919340329716" }
  };

  // Helper selectors
  var $ = function (sel) { return document.querySelector(sel); };

  // 1. WhatsApp Button Links Setup
  var phoneDigits = String(S.owner.phone).replace(/\D/g, "");
  if (phoneDigits.length === 10) phoneDigits = "91" + phoneDigits;
  var waLink = "https://wa.me/" + phoneDigits + "?text=" + encodeURIComponent(S.whatsappMessage);

  ["#waHeaderBtn", "#waContactBtn"].forEach(function (id) {
    var btn = $(id);
    if (btn) btn.href = waLink;
  });

  // 2. Custom Quantum Cursor
  var dot = $("#cursorDot");
  var ring = $("#cursorRing");
  if (dot && ring && window.innerWidth > 768) {
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

  // 3. Three.js WebGL GLSL Shader Background
  var container = $("#webglCanvas");
  if (container && window.THREE) {
    try {
      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(60, container.offsetWidth / container.offsetHeight || 1, 0.1, 1000);
      camera.position.z = 5;

      var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(container.offsetWidth || window.innerWidth, container.offsetHeight || 500);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      var geometry = new THREE.PlaneGeometry(20, 20, 32, 32);
      var material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: new THREE.Vector2(container.offsetWidth || 800, container.offsetHeight || 500) }
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
        camera.aspect = container.offsetWidth / container.offsetHeight || 1;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
      });
    } catch (err) {
      console.warn("WebGL initialization skipped:", err);
    }
  }

  // 4. Holographic 3D Tilt Cards
  document.querySelectorAll(".tilt-card").forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", x + "px");
      card.style.setProperty("--mouse-y", y + "px");

      var xc = rect.width / 2, yc = rect.height / 2;
      var dx = (x - xc) / (xc / 15), dy = (y - yc) / (yc / 15);
      card.style.transform = "perspective(1200px) rotateY(" + dx + "deg) rotateX(" + (-dy) + "deg) translateY(-6px)";
    });
    card.addEventListener("mouseleave", function () {
      card.style.transform = "perspective(1200px) rotateY(0deg) rotateX(0deg) translateY(0)";
    });
  });

  // 5. Mobile Menu Toggle
  var menuBtn = $("#menuBtn");
  var nav = $("#nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
      });
    });
  }

  // 6. Header Scroll Shadow
  var header = $(".site-header");
  window.addEventListener("scroll", function () {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 10);
    }
  }, { passive: true });

  // 7. Scroll Reveal Observer
  if ("IntersectionObserver" in window) {
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
  } else {
    document.querySelectorAll(".reveal-text").forEach(function (el) {
      el.classList.add("active");
    });
  }
})();
