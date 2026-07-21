(function () {
  function sleep(ms) {
    return new Promise(function (r) { setTimeout(r, ms); });
  }

  function setBusy(btn, busy) {
    if (!btn) return;
    btn.disabled = busy;
    btn.style.opacity = busy ? "0.7" : "1";
  }

  /* ---------- How-it-works video players ---------- */
  var VIDEOS = {
    lead: [
      {
        title: "Step 1 — Form bharta hai",
        body: "Raat ko bhi koi naam + number likh ke submit karta hai.",
        caption: "Website form pe naya lead aaya",
        chips: ["Sarah Chen", "Demo chahiye", "Submit ✓"]
      },
      {
        title: "Step 2 — AI padhti hai",
        body: "System poochta hai: ye serious buyer hai? Score 92 — Haan.",
        caption: "AI check: serious lead ✓",
        chips: ["Score 92", "Serious", "Assign Ayesha"]
      },
      {
        title: "Step 3 — Team ko message",
        body: "WhatsApp / Slack: “Sarah ne demo manga — jaldi call karo.”",
        caption: "2 minute mein team ke paas alert",
        chips: ["WhatsApp", "Slack", "Call now"]
      }
    ],
    reply: [
      {
        title: "Step 1 — Replies aati hain",
        body: "Cold email ke baad inbox mein bohot jawab — mix of interest aur “no”.",
        caption: "Inbox mein 50+ replies",
        chips: ["Call?", "Not now", "Unsubscribe"]
      },
      {
        title: "Step 2 — AI sort karti hai",
        body: "Teen dabbe: Hot (jaldi jawab) · Warm (baad mein) · Skip (ignore).",
        caption: "Har reply apni jagah pe",
        chips: ["Hot", "Warm", "Skip"]
      },
      {
        title: "Step 3 — Draft tayyar",
        body: "Aapke liye jawab likha hota hai — bas check karke bhej do.",
        caption: "Sirf important pe time",
        chips: ["Draft ready", "Send", "3× tez"]
      }
    ],
    linkedin: [
      {
        title: "Step 1 — Accept hota hai",
        body: "LinkedIn pe koi aapki connection request accept karta hai.",
        caption: "Nayi connection accept",
        chips: ["Daniel", "RelayOps", "Accepted"]
      },
      {
        title: "Step 2 — List mein save",
        body: "Naam, company, job — aapki list / CRM mein khud likh jati hai.",
        caption: "Auto save — copy-paste nahi",
        chips: ["Name saved", "Company", "Title"]
      },
      {
        title: "Step 3 — Reminder",
        body: "Task: “Aaj short message bhejo” — follow-up bhoolta nahi.",
        caption: "Har connection pe follow-up",
        chips: ["Reminder", "DM today", "Done"]
      }
    ]
  };

  function chipClass(text) {
    var t = (text || "").toLowerCase();
    if (/hot|serious|whatsapp|accepted|done|send|✓|92/.test(t)) return "vchip on";
    if (/skip|unsub|not/.test(t)) return "vchip warn";
    if (/warm|slack|call|draft|reminder|dm/.test(t)) return "vchip hot";
    return "vchip";
  }

  function initVideoPlayer(root) {
    var key = root.getAttribute("data-video");
    var scenes = VIDEOS[key];
    if (!scenes || !scenes.length) return;

    var screen = root.querySelector(".vplayer-screen");
    var captionEl = root.querySelector(".vplayer-caption");
    var fill = root.querySelector(".vprogress > i");
    var timeEl = root.querySelector(".vtime");
    var playBtn = root.querySelector(".vplay");
    var bigPlay = root.querySelector(".vplayer-bigplay");
    var progress = root.querySelector(".vprogress");

    screen.innerHTML = "";
    scenes.forEach(function (s, i) {
      var el = document.createElement("div");
      el.className = "vscene" + (i === 0 ? " is-on" : "");
      el.setAttribute("data-i", String(i));
      var chips = (s.chips || []).map(function (c) {
        return '<span class="' + chipClass(c) + '">' + c + "</span>";
      }).join("");
      el.innerHTML =
        '<div class="vscene-card">' +
        '<div class="v-label">How it works</div>' +
        "<h3>" + s.title + "</h3>" +
        "<p>" + s.body + "</p>" +
        '<div class="vscene-visual">' + chips + "</div>" +
        "</div>";
      screen.appendChild(el);
    });

    var index = 0;
    var playing = false;
    var timer = null;
    var sceneMs = 3200;
    var total = scenes.length;

    function show(i) {
      index = i;
      root.querySelectorAll(".vscene").forEach(function (el, n) {
        el.classList.toggle("is-on", n === index);
      });
      captionEl.textContent = scenes[index].caption;
      fill.style.width = (((index + 1) / total) * 100) + "%";
      timeEl.textContent = (index + 1) + " / " + total;
    }

    function stop() {
      playing = false;
      root.classList.remove("is-playing");
      if (timer) { clearTimeout(timer); timer = null; }
      playBtn.textContent = "▶";
      playBtn.setAttribute("aria-label", "Play");
    }

    function tick() {
      if (!playing) return;
      timer = setTimeout(function () {
        if (index >= total - 1) {
          stop();
          return;
        }
        show(index + 1);
        tick();
      }, sceneMs);
    }

    function play() {
      if (playing) return;
      if (index >= total - 1) show(0);
      playing = true;
      root.classList.add("is-playing");
      playBtn.textContent = "❚❚";
      playBtn.setAttribute("aria-label", "Pause");
      tick();
    }

    function toggle() {
      if (playing) stop();
      else play();
    }

    playBtn.addEventListener("click", toggle);
    bigPlay.addEventListener("click", play);
    progress.addEventListener("click", function (e) {
      var rect = progress.getBoundingClientRect();
      var pct = (e.clientX - rect.left) / rect.width;
      var next = Math.min(total - 1, Math.max(0, Math.floor(pct * total)));
      var was = playing;
      stop();
      show(next);
      if (was) play();
    });

    show(0);
  }

  document.querySelectorAll(".vplayer[data-video]").forEach(initVideoPlayer);

  /* ---------- Interactive example buttons ---------- */
  var leadBtn = document.getElementById("runLeadDemo");
  if (leadBtn) {
    leadBtn.addEventListener("click", async function () {
      setBusy(leadBtn, true);
      var log = document.getElementById("leadLog");
      var out = document.getElementById("leadOut");
      log.innerHTML = "";
      out.innerHTML = "";
      var steps = [
        "1. Form bhara gaya — Sarah Chen",
        "2. AI ne padha — ye serious buyer lagti hai (score 92)",
        "3. Team ko WhatsApp: “Jaldi call karo”"
      ];
      for (var i = 0; i < steps.length; i++) {
        var line = document.createElement("div");
        line.className = "line";
        line.textContent = steps[i];
        log.appendChild(line);
        await sleep(500);
      }
      out.innerHTML =
        '<div class="feed-item entering">' +
        '<span class="badge badge-hot">Serious lead</span>' +
        '<h3 style="margin:10px 0 4px;font-size:16px">Sarah Chen</h3>' +
        '<p class="muted" style="font-size:14px">Demo chahiye. Budget bataya. Ayesha ko assign — 2 minute ke andar alert.</p>' +
        "</div>";
      setBusy(leadBtn, false);
    });
  }

  var replyBtn = document.getElementById("runReplyDemo");
  if (replyBtn) {
    replyBtn.addEventListener("click", async function () {
      setBusy(replyBtn, true);
      var cols = {
        hot: document.getElementById("colHot"),
        warm: document.getElementById("colWarm"),
        skip: document.getElementById("colSkip")
      };
      Object.keys(cols).forEach(function (k) { cols[k].innerHTML = ""; });
      var inbox = [
        { col: "hot", name: "Marcus", text: "“Thursday call book kar sakte hain?”", draft: "Draft: Haan — calendar link bhej do." },
        { col: "warm", name: "Priya", text: "“Pehle case study bhej do.”", draft: "Draft: 2 examples + short call offer." },
        { col: "skip", name: "Office", text: "“List se hata do.”", draft: "Draft: Hata diya — no follow-up." }
      ];
      for (var i = 0; i < inbox.length; i++) {
        var item = inbox[i];
        var el = document.createElement("div");
        el.className = "mini entering";
        el.innerHTML = "<strong>" + item.name + "</strong><p>" + item.text + "</p><p style='color:#d4b8ff;margin-top:6px'>" + item.draft + "</p>";
        cols[item.col].appendChild(el);
        await sleep(500);
      }
      setBusy(replyBtn, false);
    });
  }

  var liBtn = document.getElementById("runLiDemo");
  if (liBtn) {
    liBtn.addEventListener("click", async function () {
      setBusy(liBtn, true);
      var log = document.getElementById("liLog");
      var feed = document.getElementById("liFeed");
      log.innerHTML = "";
      feed.innerHTML = "";
      var steps = [
        "1. Daniel ne connection accept ki",
        "2. Naam + company list mein save",
        "3. Reminder: “Aaj short message bhejo”"
      ];
      for (var i = 0; i < steps.length; i++) {
        var line = document.createElement("div");
        line.className = "line";
        line.textContent = steps[i];
        log.appendChild(line);
        await sleep(480);
      }
      feed.innerHTML =
        '<div class="feed-item entering">' +
        '<span class="badge badge-ok">Saved</span>' +
        '<h3 style="margin:10px 0 4px;font-size:16px">Daniel Okonkwo · RelayOps</h3>' +
        '<p class="muted" style="font-size:14px">List mein add. Aaj ka task: pehla message bhejna.</p>' +
        "</div>";
      setBusy(liBtn, false);
    });
  }
})();
