(function () {
  function sleep(ms) {
    return new Promise(function (r) { setTimeout(r, ms); });
  }

  function setBusy(btn, busy) {
    if (!btn) return;
    btn.disabled = busy;
    btn.style.opacity = busy ? "0.7" : "1";
  }

  var leadBtn = document.getElementById("runLeadDemo");
  if (leadBtn) {
    leadBtn.addEventListener("click", async function () {
      setBusy(leadBtn, true);
      var log = document.getElementById("leadLog");
      var out = document.getElementById("leadOut");
      log.innerHTML = "";
      out.innerHTML = "";
      var steps = [
        "1. Form submitted, Sarah Chen",
        "2. AI scored 92, serious buyer",
        "3. WhatsApp alert, call now"
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
        '<p class="muted" style="font-size:14px">Asked for a demo. Budget mentioned. Assigned to Ayesha, alert within 2 minutes.</p>' +
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
        { col: "hot", name: "Marcus", text: "“Can we book a call Thursday?”", draft: "Draft: Yes, here’s my calendar link." },
        { col: "warm", name: "Priya", text: "“Send case studies first.”", draft: "Draft: 2 examples + a short call offer." },
        { col: "skip", name: "Office", text: "“Please remove me.”", draft: "Draft: Removed, no follow up." }
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
      if (!log || !feed) {
        setBusy(liBtn, false);
        return;
      }
      log.innerHTML = "";
      feed.innerHTML = '<p class="muted" style="font-size:14px">Working...</p>';
      var steps = [
        "1. LinkedIn: Daniel Okonkwo accepted your invite",
        "2. Saving name + company to your contact list...",
        "3. Saved: Daniel Okonkwo · RelayOps · Founder",
        "4. Reminder created: Message Daniel today"
      ];
      for (var i = 0; i < steps.length; i++) {
        var line = document.createElement("div");
        line.className = "line";
        line.textContent = steps[i];
        log.appendChild(line);
        log.scrollTop = log.scrollHeight;
        await sleep(650);
      }
      feed.innerHTML =
        '<div class="feed-item entering">' +
        '<span class="badge badge-ok">Saved to list</span>' +
        '<h3 style="margin:10px 0 4px;font-size:16px">Daniel Okonkwo · RelayOps</h3>' +
        '<p class="muted" style="font-size:14px"><strong>Title:</strong> Founder<br/>' +
        '<strong>Today\'s task:</strong> Send a short LinkedIn DM<br/>' +
        '<strong>Tip:</strong> Share 1 case study + ask for a 15-min chat</p>' +
        "</div>";
      setBusy(liBtn, false);
    });
  }

  var sdrBtn = document.getElementById("runSdrDemo");
  if (sdrBtn) {
    sdrBtn.addEventListener("click", async function () {
      setBusy(sdrBtn, true);
      var log = document.getElementById("sdrLog");
      var out = document.getElementById("sdrOut");
      log.innerHTML = "";
      out.innerHTML = "";
      var steps = [
        "1. Account: Northpeak · sarah@northpeak.io",
        "2. Research: Series B · hiring SDRs · uses HubSpot",
        "3. Hook: “Scaling outbound after the raise”",
        "4. Pack ready: LinkedIn + email + call opener"
      ];
      for (var i = 0; i < steps.length; i++) {
        var line = document.createElement("div");
        line.className = "line";
        line.textContent = steps[i];
        log.appendChild(line);
        await sleep(480);
      }
      out.innerHTML =
        '<div class="feed-item entering">' +
        '<span class="badge badge-ok">Personalized</span>' +
        '<h3 style="margin:10px 0 4px;font-size:16px">Northpeak outreach pack</h3>' +
        '<p class="muted" style="font-size:14px"><strong>LI:</strong> Congrats on the Series B, curious how you’re staffing outbound.<br/>' +
        '<strong>Email:</strong> Saw you’re hiring SDRs; we help teams hit reply rate targets in 30 days.<br/>' +
        '<strong>Call:</strong> “Calling about post raise outbound capacity…”</p>' +
        "</div>";
      setBusy(sdrBtn, false);
    });
  }

  var meetBtn = document.getElementById("runMeetDemo");
  if (meetBtn) {
    meetBtn.addEventListener("click", async function () {
      setBusy(meetBtn, true);
      var log = document.getElementById("meetLog");
      var out = document.getElementById("meetOut");
      log.innerHTML = "";
      out.innerHTML = "";
      var steps = [
        "1. Transcript received · 28 min discovery",
        "2. Extracted: pain = slow reply handling",
        "3. CRM: stage → Proposal · owner Ayesha",
        "4. Draft follow up email ready"
      ];
      for (var i = 0; i < steps.length; i++) {
        var line = document.createElement("div");
        line.className = "line";
        line.textContent = steps[i];
        log.appendChild(line);
        await sleep(480);
      }
      out.innerHTML =
        '<div class="feed-item entering">' +
        '<span class="badge badge-hot">Follow up ready</span>' +
        '<h3 style="margin:10px 0 4px;font-size:16px">Sarah Chen · Discovery summary</h3>' +
        '<p class="muted" style="font-size:14px"><strong>Next steps:</strong> send pricing + book technical demo.<br/>' +
        '<strong>Tasks:</strong> Ayesha, proposal by Thu · Bilal, Loom walkthrough.<br/>' +
        '<strong>Email draft:</strong> “Great speaking today, here’s what we covered…”</p>' +
        "</div>";
      setBusy(meetBtn, false);
    });
  }
})();
