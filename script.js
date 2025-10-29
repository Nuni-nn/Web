/* ===== Clock ===== */
function startClock() {
  const el = document.getElementById("clock");
  if (!el) return;
  const tick = () => {
    const now = new Date();
    el.textContent = now.toLocaleString(undefined, {
      dateStyle: "long",
      timeStyle: "medium",
    });
  };
  tick();
  setInterval(tick, 1000);
}

/* ===== Background Color Changer ===== */
(function setupColorChanger() {
  const btn = document.getElementById("changeBgBtn");
  if (!btn) return;
  const colors = ["#0b0e16", "#1b2430", "#222", "#2c1a1a", "#16302b", "#3b1a40"];
  btn.addEventListener("click", () => {
    const color = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.backgroundColor = color;
  });
})();

/* ===== Popup ===== */
(function setupPopup() {
  const open = document.getElementById("openPopup");
  const overlay = document.getElementById("popupOverlay");
  const close = document.getElementById("closePopup");
  if (!open || !overlay || !close) return;

  open.addEventListener("click", () => overlay.classList.add("show"));
  close.addEventListener("click", () => overlay.classList.remove("show"));
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.classList.remove("show");
  });
})();

/* ===== Accordion ===== */
(function setupAccordion() {
  const acc = document.querySelectorAll(".accordion-item .accordion-header");
  if (!acc.length) return;
  acc.forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".accordion-item");
      item.classList.toggle("open");
      const panel = item.querySelector(".accordion-panel");
      panel.style.maxHeight = item.classList.contains("open")
        ? panel.scrollHeight + "px"
        : null;
    });
  });
})();

/* ===== Contact Form Validation ===== */
(function setupContactFormValidation() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const nameEl = form.querySelector("#name");
  const emailEl = form.querySelector("#email");
  const msgEl = form.querySelector("#msg");

  const setError = (input, message) => {
    const wrap = input.closest(".field");
    wrap.classList.add("has-error");
    wrap.querySelector(".error-hint").textContent = message;
  };

  const clearError = (input) => {
    const wrap = input.closest(".field");
    wrap.classList.remove("has-error");
    wrap.querySelector(".error-hint").textContent = "";
  };

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;

    clearError(nameEl);
    if (!nameEl.value.trim()) {
      setError(nameEl, "Please enter your name");
      ok = false;
    }

    clearError(emailEl);
    if (!emailEl.value.trim()) {
      setError(emailEl, "Please enter your email");
      ok = false;
    } else if (!isEmail(emailEl.value.trim())) {
      setError(emailEl, "Invalid email format");
      ok = false;
    }

    clearError(msgEl);
    if (!msgEl.value.trim() || msgEl.value.trim().length < 10) {
      setError(msgEl, "Message must be at least 10 characters");
      ok = false;
    }

    if (ok) {
      alert("Form submitted successfully!");
      form.reset();
    }
  });
})();

/* ===== Navbar Keyboard Navigation ===== */
(function enhanceNavbarKeyboardNav() {
  document.addEventListener("DOMContentLoaded", () => {
    const navContainer = document.querySelector("#mainNavbar");
    if (!navContainer) return;
    const links = navContainer.querySelectorAll("a.nav-link, a.navbar-brand");
    links.forEach((a, idx) => {
      a.setAttribute("tabindex", "0");
      a.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          const dir = e.key === "ArrowRight" ? 1 : -1;
          const next = (idx + dir + links.length) % links.length;
          links[next].focus();
        }
      });
    });
  });
})();

/* ===== Reveal on Scroll ===== */
(function revealOnScroll() {
  const addRevealTargets = () => {
    const items = document.querySelectorAll(".card, section, .list-group, .accordion, .container, .row");
    items.forEach(el => el.classList.add("reveal"));
  };
  const setupObserver = () => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));
  };
  document.addEventListener("DOMContentLoaded", () => {
    addRevealTargets();
    setupObserver();
  });
})();

