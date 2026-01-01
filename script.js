// Virada 2026 (clean, confortável, sem barulho)
(() => {
  const el = (id) => document.getElementById(id);

  // ======== countdown UI ========
  const dEl = el("d");
  const hEl = el("h");
  const mEl = el("m");
  const sEl = el("s");
  const nowLabel = el("nowLabel");
  const targetLabel = el("targetLabel");
  const headline = el("headline");
  const subline = el("subline");
  const message = el("message");
  const yearHint = el("yearHint");

  const btnFocus = el("btnFocus");
  const btnFullscreen = el("btnFullscreen");

  // ======== metas ========
  const btnSave = el("btnSave");
  const btnClear = el("btnClear");
  const saveHint = el("saveHint");
  const g1 = el("g1");
  const g2 = el("g2");
  const g3 = el("g3");

  // ======== extras ========
  const nick = el("nick");
  const btnNick = el("btnNick");
  const btnNickClear = el("btnNickClear");
  const nickHint = el("nickHint");

  const btnShare = el("btnShare");
  const btnCopy = el("btnCopy");
  const copyHint = el("copyHint");
  const qrBox = el("qr");

  const r1 = el("r1"), r2 = el("r2"), r3 = el("r3"), r4 = el("r4"), r5 = el("r5");
  const btnRecap = el("btnRecap");
  const btnRecapCopy = el("btnRecapCopy");
  const btnRecapClear = el("btnRecapClear");
  const recapOut = el("recapOut");
  const recapHint = el("recapHint");

  const SITE_URL = window.location.href;

  // ======== alvo: próxima virada (ano atual -> ano+1) ========
  const now = new Date();
  const nextYear = now.getFullYear() + 1;
  const target = new Date(nextYear, 0, 1, 0, 0, 0); // local timezone
  yearHint.textContent = `${nextYear - 1} → ${nextYear}`;
  targetLabel.textContent = `Alvo: ${fmtDate(target)}`;

  // ======== modo foco (reduz animação) ========
  let focusMode = false;
  btnFocus?.addEventListener("click", () => {
    focusMode = !focusMode;
    btnFocus.setAttribute("aria-pressed", String(focusMode));
    btnFocus.textContent = focusMode ? "Modo foco: ON" : "Modo foco";
    FX.setReducedMotion(focusMode);
  });

  // ======== tela cheia ========
  btnFullscreen?.addEventListener("click", async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      // se der ruim, segue o jogo
    }
  });

  // ======== metas (localStorage) ========
  const LS_KEY = "virada_2026_goals_v1";

  function loadGoals() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      g1.value = data.g1 || "";
      g2.value = data.g2 || "";
      g3.value = data.g3 || "";
    } catch {}
  }

  function saveGoals() {
    const data = { g1: g1.value.trim(), g2: g2.value.trim(), g3: g3.value.trim() };
    localStorage.setItem(LS_KEY, JSON.stringify(data));
    saveHint.textContent = "Salvo ✅";
    setTimeout(() => (saveHint.textContent = ""), 1600);
  }

  function clearGoals() {
    g1.value = ""; g2.value = ""; g3.value = "";
    localStorage.removeItem(LS_KEY);
    saveHint.textContent = "Limpo.";
    setTimeout(() => (saveHint.textContent = ""), 1200);
  }

  btnSave?.addEventListener("click", saveGoals);
  btnClear?.addEventListener("click", clearGoals);
  loadGoals();

  // ======== Extras: nome/apelido ========
  const NICK_KEY = "virada_nick_v1";

  function loadNick() {
    try {
      const v = localStorage.getItem(NICK_KEY) || "";
      if (nick) nick.value = v;
    } catch {}
  }

  function saveNick() {
    const v = (nick?.value || "").trim();
    localStorage.setItem(NICK_KEY, v);
    nickHint.textContent = v ? `Salvo: ${v}` : "Nome apagado.";
    setTimeout(() => (nickHint.textContent = ""), 1600);
  }

  function clearNick() {
    localStorage.removeItem(NICK_KEY);
    if (nick) nick.value = "";
    nickHint.textContent = "Nome limpo.";
    setTimeout(() => (nickHint.textContent = ""), 1200);
  }

  btnNick?.addEventListener("click", saveNick);
  btnNickClear?.addEventListener("click", clearNick);
  loadNick();

  // ======== Extras: compartilhar + copiar ========
  btnShare?.addEventListener("click", async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: document.title,
          text: "Virada 2026 🎉",
          url: SITE_URL
        });
      } else {
        await navigator.clipboard.writeText(SITE_URL);
        copyHint.textContent = "Seu navegador não tem share — link copiado ✅";
        setTimeout(() => (copyHint.textContent = ""), 1600);
      }
    } catch {}
  });

  btnCopy?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(SITE_URL);
      copyHint.textContent = "Link copiado ✅";
      setTimeout(() => (copyHint.textContent = ""), 1400);
    } catch {
      copyHint.textContent = "Não deu pra copiar (permissão do navegador).";
      setTimeout(() => (copyHint.textContent = ""), 1800);
    }
  });

  // ======== Extras: QR Code real ========
  function renderQR() {
    try {
      if (!qrBox) return;
      if (typeof QRCode === "undefined") return; // caso o CDN falhe
      qrBox.innerHTML = "";
      // eslint-disable-next-line no-new
      new QRCode(qrBox, {
        text: SITE_URL,
        width: 220,
        height: 220,
        correctLevel: QRCode.CorrectLevel.M
      });
    } catch {}
  }
  renderQR();

  // ======== Extras: Retrospectiva 2025 ========
  const RECAP_KEY = "virada_recap_2025_v1";

  function loadRecap() {
    try {
      const raw = localStorage.getItem(RECAP_KEY);
      if (!raw) return;
      const d = JSON.parse(raw);
      r1.value = d.r1 || "";
      r2.value = d.r2 || "";
      r3.value = d.r3 || "";
      r4.value = d.r4 || "";
      r5.value = d.r5 || "";
      recapOut.value = d.out || "";
    } catch {}
  }

  function makeRecap() {
    const name = (localStorage.getItem(NICK_KEY) || "").trim();
    const lines = [
      `Retrospectiva 2025${name ? " — " + name : ""}`,
      `• Melhor momento: ${r1.value.trim() || "-"}`,
      `• Pior perrengue: ${r2.value.trim() || "-"}`,
      `• Maior aprendizado: ${r3.value.trim() || "-"}`,
      `• Coisa que eu larguei: ${r4.value.trim() || "-"}`,
      `• Quero em 2026: ${r5.value.trim() || "-"}`,
      ``,
      `Link da virada: ${SITE_URL}`
    ];
    const out = lines.join("\n");
    recapOut.value = out;

    localStorage.setItem(RECAP_KEY, JSON.stringify({
      r1: r1.value, r2: r2.value, r3: r3.value, r4: r4.value, r5: r5.value, out
    }));

    recapHint.textContent = "Recap gerado ✅";
    setTimeout(() => (recapHint.textContent = ""), 1400);
  }

  async function copyRecap() {
    try {
      if (!recapOut.value.trim()) makeRecap();
      await navigator.clipboard.writeText(recapOut.value);
      recapHint.textContent = "Recap copiado ✅";
      setTimeout(() => (recapHint.textContent = ""), 1400);
    } catch {
      recapHint.textContent = "Não deu pra copiar.";
      setTimeout(() => (recapHint.textContent = ""), 1600);
    }
  }

  function clearRecap() {
    r1.value = ""; r2.value = ""; r3.value = ""; r4.value = ""; r5.value = "";
    recapOut.value = "";
    localStorage.removeItem(RECAP_KEY);
    recapHint.textContent = "Limpo.";
    setTimeout(() => (recapHint.textContent = ""), 1200);
  }

  btnRecap?.addEventListener("click", makeRecap);
  btnRecapCopy?.addEventListener("click", copyRecap);
  btnRecapClear?.addEventListener("click", clearRecap);

  loadRecap();

  // ======== countdown ========
  let celebrated = false;

  function tick() {
    const n = new Date();
    nowLabel.textContent = `Agora: ${fmtDate(n)}`;

    let diff = target.getTime() - n.getTime();

    if (diff <= 0) {
      if (!celebrated) {
        celebrated = true;
        showHappyNewYear(nextYear);
        if (!focusMode) FX.burst(220);
      }
      diff = 0;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    dEl.textContent = String(days).padStart(2, "0");
    hEl.textContent = String(hours).padStart(2, "0");
    mEl.textContent = String(mins).padStart(2, "0");
    sEl.textContent = String(secs).padStart(2, "0");
  }

  function showHappyNewYear(y) {
    headline.textContent = `Feliz ${y} 🎉`;
    subline.textContent = "Virou. Sem pressa. Só vai.";
    message.innerHTML = `
      <div class="big">🎆</div>
      <div>
        <div class="msgTitle">Você chegou.</div>
        <div class="msgText">Agora é escolher uma coisa e fazer o próximo passo hoje (mesmo pequeno).</div>
      </div>
    `;
  }

  function fmtDate(date) {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, "0");
    const mi = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy} ${hh}:${mi}:${ss}`;
  }

  tick();
  setInterval(tick, 100);

  // ======== efeitos (confete leve) ========
  const FX = (() => {
    const canvas = document.getElementById("fx");
    const ctx = canvas.getContext("2d", { alpha: true });

    let W = 0, H = 0;
    let particles = [];
    let reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    function resize() {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      W = canvas.clientWidth = window.innerWidth;
      H = canvas.clientHeight = window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener("resize", resize);
    resize();

    function setReducedMotion(v) {
      reducedMotion = v;
      if (reducedMotion) particles = [];
    }

    const palette = [
      "rgba(17,19,24,0.35)",
      "rgba(99,102,241,0.35)",
      "rgba(16,185,129,0.30)",
      "rgba(245,158,11,0.28)",
      "rgba(236,72,153,0.26)"
    ];

    function burst(count = 180) {
      if (reducedMotion) return;
      const cx = W / 2;
      const cy = Math.min(H * 0.35, 280);

      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 2 + Math.random() * 6;
        particles.push({
          x: cx + (Math.random() - 0.5) * 50,
          y: cy + (Math.random() - 0.5) * 40,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 2,
          g: 0.08 + Math.random() * 0.08,
          r: 2 + Math.random() * 3.5,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.18,
          life: 240 + Math.random() * 120,
          c: palette[(Math.random() * palette.length) | 0]
        });
      }
    }

    function step() {
      if (!reducedMotion) {
        ctx.clearRect(0, 0, W, H);

        const next = [];
        for (const p of particles) {
          p.vy += p.g;
          p.x += p.vx;
          p.y += p.vy;
          p.rot += p.vr;
          p.life -= 1;

          p.vx *= 0.992;
          p.vy *= 0.992;

          if (p.life > 0 && p.y < H + 40) {
            next.push(p);
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.fillStyle = p.c;
            ctx.fillRect(-p.r, -p.r * 0.6, p.r * 2, p.r * 1.2);
            ctx.restore();
          }
        }
        particles = next;
      }
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);

    return { burst, setReducedMotion };
  })();

  // debug opcional
  window.__FX = FX;
})();
