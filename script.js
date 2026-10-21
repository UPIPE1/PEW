/* Poonam Electronics: page behaviour & hyper-advanced lively animations */
(function () {
  "use strict";
  var S = window.SITE;
  if (!S) return;

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------- 1. Interactive Canvas Particle Constellation ---------- */
  function initParticleCanvas() {
    var canvas = $("#particleCanvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var width, height;
    var particles = [];
    var numParticles = 40;

    function resize() {
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    function Particle() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 2 + 1;
    }

    Particle.prototype.update = function () {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;
    };

    Particle.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(37, 99, 235, 0.4)";
      ctx.fill();
    };

    for (var i = 0; i < numParticles; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      for (var i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = "rgba(6, 182, 212, " + (1 - dist / 120) * 0.3 + ")";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* ---------- 2. Real-time 3D Card Tilt Physics ---------- */
  function init3DTiltCards() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var cards = $$(".tilt-card");
    cards.forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var xc = rect.width / 2;
        var yc = rect.height / 2;
        var dx = (x - xc) / (xc / 10);
        var dy = (y - yc) / (yc / 10);
        card.style.transform = "perspective(1000px) rotateY(" + dx + "deg) rotateX(" + (-dy) + "deg) translateY(-4px)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0)";
      });
    });
  }

  /* ---------- 3. Advanced Dynamic Split-Text Animation ---------- */
  function initAdvancedAnimations() {
    var headlines = $$(".split-headline");
    headlines.forEach(function (h1) {
      var html = h1.innerHTML;
      var parts = html.split(/(<span[^>]*>.*?<\/span>|\s+)/);
      h1.innerHTML = parts.map(function (part) {
        if (!part.trim()) return part;
        if (part.indexOf("<span") === 0) return part;
        return '<span class="word-wrap"><span class="word-inner">' + part + '</span></span>';
      }).join("");
    });

    var revealEls = $$(".reveal-text, .split-headline");
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            var wordInners = entry.target.querySelectorAll(".word-inner");
            wordInners.forEach(function (wi, idx) {
              setTimeout(function () {
                wi.classList.add("animate");
              }, idx * 40);
            });
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -50px 0px", threshold: 0.1 });

      revealEls.forEach(function (el) { observer.observe(el); });
    } else {
      revealEls.forEach(function (el) {
        el.classList.add("active");
        el.querySelectorAll(".word-inner").forEach(function (wi) { wi.classList.add("animate"); });
      });
    }
  }

  /* ---------- helpers ---------- */
  var digits = function (p) { return String(p).replace(/\D/g, ""); };
  var intl = function (p) { var d = digits(p); return d.length === 10 ? "91" + d : d; };
  var tel = function (p) { return "tel:+" + intl(p); };
  var wa = function (p, msg) { return "https://wa.me/" + intl(p) + "?text=" + encodeURIComponent(msg || S.whatsappMessage); };
  var pretty = function (p) { var d = digits(p).slice(-10); return "+91 " + d.slice(0, 5) + " " + d.slice(5); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var to12 = function (hhmm) {
    var p = hhmm.split(":"), h = +p[0], m = p[1];
    var suffix = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return h + ":" + m + " " + suffix;
  };
  var icon = function (id) { return '<svg class="ico" aria-hidden="true"><use href="#' + id + '"/></svg>'; };
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- fill details ---------- */
  var street = S.address.street ? S.address.street + ", " : "";
  var addr = street + S.address.line + ", " + S.address.region + " " + S.address.pin;
  var hoursText = to12(S.hours.open) + " to " + to12(S.hours.close);

  $$("[data-address]").forEach(function (el) { el.textContent = addr; });
  $$("[data-hours-time]").forEach(function (el) { el.textContent = hoursText; });
  $$("[data-hours-days]").forEach(function (el) { el.textContent = S.hours.days; });
  $$("[data-owner-phone]").forEach(function (el) { el.textContent = pretty(S.owner.phone); });
  $$("[data-maps]").forEach(function (el) { el.href = S.mapsLink; });
  $$("[data-call]").forEach(function (el) { el.href = tel(S.owner.phone); el.setAttribute("aria-label", "Call " + S.owner.name); });
  $$("[data-wa]").forEach(function (el) { el.href = wa(S.owner.phone); el.setAttribute("aria-label", "Chat with " + S.name + " on WhatsApp"); });

  /* Map: created only when the section is near the screen */
  var mapWrap = $("#mapWrap");
  function loadMap() {
    if (!mapWrap || mapWrap.querySelector("iframe") || !(S.mapEmbed || S.coords)) return;
    var f = document.createElement("iframe");
    f.title = "Map showing " + S.name + " in " + S.address.line;
    f.loading = "lazy";
    f.referrerPolicy = "no-referrer-when-downgrade";
    f.src = S.mapEmbed || ("https://maps.google.com/maps?q=" + S.coords.lat + "," + S.coords.lng + "&z=17&output=embed");
    mapWrap.appendChild(f);
  }
  if (mapWrap) {
    if ("IntersectionObserver" in window) {
      var mo = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { loadMap(); mo.disconnect(); }
      }, { rootMargin: "400px 0px" });
      mo.observe(mapWrap);
    } else { loadMap(); }
  }

  /* Phone cards */
  var people = $("#people");
  if (people) {
    var o = S.owner;
    var html = '<div class="person-owner">' +
      '<span class="role">' + esc(o.role) + '</span>' +
      '<h3>' + esc(o.name) + '</h3>' +
      '<p class="num">' + pretty(o.phone) + '</p>' +
      '<div class="person-actions">' +
        '<a class="btn btn-primary" href="' + tel(o.phone) + '">' + icon("i-phone") + '<span>Call</span></a>' +
        '<a class="btn btn-outline" href="' + wa(o.phone) + '" target="_blank" rel="noopener">' + icon("i-wa") + '<span>WhatsApp</span></a>' +
      '</div></div>';

    if (S.staff && S.staff.length) {
      html += '<div class="person-list">' + S.staff.map(function (p) {
        return '<div class="person">' +
          '<div class="person-info"><strong>' + esc(p.name) + '</strong><span>' + esc(p.role) + ", " + pretty(p.phone) + '</span></div>' +
          '<a class="btn btn-call" href="' + tel(p.phone) + '" aria-label="Call ' + esc(p.name) + '">' + icon("i-phone") + '<span>Call</span></a>' +
          '<a class="btn btn-wa" href="' + wa(p.phone) + '" target="_blank" rel="noopener" aria-label="WhatsApp ' + esc(p.name) + '">' + icon("i-wa") + '<span>WhatsApp</span></a>' +
        '</div>';
      }).join("") + '</div>';
    }
    people.innerHTML = html;
  }

  /* Social links */
  var social = $("#social");
  if (social) {
    var names = { instagram: "Instagram", facebook: "Facebook", youtube: "YouTube" };
    var items = Object.keys(S.social || {}).filter(function (k) { return S.social[k]; });
    if (items.length) {
      social.innerHTML = items.map(function (k) {
        return '<li><a href="' + esc(S.social[k]) + '" target="_blank" rel="noopener">' + (names[k] || esc(k)) + '</a></li>';
      }).join("");
      social.hidden = false;
    }
  }

  /* Years in business */
  if (S.yearsInBusiness) {
    $("#yearsValue").textContent = S.yearsInBusiness;
    $("#years").hidden = false;
  }

  var yr = $("#year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* Notice bar */
  function istParts() {
    var fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false,
      year: "numeric", month: "2-digit", day: "2-digit"
    });
    var parts = fmt.formatToParts(new Date());
    var get = function (t) { return parts.filter(function (p) { return p.type === t; })[0].value; };
    var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return {
      day: days[get("weekday")],
      mins: (+get("hour") % 24) * 60 + (+get("minute")),
      date: get("year") + "-" + get("month") + "-" + get("day")
    };
  }
  function toMins(hhmm) { var p = hhmm.split(":"); return +p[0] * 60 + +p[1]; }

  function holidayActive(now) {
    var H = S.holiday;
    if (!H || !H.enabled || !H.message) return false;
    if (H.until && now.date > H.until) return false;
    return true;
  }

  var noticeEl = $("#notice");
  function updateNotice() {
    var now;
    try { now = istParts(); } catch (e) { return; }
    if (noticeEl) {
      var active = holidayActive(now);
      noticeEl.hidden = !active;
      if (active) $("#noticeText").textContent = S.holiday.message;
    }
  }

  /* Open / closed status */
  function updateStatus() {
    var now, text, open = false;
    try { now = istParts(); } catch (e) { return; }
    var openM = toMins(S.hours.open), closeM = toMins(S.hours.close);
    var off = S.hours.weeklyOff !== null && S.hours.weeklyOff !== undefined && now.day === S.hours.weeklyOff;
    var closedByNotice = holidayActive(now) && S.holiday.closeShop;

    if (closedByNotice) {
      text = "Closed today";
    } else if (off) {
      text = "Closed today";
    } else if (now.mins >= openM && now.mins < closeM) {
      open = true;
      text = "Open now, closes " + to12(S.hours.close);
    } else if (now.mins < openM) {
      text = "Closed now, opens " + to12(S.hours.open);
    } else {
      text = "Closed now, opens tomorrow " + to12(S.hours.open);
    }

    [["#status", "#statusText"], ["#statusInline", "#statusInlineText"]].forEach(function (pair) {
      var box = $(pair[0]), label = $(pair[1]);
      if (!box || !label) return;
      box.classList.toggle("is-open", open);
      label.textContent = text;
    });
  }
  updateNotice();
  updateStatus();
  setInterval(function () { updateNotice(); updateStatus(); }, 60000);

  /* Slideshow */
  (function slideshow() {
    var root = $("#slider"), track = $("#slides");
    if (!root || !track) return;

    (S.gallery || []).forEach(function (g) {
      if (!g || !g.src) return;
      var fig = document.createElement("figure");
      fig.className = "slide";
      var im = new Image();
      im.src = g.src;
      im.alt = g.alt || "Photo of Poonam Electronics";
      im.width = 1100; im.height = 880;
      im.loading = "lazy"; im.decoding = "async";
      fig.appendChild(im);
      track.appendChild(fig);
    });

    var slides = $$(".slide", track);
    var n = slides.length;
    if (n < 2) return;

    var prev = $("#prevBtn"), next = $("#nextBtn"), pause = $("#pauseBtn"), dotsBox = $("#dots");
    var index = 0, timer = null, userPaused = reduceMotion, hoverPaused = false;

    dotsBox.innerHTML = slides.map(function (_, i) {
      return '<button type="button" aria-label="Show photo ' + (i + 1) + ' of ' + n + '"></button>';
    }).join("");
    var dots = $$("button", dotsBox);
    [prev, next, pause, dotsBox].forEach(function (el) { el.hidden = false; });

    function show(i) {
      index = (i + n) % n;
      track.style.transform = "translateX(" + (-100 * index) + "%)";
      slides.forEach(function (s, k) { s.setAttribute("aria-hidden", k === index ? "false" : "true"); });
      dots.forEach(function (d, k) { d.setAttribute("aria-current", k === index ? "true" : "false"); });
    }
    function stop() { clearInterval(timer); timer = null; }
    function start() {
      stop();
      if (userPaused || hoverPaused || document.hidden) return;
      timer = setInterval(function () { show(index + 1); }, 5000);
    }
    function setPaused(v) {
      userPaused = v;
      pause.classList.toggle("paused", v);
      pause.setAttribute("aria-label", v ? "Play slideshow" : "Pause slideshow");
      start();
    }

    prev.addEventListener("click", function () { show(index - 1); start(); });
    next.addEventListener("click", function () { show(index + 1); start(); });
    pause.addEventListener("click", function () { setPaused(!userPaused); });
    dots.forEach(function (d, k) { d.addEventListener("click", function () { show(k); start(); }); });

    root.addEventListener("mouseenter", function () { hoverPaused = true; stop(); });
    root.addEventListener("mouseleave", function () { hoverPaused = false; start(); });
    root.addEventListener("focusin", function () { hoverPaused = true; stop(); });
    root.addEventListener("focusout", function () { hoverPaused = false; start(); });
    document.addEventListener("visibilitychange", start);

    var x0 = null;
    root.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    root.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 40) { show(index + (dx < 0 ? 1 : -1)); start(); }
    }, { passive: true });
    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { show(index - 1); start(); }
      if (e.key === "ArrowRight") { show(index + 1); start(); }
    });

    pause.classList.toggle("paused", userPaused);
    pause.setAttribute("aria-label", userPaused ? "Play slideshow" : "Pause slideshow");
    show(0);
    start();
  })();

  /* WhatsApp enquiry form */
  var form = $("#enquiry");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var checked = $('input[name="cat"]:checked', form);
      var cat = checked ? checked.value : "";
      var note = $("#enqMsg").value.trim();
      var msg = "Hello " + S.name + ", I would like to enquire about " + cat.toLowerCase() + "." + (note ? " " + note : "");
      window.open(wa(S.owner.phone, msg), "_blank", "noopener");
    });
  }

  /* Header scroll & nav active spy */
  var header = $(".site-header");
  var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 8); };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var btn = $("#menuBtn"), nav = $("#nav");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  btn.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
  $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  if ("IntersectionObserver" in window) {
    var links = {};
    $$("[data-spy]").forEach(function (a) { links[a.dataset.spy] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        Object.keys(links).forEach(function (k) { links[k].classList.toggle("active", k === en.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

  // Initialize hyper-advanced animations
  initParticleCanvas();
  init3DTiltCards();
  initAdvancedAnimations();
})();
