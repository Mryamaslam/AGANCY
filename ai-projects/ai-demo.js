(function () {
  function sleep(ms) {
    return new Promise(function (r) { setTimeout(r, ms); });
  }

  function setBusy(btn, busy) {
    if (!btn) return;
    btn.disabled = busy;
    btn.style.opacity = busy ? "0.7" : "1";
  }

  /* Lead Inbox AI */
  var leadBtn = document.getElementById("runLeadDemo");
  if (leadBtn) {
    leadBtn.addEventListener("click", async function () {
      setBusy(leadBtn, true);
      var log = document.getElementById("leadLog");
      var out = document.getElementById("leadOut");
      log.innerHTML = "";
      out.innerHTML = "";
      var steps = [
        "Webhook received · contact form submit",
        "GPT classify · ICP match + intent score",
        "CRM write · HubSpot deal + owner assign",
        "Alert · Slack #sales + WhatsApp ping"
      ];
      for (var i = 0; i < steps.length; i++) {
        var line = document.createElement("div");
        line.className = "line";
        line.style.animationDelay = "0s";
        line.textContent = "> " + steps[i];
        log.appendChild(line);
        await sleep(450);
      }
      out.innerHTML =
        '<div class="feed-item entering">' +
        '<span class="badge badge-hot">Hot · 92</span>' +
        '<h3 style="margin:10px 0 4px;font-size:16px">Sarah Chen · VP Growth, Northpeak</h3>' +
        '<p class="muted" style="font-size:14px">Requested demo for Instantly + LinkedIn outbound. Budget mentioned. Routed to Ayesha · SLA &lt; 2 min.</p>' +
        '<div class="stack-pills" style="margin-top:10px"><span>HubSpot</span><span>Slack</span><span>WhatsApp</span></div>' +
        "</div>";
      setBusy(leadBtn, false);
    });
  }

  /* Reply Copilot */
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
        { col: "hot", name: "Marcus R.", text: "Can we book a call Thursday? Looking at Smartlead + list build.", draft: "Thu 2–4pm PKT works — here's my calendar link." },
        { col: "warm", name: "Priya N.", text: "Interesting — send case studies when you can.", draft: "Sharing 2 B2B SaaS reply-rate lifts + a 15-min audit slot." },
        { col: "skip", name: "Office Mgr", text: "Please remove me from this list.", draft: "Removed + suppressed. No follow-up." }
      ];
      for (var i = 0; i < inbox.length; i++) {
        var item = inbox[i];
        var el = document.createElement("div");
        el.className = "mini entering";
        el.innerHTML = "<strong>" + item.name + "</strong><p>" + item.text + "</p><p style='color:#d4b8ff;margin-top:6px'><em>Draft:</em> " + item.draft + "</p>";
        cols[item.col].appendChild(el);
        await sleep(500);
      }
      setBusy(replyBtn, false);
    });
  }

  /* LinkedIn → CRM */
  var liBtn = document.getElementById("runLiDemo");
  if (liBtn) {
    liBtn.addEventListener("click", async function () {
      setBusy(liBtn, true);
      var log = document.getElementById("liLog");
      var feed = document.getElementById("liFeed");
      log.innerHTML = "";
      feed.innerHTML = "";
      var steps = [
        "LinkedIn event · connection accepted",
        "Enrich · title, company, ICP tags",
        "CRM sync · contact + sequence enroll",
        "Task · Day-0 personalized DM due"
      ];
      for (var i = 0; i < steps.length; i++) {
        var line = document.createElement("div");
        line.className = "line";
        line.textContent = "> " + steps[i];
        log.appendChild(line);
        await sleep(420);
      }
      feed.innerHTML =
        '<div class="feed-item entering">' +
        '<span class="badge badge-ok">Synced</span>' +
        '<h3 style="margin:10px 0 4px;font-size:16px">Daniel Okonkwo · Founder, RelayOps</h3>' +
        '<p class="muted" style="font-size:14px">Added to HubSpot · enrolled “LI Warm” · task for Bilal: send case study DM within 1 hour.</p>' +
        '<div class="stack-pills" style="margin-top:10px"><span>Sales Nav</span><span>Make.com</span><span>HubSpot</span></div>' +
        "</div>";
      setBusy(liBtn, false);
    });
  }
})();