/* ===== Hidden Control Panel ===== */
document.addEventListener("DOMContentLoaded", () => {
  const settingsBtn = document.createElement("button");
  settingsBtn.id = "settingsToggle";
  settingsBtn.className = "settings-btn";
  settingsBtn.innerHTML = "⚙️";
  document.body.appendChild(settingsBtn);

  const panel = document.createElement("div");
  panel.id = "a6-panel";
  panel.className = "a6-panel shadow hidden";
  panel.innerHTML = `
    <div class="a6-row">
      <label for="a6-theme" class="a6-label">Theme</label>
      <select id="a6-theme" class="a6-input">
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
    <div class="a6-row">
      <button id="a6-accent" class="a6-btn">Random Accent</button>
      <button id="a6-reset" class="a6-btn">Reset</button>
    </div>
    <div class="a6-row">
      <label class="a6-label" for="a6-name">Greeting</label>
      <input id="a6-name" class="a6-input" type="text" placeholder="Enter your name" />
      <button id="a6-save-name" class="a6-btn">Save</button>
      <p id="a6-greeting" class="mt-2"></p>
    </div>
    <div class="a6-row small">Press <kbd>T</kbd> to toggle theme</div>
    <div class="a6-row">
      <label class="a6-label">Sound</label>
      <button id="a6-snd-bg" class="a6-btn" aria-pressed="false">BG</button>
      <button id="a6-snd-ui" class="a6-btn" aria-pressed="true">UI</button>
    </div>
  `;
  document.body.appendChild(panel);

  settingsBtn.addEventListener("click", () => {
    panel.classList.toggle("hidden");
  });

 /* ===== THEME with LocalStorage Save ===== */
const themeSelect = panel.querySelector("#a6-theme");

let systemMQ, systemListener;

function setDomTheme(mode) {
  const html = document.documentElement;
  if (mode === "light" || mode === "dark") {
    html.dataset.theme = mode;
    html.setAttribute("data-bs-theme", mode);
  } else {
    delete html.dataset.theme;
    html.removeAttribute("data-bs-theme");
  }
}

function applySystemThemeOnce() {
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setDomTheme(isDark ? "dark" : "light");
}

function enableSystemFollow() {
  applySystemThemeOnce();
  systemMQ = window.matchMedia("(prefers-color-scheme: dark)");
  systemListener = (e) => setDomTheme(e.matches ? "dark" : "light");
  if (typeof systemMQ.addEventListener === "function") {
    systemMQ.addEventListener("change", systemListener);
  } else {
    systemMQ.addListener(systemListener);
  }
}

function disableSystemFollow() {
  if (!systemMQ || !systemListener) return;
  if (typeof systemMQ.removeEventListener === "function") {
    systemMQ.removeEventListener("change", systemListener);
  } else {
    systemMQ.removeListener(systemListener);
  }
  systemMQ = null;
  systemListener = null;
}

function applyTheme(mode) {
  if (mode === "system") {
    enableSystemFollow();
  } else {
    disableSystemFollow();
    setDomTheme(mode);
  }
  localStorage.setItem("themeMode", mode);
}

const savedTheme = localStorage.getItem("themeMode");
if (savedTheme) {
  themeSelect.value = savedTheme;
  applyTheme(savedTheme);
} else {
  applyTheme(themeSelect.value || "system");
}

themeSelect.addEventListener("change", (e) => {
  applyTheme(e.target.value);
});


  /* Accent */
  const accentBtn = panel.querySelector("#a6-accent");
  const resetBtn = panel.querySelector("#a6-reset");
  const setAccent = (hex) => document.documentElement.style.setProperty("--accent", hex);
  const randomHex = () => "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
  accentBtn.addEventListener("click", () => setAccent(randomHex()));
  resetBtn.addEventListener("click", () => {
    document.documentElement.style.removeProperty("--accent");
    themeSelect.value = "system";
    applyTheme("system");
  });

  /* Greeting */
  const nameInput = panel.querySelector("#a6-name");
  const saveBtn = panel.querySelector("#a6-save-name");
  const greeting = panel.querySelector("#a6-greeting");
  const savedName = localStorage.getItem("userName");
  if (savedName) {
    greeting.textContent = `Welcome back, ${savedName}!`;
    nameInput.value = savedName;
  }
  saveBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    if (!name) {
      greeting.textContent = "Please enter your name.";
      return;
    }
    localStorage.setItem("userName", name);
    greeting.textContent = `Welcome, ${name}!`;
  });

  /* Sound */
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  let ctx, bgNode, bgGain;
  const ensureCtx = () => (ctx ||= new AudioCtx());
  const playClick = () => {
    const uiBtn = document.getElementById("a6-snd-ui");
    if (!uiBtn || uiBtn.getAttribute("aria-pressed") !== "true") return;
    const ac = ensureCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "square";
    osc.frequency.value = 660;
    gain.gain.value = 0.05;
    osc.connect(gain).connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + 0.06);
  };
  const toggleBG = () => {
    const bgBtn = document.getElementById("a6-snd-bg");
    const on = bgBtn.getAttribute("aria-pressed") === "true";
    if (on) {
      bgBtn.setAttribute("aria-pressed", "false");
      if (bgNode) { try { bgNode.stop(); } catch {} bgNode.disconnect(); bgNode = null; }
      if (bgGain) { bgGain.disconnect(); bgGain = null; }
      return;
    }
    const ac = ensureCtx();
    const osc = ac.createOscillator();
    const filt = ac.createBiquadFilter();
    bgGain = ac.createGain();
    osc.type = "sine";
    osc.frequency.value = 220;
    filt.type = "lowpass";
    filt.frequency.value = 800;
    bgGain.gain.value = 0.02;
    osc.connect(filt).connect(bgGain).connect(ac.destination);
    osc.start();
    bgNode = osc;
    bgBtn.setAttribute("aria-pressed", "true");
  };
  const bgBtn = panel.querySelector("#a6-snd-bg");
  const uiBtn = panel.querySelector("#a6-snd-ui");
  bgBtn.addEventListener("click", () => { toggleBG(); playClick(); });
  uiBtn.addEventListener("click", () => {
    const state = uiBtn.getAttribute("aria-pressed") === "true";
    uiBtn.setAttribute("aria-pressed", String(!state));
    playClick();
  });
});

