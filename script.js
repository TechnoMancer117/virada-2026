// Virada 2026 (clean, confortável, sem barulho)
(() => {
  const el = (id) => document.getElementById(id);

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
  const btnSave = el("btnSave");
  const btnClear = el("btnClear");
  const saveHint = el("saveHint");

  const g1 = el("g1");
  const g2 = el("g2");
  const g3 = el("g3");

  // ======== alvo: próxima virada (ano atual -> ano+1) ========
  const now = new Date();
  const nextYear = now.getFullYear() + 1;
  const target = new Date(nextYear, 0, 1, 0, 0, 0); // local timezone
  yearHint.textContent = `${nextYear - 1} → ${nextYear}`;
  targetLabel.textContent = `Alvo: ${fmtDate(target)}`;

  // ======== modo foco (reduz animação) ========
  let focusMode = false;
  btnFocus.addEventListener("click", () => {
    focusMode = !focusMode;
    btnFocus.setAttribute("aria-pressed", String(focusMode));
    btnFocus.textContent = focusMode ? "Modo foco: ON" : "Modo foco";
    FX.setReducedMotion(focusMode);
  });

  // ======== tela cheia ========
  btnFullscreen.addEventListener("click", async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      // se der ruim, vida que segue
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

  btnSave.addEventListener("click", saveGoals);
  btnClear.addEventListener("click", clearGoals);
  loadGoals();

  // ======== countdown ========
  let celebrated = false;

  function tick() {
    const n = new Date();
    nowLabel.textContent = `Agora: ${fmtDate(n)}`;

    let diff = target.getTime() - n.getTime();

    if (diff <= 0) {
      // já virou
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

    dEl.textContent = pad2(days);
    hEl.textContent = pad2(hours);
    mEl.textContent = pad2(mins);
    sEl.textContent = pad2(secs);
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

  function pad2(n) {
    // dias pode passar de 99, então não força 2 em dias gigantes
    return String(n).padStart(2, "0");
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

  // tick suave (10x/s) pra virar certinho sem ficar “engasgado”
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

    // confete pastel bem discreto, fica ok no branco
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

          // leve “arrasto”
          p.vx *= 0.992;
          p.vy *= 0.992;

          if (p.life > 0 && p.y < H + 40) {
            next.push(p);
            // desenha
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

  // export global só pro debug (se quiser testar no console)
  window.__FX = FX;
})();
