(() => {
  "use strict";

  const restaurants = [
    {
      id: "kofookoo",
      name: "kofookoo",
      logo: "assets/kofookoo.webp",
      voucher: "gutscheine/Bjarne-Gutschein-kofookoo.pdf",
      voucherName: "Bjarne-Gutschein-kofookoo.pdf",
      url: "https://sushigrillbar.kofookoo.de/",
      copy: "Sushi, Grillgerichte und asiatische Kleinigkeiten per iPad – all you can enjoy."
    },
    {
      id: "mr-kao",
      name: "Mr Kao",
      logo: "assets/mr-kao.svg",
      voucher: "gutscheine/Bjarne-Gutschein-Mr-Kao.pdf",
      voucherName: "Bjarne-Gutschein-Mr-Kao.pdf",
      url: "https://www.instagram.com/mrkao.hamburg/",
      copy: "Korean BBQ direkt am Tisch: Fleisch, Gemüse, Banchan und ordentlich Feuer."
    },
    {
      id: "mr-cherng",
      name: "Mr. Cherng",
      logo: "assets/mr-cherng.png",
      voucher: "gutscheine/Bjarne-Gutschein-Mr-Cherng.pdf",
      voucherName: "Bjarne-Gutschein-Mr-Cherng.pdf",
      url: "https://www.mr-cherng.de/",
      copy: "Asiatisches Buffet mit Sushi, warmen Gerichten und WOK-BBQ im Herzen Hamburgs."
    }
  ];

  // Each restaurant appears twice, so all three have an equal 1/3 chance.
  const segments = [restaurants[0], restaurants[1], restaurants[2], restaurants[0], restaurants[1], restaurants[2]];
  const colors = ["#ffb347", "#626ee8", "#ef5b6c", "#48cdb0", "#ff875a", "#8f73e8"];
  const TAU = Math.PI * 2;
  const sliceAngle = TAU / segments.length;
  const storageKey = "bjarneBirthdayWheelResultV1";

  const wheel = document.getElementById("wheel");
  const ctx = wheel.getContext("2d");
  const spinButton = document.getElementById("spinButton");
  const spinStatus = document.getElementById("spinStatus");
  const unwrapButton = document.getElementById("unwrapButton");
  const resultDialog = document.getElementById("resultDialog");
  const closeDialog = document.getElementById("closeDialog");
  const shareButton = document.getElementById("shareButton");
  const resultLogo = document.getElementById("resultLogo");
  const resultHeading = document.getElementById("resultHeading");
  const resultText = document.getElementById("resultText");
  const restaurantLink = document.getElementById("restaurantLink");
  const voucherLink = document.getElementById("voucherLink");
  const confettiCanvas = document.getElementById("confetti");
  const confettiCtx = confettiCanvas.getContext("2d");

  const logoImages = new Map();
  let currentRotation = 0;
  let isSpinning = false;
  let savedRestaurant = null;

  function storageGet(key) {
    try { return window.localStorage.getItem(key); } catch { return null; }
  }

  function storageSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch { /* Storage can be blocked in private/file contexts. */ }
  }

  function storageRemove(key) {
    try { window.localStorage.removeItem(key); } catch { /* Nothing to remove. */ }
  }

  function setResolvedState(restaurant) {
    spinStatus.textContent = `Das Schicksal hat entschieden: ${restaurant.name}.`;
    spinButton.disabled = false;
    spinButton.querySelector(".spin-main").textContent = "Ergebnis ansehen";
    spinButton.querySelector(".spin-sub").textContent = restaurant.name;
  }

  function secureRandom(max) {
    if (window.crypto?.getRandomValues) {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      return array[0] % max;
    }
    return Math.floor(Math.random() * max);
  }

  function roundedRect(context, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + width, y, x + width, y + height, r);
    context.arcTo(x + width, y + height, x, y + height, r);
    context.arcTo(x, y + height, x, y, r);
    context.arcTo(x, y, x + width, y, r);
    context.closePath();
  }

  function preloadLogos() {
    return Promise.all(restaurants.map((restaurant) => new Promise((resolve) => {
      const image = new Image();
      image.onload = () => { logoImages.set(restaurant.id, image); resolve(); };
      image.onerror = resolve;
      image.src = restaurant.logo;
    })));
  }

  function drawWheel() {
    const size = wheel.width;
    const center = size / 2;
    const radius = center - 12;
    ctx.clearRect(0, 0, size, size);

    for (let i = 0; i < segments.length; i += 1) {
      const start = -Math.PI / 2 - sliceAngle / 2 + i * sliceAngle;
      const end = start + sliceAngle;
      const middle = start + sliceAngle / 2;

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = colors[i];
      ctx.fill();

      ctx.save();
      ctx.globalAlpha = .12;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.lineTo(center + Math.cos(start) * radius, center + Math.sin(start) * radius);
      ctx.stroke();
      ctx.restore();

      // Decorative dots near the rim.
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(middle);
      ctx.fillStyle = "rgba(255,255,255,.82)";
      ctx.beginPath();
      ctx.arc(radius * .91, 0, 6, 0, TAU);
      ctx.fill();
      ctx.restore();

      const restaurant = segments[i];
      const image = logoImages.get(restaurant.id);
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(middle + Math.PI / 2);
      const plateW = 205;
      const plateH = 92;
      const plateX = -plateW / 2;
      const plateY = -radius * .63 - plateH / 2;
      ctx.shadowColor = "rgba(0,0,0,.25)";
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 7;
      roundedRect(ctx, plateX, plateY, plateW, plateH, 20);
      ctx.fillStyle = "rgba(255,253,247,.97)";
      ctx.fill();
      ctx.shadowColor = "transparent";

      if (image && image.complete) {
        const maxW = plateW - 30;
        const maxH = plateH - 24;
        const scale = Math.min(maxW / image.naturalWidth, maxH / image.naturalHeight);
        const w = image.naturalWidth * scale;
        const h = image.naturalHeight * scale;
        ctx.drawImage(image, -w / 2, plateY + (plateH - h) / 2, w, h);
      } else {
        ctx.fillStyle = "#151a36";
        ctx.font = "900 25px system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(restaurant.name, 0, plateY + plateH / 2);
      }
      ctx.restore();
    }

    // Outer ring details.
    ctx.beginPath();
    ctx.arc(center, center, radius - 4, 0, TAU);
    ctx.strokeStyle = "rgba(255,255,255,.78)";
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(center, center, radius - 18, 0, TAU);
    ctx.strokeStyle = "rgba(24,23,45,.26)";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  function getRestaurantById(id) {
    return restaurants.find((restaurant) => restaurant.id === id) || null;
  }

  function showResult(restaurant, celebrate = true) {
    savedRestaurant = restaurant;
    resultLogo.src = restaurant.logo;
    resultLogo.alt = `${restaurant.name} Logo`;
    resultHeading.textContent = `${restaurant.name} wird es!`;
    resultText.textContent = restaurant.copy;
    restaurantLink.href = restaurant.url;
    voucherLink.href = restaurant.voucher;
    voucherLink.download = restaurant.voucherName;
    voucherLink.setAttribute("aria-label", `PDF-Gutschein für ${restaurant.name} herunterladen`);
    setResolvedState(restaurant);

    if (typeof resultDialog.showModal === "function") {
      resultDialog.showModal();
    } else {
      resultDialog.setAttribute("open", "");
    }
    if (celebrate) {
      launchConfetti();
      playResultChime();
    }
  }

  function startSpin() {
    if (isSpinning || savedRestaurant) return;
    isSpinning = true;
    spinButton.disabled = true;
    spinStatus.textContent = "Das Glücksrad dreht …";
    spinButton.querySelector(".spin-main").textContent = "Es dreht sich …";
    spinButton.querySelector(".spin-sub").textContent = "Daumen drücken";

    const chosenSegment = secureRandom(segments.length);
    const chosenRestaurant = segments[chosenSegment];
    const normalized = ((currentRotation % TAU) + TAU) % TAU;
    const targetNormalized = (TAU - (chosenSegment * sliceAngle) % TAU) % TAU;
    const extraTurns = 6 + secureRandom(3);
    const delta = ((targetNormalized - normalized + TAU) % TAU) + extraTurns * TAU;
    currentRotation += delta;

    playSpinTicks(5200);
    wheel.style.transition = "transform 5.2s cubic-bezier(.12,.72,.08,1)";
    wheel.style.transform = `rotate(${currentRotation}rad)`;

    window.setTimeout(() => {
      isSpinning = false;
      storageSet(storageKey, JSON.stringify({ id: chosenRestaurant.id, segment: chosenSegment }));
      showResult(chosenRestaurant, true);
    }, 5350);
  }

  function restoreSavedResult() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("reset") === "1") {
      storageRemove(storageKey);
      history.replaceState(null, "", window.location.pathname);
      return;
    }

    try {
      const saved = JSON.parse(storageGet(storageKey));
      const restaurant = getRestaurantById(saved?.id);
      if (!restaurant) return;
      savedRestaurant = restaurant;
      const segmentIndex = Number.isInteger(saved.segment)
        ? saved.segment
        : segments.findIndex((segment) => segment.id === restaurant.id);
      currentRotation = (TAU - (segmentIndex * sliceAngle) % TAU) % TAU;
      wheel.style.transform = `rotate(${currentRotation}rad)`;
      setResolvedState(restaurant);
    } catch {
      storageRemove(storageKey);
    }
  }

  function resizeConfetti() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    confettiCanvas.width = Math.floor(window.innerWidth * dpr);
    confettiCanvas.height = Math.floor(window.innerHeight * dpr);
    confettiCanvas.style.width = `${window.innerWidth}px`;
    confettiCanvas.style.height = `${window.innerHeight}px`;
    confettiCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function launchConfetti() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    resizeConfetti();
    const palette = ["#ffad42", "#ff6170", "#61e6c3", "#a88cff", "#fff2ad", "#ffffff"];
    const particles = Array.from({ length: 170 }, () => ({
      x: window.innerWidth * (.2 + Math.random() * .6),
      y: window.innerHeight * .28,
      vx: (Math.random() - .5) * 12,
      vy: -5 - Math.random() * 10,
      gravity: .22 + Math.random() * .13,
      drag: .992,
      size: 5 + Math.random() * 8,
      rotation: Math.random() * TAU,
      spin: (Math.random() - .5) * .28,
      color: palette[secureRandom(palette.length)],
      life: 0,
      maxLife: 170 + Math.random() * 70
    }));

    function frame() {
      confettiCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      let alive = 0;
      particles.forEach((particle) => {
        particle.life += 1;
        if (particle.life > particle.maxLife) return;
        alive += 1;
        particle.vx *= particle.drag;
        particle.vy = particle.vy * particle.drag + particle.gravity;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.spin;
        confettiCtx.save();
        confettiCtx.translate(particle.x, particle.y);
        confettiCtx.rotate(particle.rotation);
        confettiCtx.globalAlpha = Math.max(0, 1 - particle.life / particle.maxLife);
        confettiCtx.fillStyle = particle.color;
        confettiCtx.fillRect(-particle.size / 2, -particle.size / 3, particle.size, particle.size * .66);
        confettiCtx.restore();
      });
      if (alive > 0) requestAnimationFrame(frame);
      else confettiCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
    requestAnimationFrame(frame);
  }

  function getAudioContext() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    window.__birthdayAudio ||= new AudioCtx();
    return window.__birthdayAudio;
  }

  function tone(frequency, duration = .05, volume = .035, delay = 0) {
    const audio = getAudioContext();
    if (!audio) return;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0, audio.currentTime + delay);
    gain.gain.linearRampToValueAtTime(volume, audio.currentTime + delay + .008);
    gain.gain.exponentialRampToValueAtTime(.0001, audio.currentTime + delay + duration);
    oscillator.connect(gain).connect(audio.destination);
    oscillator.start(audio.currentTime + delay);
    oscillator.stop(audio.currentTime + delay + duration + .02);
  }

  function playSpinTicks(duration) {
    const start = performance.now();
    let count = 0;
    function schedule() {
      const elapsed = performance.now() - start;
      if (elapsed > duration - 250) return;
      tone(650 + (count % 3) * 35, .035, .018);
      count += 1;
      const progress = elapsed / duration;
      window.setTimeout(schedule, 70 + Math.pow(progress, 2.6) * 330);
    }
    schedule();
  }

  function playResultChime() {
    [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => tone(frequency, .4, .045, index * .11));
  }

  async function shareResult() {
    if (!savedRestaurant) return;
    const shareData = {
      title: "Bjarnes Geburtstags-Glücksrad",
      text: `Das Glücksrad hat entschieden: Wir gehen zu ${savedRestaurant.name}! 🎉🍽️`,
      url: window.location.href
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch { /* User cancelled. */ }
      return;
    }
    try {
      await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      shareButton.textContent = "In Zwischenablage kopiert ✓";
      window.setTimeout(() => { shareButton.textContent = "Ergebnis teilen"; }, 2200);
    } catch {
      shareButton.textContent = savedRestaurant.name;
    }
  }

  unwrapButton.addEventListener("click", () => {
    document.getElementById("gift").scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => spinButton.focus({ preventScroll: true }), 700);
  });
  spinButton.addEventListener("click", () => {
    if (savedRestaurant) showResult(savedRestaurant, false);
    else startSpin();
  });
  closeDialog.addEventListener("click", () => resultDialog.close());
  resultDialog.addEventListener("click", (event) => {
    if (event.target === resultDialog) resultDialog.close();
  });
  shareButton.addEventListener("click", shareResult);
  window.addEventListener("resize", resizeConfetti, { passive: true });

  preloadLogos().finally(() => {
    drawWheel();
    restoreSavedResult();
  });
})();