/* ===== Start Clock ===== */
document.addEventListener("DOMContentLoaded", startClock);

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("changeBgBtn");
  if (!btn) return;

  const backgrounds = [
    "url('castle.jpg') center/cover no-repeat fixed",
    "url('flowers.jpg') center/cover no-repeat fixed",
    "url('balkon.jpg') center/cover no-repeat fixed",
    "url('dancehall.jpg') center/cover no-repeat fixed"
  ];

  btn.addEventListener("click", () => {
    const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    document.body.style.background = randomBg;
    document.body.style.transition = "background 1s ease";
  });
});

// ===== Live Search (filter + highlight) =====
(function setupLiveSearch() {
  const input = document.getElementById('searchInput');
  const list  = document.getElementById('searchList');
  const stat  = document.getElementById('searchStatus');
  if (!input || !list) return;

  const items = [...list.querySelectorAll('li')];

  const highlight = (el, q) => {
    const text = el.getAttribute('data-raw') ?? el.textContent;
    el.setAttribute('data-raw', text); 
    if (!q) { el.innerHTML = text; return; }
    const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig');
    el.innerHTML = text.replace(re, '<mark class="search-hit">$1</mark>');
  };

  const doFilter = () => {
    const q = input.value.trim();
    let shown = 0;
    items.forEach(li => {
      const txt = (li.getAttribute('data-raw') ?? li.textContent).toLowerCase();
      const match = !q || txt.includes(q.toLowerCase());
      li.style.display = match ? '' : 'none';
      if (match) { shown++; }
      highlight(li, q);
    });
    if (stat) {
      stat.textContent = q
        ? (shown ? `Found: ${shown}` : 'No results')
        : '';
    }
  };

  input.addEventListener('input', doFilter);
  doFilter(); 
})();

// ===== Random Counter Update =====
document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".count");

  function animateValue(el, start, end, duration = 1000) {
    const range = end - start;
    let startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      el.textContent = Math.floor(start + range * progress);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function updateRandomly() {
    counters.forEach((el) => {
      const current = parseInt(el.textContent, 10) || 0;

      const min = current - Math.floor(Math.random() * 10);
      const max = current + Math.floor(Math.random() * 20);


      const next = Math.floor(Math.random() * (max - min + 1)) + min;
      animateValue(el, current, next, 1200);
    });
  }

  setInterval(updateRandomly, 5000);
});

/* ===== Story Search across multiple pages ===== */
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("novelSearch");
  const btn   = document.getElementById("novelSearchBtn");
  const box   = document.getElementById("novelResults");
  if (!input || !box) return;

  const NOVEL_PAGES = [
    "1page.html","2page.html","3page.html","4page.html","5page.html","6page.html","7page.html",
    "8pagehappyend.html","8pagebadend.html"
  ];

  let INDEX = [];

  (async function buildIndex(){
    const parser = new DOMParser();
    const jobs = NOVEL_PAGES.map(async (url) => {
      try {
        const res  = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(res.status);
        const html = await res.text();
        const doc  = parser.parseFromString(html, "text/html");

        const story = (doc.querySelector(".container_page")?.innerText
                    || doc.querySelector(".container")?.innerText
                    || doc.body.innerText || "")
                    .replace(/\s+/g, " ").trim();

        const title = doc.querySelector("title")?.textContent || url;

        INDEX.push({ url, title, body: story.toLowerCase(), raw: story });
      } catch (e) {
        console.warn("Index skip:", url, e);
      }
    });
    await Promise.all(jobs);
  })();

  // Поиск
  function searchDocs(q){
    q = q.trim().toLowerCase();
    if (!q) return [];
    const words = q.split(/\s+/);

    const scored = INDEX.map(d => {
      let score = 0;
      for (const w of words) if (d.body.includes(w)) score++;
      const idx = d.body.indexOf(q);
      return { ...d, score, idx };
    }).filter(x => x.score > 0);

    scored.sort((a,b) => (b.score - a.score) || (a.idx - b.idx));
    return scored.slice(0, 10);
  }

  function makeSnippet(text, q, idx){
    if (idx < 0) idx = text.toLowerCase().indexOf(q.toLowerCase());
    const start = Math.max(0, idx - 70);
    const end   = Math.min(text.length, idx + q.length + 70);
    let snip = (start>0?'…':'') + text.slice(start, end) + (end<text.length?'…':'');
    // подсветка
    const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, "ig");
    snip = snip.replace(re, "<mark>$1</mark>");
    return snip;
  }

  function render(q){
    const items = searchDocs(q);
    if (!items.length){
      box.innerHTML = q ? `<div class="story-result">Nothing found for “<b>${q}</b>”.</div>` : "";
      return;
    }
    box.innerHTML = items.map(it => `
      <div class="story-result" role="option">
        <a href="${it.url}">${it.title}</a>
        <div class="story-snippet">${makeSnippet(it.raw, q, it.idx)}</div>
      </div>
    `).join("");
  }

  const debounce = (fn, ms=250) => { let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a),ms); }; };
  input.addEventListener("input", debounce(()=>render(input.value), 250));
  btn?.addEventListener("click", ()=>render(input.value));

  input.addEventListener("keydown", (e)=>{
    if (e.key === "Enter") { e.preventDefault(); render(input.value); }
  });
});

