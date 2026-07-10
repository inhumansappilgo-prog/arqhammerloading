(() => {
  "use strict";

  const root = document.documentElement;
  const progressBar = document.getElementById("boot-progress");
  const progressValue = document.getElementById("progress-value");
  const statusLabel = document.getElementById("status-label");
  const systemState = document.getElementById("system-state");
  const packetCounter = document.getElementById("packet-counter");
  const skipControl = document.getElementById("skip-control");
  const accessGranted = document.getElementById("access-granted");
  const logLines = [...document.querySelectorAll(".log-line")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  let alreadySeen = false;
  let loadComplete = document.readyState === "complete";
  let forcedCompletion = false;
  let completed = false;
  let progress = 0;
  let frameId = 0;
  let pointerFrame = 0;

  try {
    alreadySeen = sessionStorage.getItem("hammer-axial-boot") === "complete";
  } catch (_) {
    alreadySeen = false;
  }

  const minimumDuration = reducedMotion ? 180 : alreadySeen ? 1050 : 4400;
  const startedAt = performance.now();

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const easeOut = (value) => 1 - Math.pow(1 - value, 3);

  const updateLogs = (value) => {
    logLines.forEach((line) => {
      const threshold = Number(line.dataset.threshold || 0);
      if (value >= threshold) line.classList.add("is-visible");
    });
  };

  const updateStatus = (value) => {
    if (value < 22) statusLabel.textContent = "AUTENTICANDO OPERADOR";
    else if (value < 43) statusLabel.textContent = "SINCRONIZANDO REDE AXIAL";
    else if (value < 64) statusLabel.textContent = "DESCRIPTOGRAFANDO ARQUIVOS";
    else if (value < 82) statusLabel.textContent = "ISOLANDO CONTEÚDO VOLÁTIL";
    else if (value < 100) statusLabel.textContent = "COMPILANDO PROTOCOLO";
    else statusLabel.textContent = "PROTOCOLO LIBERADO";
  };

  const renderProgress = (value) => {
    const rounded = Math.round(clamp(value, 0, 100));
    root.style.setProperty("--progress-width", `${rounded}%`);
    root.style.setProperty("--signal-height", `${4 + (rounded * 0.16)}px`);
    progressValue.value = `${String(rounded).padStart(3, "0")}%`;
    progressBar.setAttribute("aria-valuenow", String(rounded));
    packetCounter.textContent = `PKT ${String(rounded * 47).padStart(4, "0")}`;
    updateLogs(rounded);
    updateStatus(rounded);
  };

  const completeBoot = () => {
    if (completed) return;
    completed = true;
    progress = 100;
    renderProgress(100);
    systemState.textContent = "OPERACIONAL";
    document.body.classList.add("is-ready");
    accessGranted.removeAttribute("aria-hidden");
    accessGranted.tabIndex = 0;
    skipControl.disabled = true;

    try {
      sessionStorage.setItem("hammer-axial-boot", "complete");
    } catch (_) {
      // A sequência continua funcional quando o armazenamento é bloqueado.
    }

    window.setTimeout(() => accessGranted.focus({ preventScroll: true }), reducedMotion ? 0 : 650);
  };

  const tick = (now) => {
    const elapsed = now - startedAt;
    const timeRatio = clamp(elapsed / minimumDuration, 0, 1);
    const simulatedTarget = easeOut(timeRatio) * 94;
    const canFinish = forcedCompletion || (loadComplete && elapsed >= minimumDuration);
    const target = canFinish ? 100 : simulatedTarget;
    const acceleration = forcedCompletion ? 0.28 : 0.075;

    progress += (target - progress) * acceleration;
    if (target === 100 && 100 - progress < 0.35) progress = 100;
    renderProgress(progress);

    if (progress >= 100) completeBoot();
    else frameId = window.requestAnimationFrame(tick);
  };

  const skipBoot = () => {
    forcedCompletion = true;
    systemState.textContent = "BYPASS AUTORIZADO";
    if (!frameId) frameId = window.requestAnimationFrame(tick);
  };

  window.addEventListener("load", () => {
    loadComplete = true;
  }, { once: true });

  skipControl.addEventListener("click", skipBoot);
  accessGranted.addEventListener("click", () => {
    try {
      sessionStorage.setItem("hammer-axial-boot", "complete");
    } catch (_) {}
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !completed) skipBoot();
    if (event.key === "Enter" && completed) accessGranted.click();
  });

  if (finePointer && !reducedMotion) {
    window.addEventListener("pointermove", (event) => {
      if (pointerFrame) return;
      pointerFrame = window.requestAnimationFrame(() => {
        const x = ((event.clientX / window.innerWidth) - 0.5) * 2;
        const y = ((event.clientY / window.innerHeight) - 0.5) * 2;
        root.style.setProperty("--pointer-x", `${(x * 3).toFixed(2)}px`);
        root.style.setProperty("--pointer-y", `${(y * 3).toFixed(2)}px`);
        root.style.setProperty("--tilt-x", `${(x * 0.55).toFixed(3)}deg`);
        root.style.setProperty("--tilt-y", `${(y * -0.45).toFixed(3)}deg`);
        root.style.setProperty("--grid-shift", `${(x * -7).toFixed(2)}px`);
        root.style.setProperty("--glow-x", `${(50 + (x * 3)).toFixed(2)}%`);
        root.style.setProperty("--glow-y", `${(48 + (y * 3)).toFixed(2)}%`);
        pointerFrame = 0;
      });
    }, { passive: true });
  }

  window.setTimeout(() => {
    if (!completed) skipBoot();
  }, reducedMotion ? 500 : 7600);

  frameId = window.requestAnimationFrame(tick);
})();
