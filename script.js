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
    el.innerHTML = arr.map(tcard).join("");
  }

  function initTestimonialsCarousel() {
    var track = document.getElementById("tRow1");
    var prevBtn = document.getElementById("tPrev");
    var nextBtn = document.getElementById("tNext");
    if (!track || !prevBtn || !nextBtn) return;

    fillRow("tRow1", testimonials);
    track.classList.remove("marquee-track");
    track.style.animation = "none";

    var index = 0;
    var cards = track.querySelectorAll(".tcard");
    var viewport = track.parentElement;
    var gap = 22;

    function sizeCards() {
      var w = viewport.clientWidth;
      if (!w) return;
      for (var i = 0; i < cards.length; i++) {
        cards[i].style.width = w + "px";
        cards[i].style.minWidth = w + "px";
        cards[i].style.flexBasis = w + "px";
      }
    }

    function slide() {
      if (!cards.length) return;
      sizeCards();
      var w = viewport.clientWidth;
      if (!w) return;
      track.style.transform = "translate3d(-" + (index * (w + gap)) + "px, 0, 0)";
    }

    prevBtn.addEventListener("click", function () {
      index = (index - 1 + cards.length) % cards.length;
      slide();
    });

    nextBtn.addEventListener("click", function () {
      index = (index + 1) % cards.length;
      slide();
    });

    function refreshCarousel() {
      slide();
    }

    window.addEventListener("resize", refreshCarousel);
    window.addEventListener("load", refreshCarousel);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refreshCarousel);
    }
    requestAnimationFrame(refreshCarousel);
    setTimeout(refreshCarousel, 120);
  }

  initTestimonialsCarousel();

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

  function closeMobileMenu() {
    if (toggle) toggle.classList.remove("open");
    if (links) links.classList.remove("open");
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      toggle.classList.toggle("open");
      links.classList.toggle("open");
    });
    if (links) {
      links.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", closeMobileMenu);
      });
    }
  }

  /* ---------- Contact CTAs → scroll to contact form ---------- */
  var CONTACT_HREF_RE = /#contact$/i;

  function isContactLink(el) {
    if (!el || el.tagName !== "A") return false;
    var href = (el.getAttribute("href") || "").trim();
    if (CONTACT_HREF_RE.test(href) || href === "contact") return true;
    if (/index\.html#contact$/i.test(href)) return true;
    var text = (el.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
    if (el.classList.contains("nav-cta")) return true;
    if (el.classList.contains("contact-scroll")) return true;
    return /^(hire us|hire us today|let's work together|start a campaign|fill your pipeline|get a free consultation|send us a message|contact us|get in touch|contact)$/.test(text)
      || text.indexOf("hire us") === 0
      || text.indexOf("free consultation") !== -1
      || text.indexOf("send us a message") !== -1;
  }

  function scrollToContactSection(focusForm) {
    var contact = document.getElementById("contact");
    if (!contact) return false;
    closeMobileMenu();
    contact.scrollIntoView({ behavior: "smooth", block: "start" });
    if (focusForm) {
      window.setTimeout(function () {
        var nameInput = document.getElementById("contactName");
        if (nameInput) nameInput.focus({ preventScroll: true });
      }, 500);
    }
    return true;
  }

  function goToContactPage() {
    var path = window.location.pathname || "";
    var base = path.slice(-1) === "/" ? path + "index.html" : path.replace(/[^/]+$/, "index.html");
    if (base === "index.html" || path.indexOf("index.html") !== -1) {
      window.location.hash = "contact";
      scrollToContactSection(true);
      return;
    }
    window.location.href = "index.html#contact";
  }

  document.addEventListener("click", function (e) {
    var el = e.target.closest("a");
    if (!el || !isContactLink(el)) return;
    if (/^(mailto:|tel:|https?:)/i.test(el.getAttribute("href") || "")) return;

    var href = (el.getAttribute("href") || "").trim();
    if (document.getElementById("contact")) {
      e.preventDefault();
      if (href.indexOf("#") !== -1) {
        history.pushState(null, "", "#contact");
      }
      scrollToContactSection(true);
      return;
    }
    if (/index\.html#contact$/i.test(href) || href === "#contact" || href === "contact" || isContactLink(el)) {
      e.preventDefault();
      goToContactPage();
    }
  }, true);

  document.querySelectorAll('a[href="#contact"], a[href="index.html#contact"]').forEach(function (a) {
    a.classList.add("contact-scroll");
  });

  if (window.location.hash === "#contact") {
    window.addEventListener("load", function () {
      window.setTimeout(function () { scrollToContactSection(true); }, 120);
    });
  }

  /* ---------- Stacking cards: scale + fade earlier cards as they get covered ---------- */
  var cards = Array.prototype.slice.call(document.querySelectorAll(".stack-card"));
  function scaleStack() {
    if (window.innerWidth <= 980) { cards.forEach(function (c) { c.style.transform = ""; c.style.opacity = ""; }); return; }
    var lastIndex = cards.length - 1;
    cards.forEach(function (card, i) {
      var rect = card.getBoundingClientRect();
      var stickTop = 120 + i * 22;
      // distance the card has been "pushed past" its sticky point
      var past = stickTop - rect.top;
      // Only fade cards that are covered by a later card — keep the last card fully opaque
      if (past > 0 && i < lastIndex) {
        var s = Math.max(0.92, 1 - past / 2600);
        var o = Math.max(0, 1 - past / 450);
        card.style.transform = "scale(" + s + ")";
        card.style.opacity = String(o);
      } else {
        card.style.transform = "scale(1)";
        card.style.opacity = "1";
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

  /* ---------- Contact form → email + API storage ---------- */
  var API_BASE = window.AGENCY_API_BASE || "";
  if (!API_BASE && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    API_BASE = "http://localhost:3001";
  }
  var NOTIFY_EMAIL = window.AGENCY_NOTIFY_EMAIL || "info@marketmakers.dev";
  var EMAILJS = window.AGENCY_EMAILJS || {
    service_id: "service_2ph8u3w",
    template_id: "template_56jyetw",
    user_id: "j3AoH8cf3nfZVbQVN"
  };

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

    function emailParams(entry) {
      return {
        to_email: NOTIFY_EMAIL,
        user_name: entry.name,
        user_email: entry.email,
        from_name: entry.name || "Website Visitor",
        from_email: entry.email,
        reply_to: entry.email,
        message: entry.message || "New agency contact form submission"
      };
    }

    function sendEmailJs(entry) {
      return fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: EMAILJS.service_id,
          template_id: EMAILJS.template_id,
          user_id: EMAILJS.user_id,
          template_params: emailParams(entry)
        })
      }).then(function (r) {
        if (!r.ok) throw new Error("emailjs");
        return r.text();
      });
    }

    function sendFormSubmit(entry) {
      return fetch("https://formsubmit.co/ajax/" + encodeURIComponent(NOTIFY_EMAIL), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          name: entry.name,
          email: entry.email,
          message: entry.message,
          _subject: "Market Maker contact from " + (entry.name || "visitor"),
          _template: "table",
          _captcha: "false"
        })
      }).then(function (r) {
        if (!r.ok) throw new Error("formsubmit");
        return r.json();
      });
    }

    function saveToApi(entry) {
      if (!API_BASE) return Promise.reject(new Error("no-api"));
      return fetch(API_BASE + "/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: entry.name,
          email: entry.email,
          message: entry.message
        })
      }).then(function (r) {
        return r.json().then(function (d) {
          if (!r.ok) throw new Error(d.error || "api");
          return d;
        });
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var nameInput = form.querySelector("#contactName");
      var emailInput = form.querySelector("#contactEmail");
      var messageInput = form.querySelector("#contactMessage");

      var entry = {
        name: (nameInput && nameInput.value || "").trim(),
        email: (emailInput && emailInput.value || "").trim(),
        message: (messageInput && messageInput.value || "").trim()
      };

      if (!entry.name || !entry.email || !entry.message) {
        showStatus("Please fill in your name, email, and message.", true);
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(entry.email)) {
        showStatus("Please enter a valid email address.", true);
        return;
      }

      var origText = submitBtn ? submitBtn.textContent : "Send Message";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }
      if (statusEl) statusEl.hidden = true;

      var saved = false;
      var emailed = false;

      saveToApi(entry)
        .then(function () { saved = true; })
        .catch(function () { saved = false; });

      sendEmailJs(entry)
        .then(function () { emailed = true; })
        .catch(function () {
          return sendFormSubmit(entry).then(function () { emailed = true; });
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = origText;
          }
          if (emailed || saved) {
            showStatus(
              emailed
                ? "Message sent successfully! We'll get back to you within 24 hours."
                : "Message saved. Email delivery had an issue — we'll still review your submission.",
              false
            );
            form.reset();
          } else {
            showStatus(
              "Could not send. Please email " + NOTIFY_EMAIL + " directly.",
              true
            );
          }
        });
    });
  }

  /* ---------- Dashboard screenshot lightbox ---------- */
  var overlay = document.getElementById("work-overlay");
  var overlayImg = document.getElementById("work-overlay-img");
  var closeBtn = document.getElementById("work-overlay-close");
  if (overlay && overlayImg) {
    function closeOverlay() {
      overlay.hidden = true;
      overlayImg.removeAttribute("src");
      document.body.style.overflow = "";
    }
    document.querySelectorAll(".work-card-img-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        overlayImg.src = btn.getAttribute("data-full");
        overlay.hidden = false;
        document.body.style.overflow = "hidden";
      });
    });
    if (closeBtn) closeBtn.addEventListener("click", closeOverlay);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeOverlay();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !overlay.hidden) closeOverlay();
    });
  }

  onScroll();
})();