/* ===== Global Background  ===== */
(function globalBackground() {
  const BG_KEY = "bgUrl";
  const candidates = [
    "castle.jpg",
    "flowers.jpg",
    "balkon.jpg",
    "dancehall.jpg"
  ];

  function applyBg(url) {
    document.documentElement.style.setProperty("--bg-url", `url("${url}")`);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem(BG_KEY);
    applyBg(saved || "castle.jpg");

    const btn = document.getElementById("changeBgBtn");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const current = (localStorage.getItem(BG_KEY) || "castle.jpg").replace(/^.*\(|\)|"|'/g,"");
      let next;
      do { next = candidates[Math.floor(Math.random() * candidates.length)]; }
      while (candidates.length > 1 && next === current);

      localStorage.setItem(BG_KEY, next);
      applyBg(next);
    });
  });
})();

/* ===== Global Background Music Control with resume ===== */
(function backgroundMusic() {
  const SRC = "music.mp3"; 
  const STATE_KEY = "bgmState";     
  const VOL_KEY   = "bgmVol";       
  const TIME_KEY  = "bgmTime";      

  const bgm = new Audio(SRC);
  bgm.loop = true;
  bgm.preload = "auto";

  const savedVol = parseFloat(localStorage.getItem(VOL_KEY));
  if (!isNaN(savedVol)) bgm.volume = savedVol;

  let savedTime = parseFloat(localStorage.getItem(TIME_KEY));
  if (isNaN(savedTime) || savedTime < 0) savedTime = 0;

  const btnOn  = document.querySelector(".control-btn[title='Sound On']");
  const btnOff = document.querySelector(".control-btn[title='Mute']");

  async function toggleMusic(on) {
    if (on) {
      localStorage.setItem(STATE_KEY, "on");
      try {
        if (!isNaN(bgm.duration)) {
          bgm.currentTime = Math.min(savedTime, bgm.duration - 0.25);
        }
        await bgm.play();
      } catch (e) {
        console.warn("Autoplay blocked:", e);
      }
    } else {
      localStorage.setItem(STATE_KEY, "off");
      bgm.pause();
    }
  }

  bgm.addEventListener("loadedmetadata", () => {
    if (localStorage.getItem(STATE_KEY) === "on") {
      bgm.currentTime = Math.min(savedTime, bgm.duration - 0.25);
    }
  });

  // экономно сохраняем позицию (раз в ~500 мс)
  let tSave = 0;
  bgm.addEventListener("timeupdate", () => {
    const now = performance.now();
    if (now - tSave > 500) {
      try { localStorage.setItem(TIME_KEY, String(bgm.currentTime)); } catch {}
      tSave = now;
    }
  });
  const saveNow = () => {
    try { localStorage.setItem(TIME_KEY, String(bgm.currentTime)); } catch {}
  };
  document.addEventListener("visibilitychange", saveNow);
  window.addEventListener("beforeunload", saveNow);

  if (btnOn)  btnOn.addEventListener("click", () => toggleMusic(true));
  if (btnOff) btnOff.addEventListener("click", () => toggleMusic(false));

  if (localStorage.getItem(STATE_KEY) === "on") {
    document.addEventListener("pointerdown", () => toggleMusic(true), { once: true });
    toggleMusic(true);
  }

})();
