(function () {
  "use strict";

  /* ---------- Testimonials ---------- */
  var testimonials = [
    { t: "Their cold email campaigns filled our pipeline within weeks. Replies tripled and we closed three new deals.", n: "Sarah Mitchell", r: "Founder, TrendWave", a: "SM" },
    { t: "The LinkedIn outreach team gets it. Real connections, not spam. Meetings started rolling in fast.", n: "James Carter", r: "Sales Lead, PostPulse", a: "JC" },
    { t: "They rebuilt our Upwork profile and proposals. Job invites and our success score went up noticeably.", n: "Aisha Khan", r: "Freelance Designer", a: "AK" },
    { t: "Our Meta and Google ads were burning budget. Market Maker restructured everything and cut our cost per lead in half.", n: "David Lee", r: "CMO, SnapSphere", a: "DL" },
    { t: "Clean data, qualified leads, honest reporting. Exactly the kind of agency partner a growing B2B team needs.", n: "Maria Gomez", r: "Head of Growth, BuzzHive", a: "MG" },
    { t: "Professional, fast, and they actually deliver. The email automation they set up runs itself and converts.", n: "Tom Becker", r: "Owner, BetterBox", a: "TB" }
  ];

  function tcard(d) {
    return (
      '<div class="tcard">' +
        '<div class="stars">★★★★★</div>' +
        '<p>"' + d.t + '"</p>' +
        '<div class="who"><div class="avatar">' + d.a + '</div><div><b>' + d.n + '</b><span>' + d.r + '</span></div></div>' +
      '</div>'
    );
  }
  function fillRow(id, arr) {
    var el = document.getElementById(id);
    if (!el) return;
    var html = arr.map(tcard).join("");
    el.innerHTML = html + html; // duplicate for seamless loop
  }
  fillRow("tRow1", testimonials);

  /* ---------- Scroll reveal ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        var el = e.target;
        var delay = parseInt(el.getAttribute("data-delay") || "0", 10);
        setTimeout(function () { el.classList.add("visible"); }, delay);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale").forEach(function (el) { io.observe(el); });

  /* ---------- Sticky nav shadow ---------- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 20) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
    var top = document.getElementById("toTop");
    if (window.scrollY > 500) top.classList.add("show");
    else top.classList.remove("show");
    scaleStack();
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Back to top ---------- */
  document.getElementById("toTop").addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (toggle) {
    toggle.addEventListener("click", function () {
      toggle.classList.toggle("open");
      links.classList.toggle("open");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { toggle.classList.remove("open"); links.classList.remove("open"); });
    });
  }

  /* ---------- Stacking cards: scale + fade earlier cards as they get covered ---------- */
  var cards = Array.prototype.slice.call(document.querySelectorAll(".stack-card"));
  function scaleStack() {
    if (window.innerWidth <= 980) { cards.forEach(function (c) { c.style.transform = ""; c.style.opacity = ""; }); return; }
    cards.forEach(function (card, i) {
      var rect = card.getBoundingClientRect();
      var stickTop = 120 + i * 22;
      // distance the card has been "pushed past" its sticky point
      var past = stickTop - rect.top;
      if (past > 0) {
        var s = Math.max(0.9, 1 - past / 2600);
        var o = Math.max(0.45, 1 - past / 900);
        card.style.transform = "scale(" + s + ")";
        card.style.opacity = o;
      } else {
        card.style.transform = "scale(1)";
        card.style.opacity = 1;
      }
    });
  }

  /* ---------- Counters ---------- */
  var counted = false;
  var heroStats = document.querySelector(".hero-stats");
  function runCounters() {
    document.querySelectorAll("[data-count]").forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var suffix = el.getAttribute("data-suffix") || "";
      var start = null, dur = 1500;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var val = Math.floor((1 - Math.pow(1 - p, 3)) * target);
        el.textContent = val + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(step);
    });
  }
  if (heroStats) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting && !counted) { counted = true; runCounters(); co.disconnect(); } });
    }, { threshold: 0.4 });
    co.observe(heroStats);
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    q.addEventListener("click", function () {
      var open = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach(function (other) {
        other.classList.remove("open");
        other.querySelector(".faq-a").style.maxHeight = null;
      });
      if (!open) { item.classList.add("open"); a.style.maxHeight = a.scrollHeight + "px"; }
    });
  });

  /* ---------- Contact form → API ---------- */
  var API_BASE = window.AGENCY_API_BASE || "";
  if (!API_BASE && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    API_BASE = "http://localhost:3001";
  }

  var form = document.getElementById("contactForm");
  if (form) {
    var statusEl = document.getElementById("contactFormStatus");
    var submitBtn = document.getElementById("contactSubmitBtn");

    function showStatus(msg, isError) {
      if (!statusEl) return;
      statusEl.textContent = msg;
      statusEl.hidden = false;
      statusEl.className = "form-status" + (isError ? " form-status--error" : " form-status--success");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var nameInput = form.querySelector("#contactName");
      var emailInput = form.querySelector("#contactEmail");
      var messageInput = form.querySelector("#contactMessage");

      var name = (nameInput && nameInput.value || "").trim();
      var email = (emailInput && emailInput.value || "").trim();
      var message = (messageInput && messageInput.value || "").trim();

      if (!name || !email || !message) {
        showStatus("Please fill in your name, email, and message.", true);
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showStatus("Please enter a valid email address.", true);
        return;
      }

      var origText = submitBtn ? submitBtn.textContent : "Send Message";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }
      if (statusEl) statusEl.hidden = true;

      fetch(API_BASE + "/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, email: email, message: message })
      })
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
        .then(function (res) {
          if (!res.ok) throw new Error(res.data.error || "Failed to send");
          showStatus("Message sent successfully! We'll get back to you within 24 hours.", false);
          form.reset();
        })
        .catch(function () {
          showStatus("Something went wrong. Please try again or email us directly.", true);
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = origText;
          }
        });
    });
  }

  onScroll();
})();
