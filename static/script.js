// Utilities
function setTextIfExists(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }
  
  function showIfExists(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove("hidden");
  }
  
  function hideIfExists(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  }
  
  // 1) Greeting (Home only)
  function greetingFunc() {
    const greetingEl = document.getElementById("greeting");
    if (!greetingEl) return;
  
    const h = new Date().getHours();
  
    // Avoid overlaps: night first
    if (h < 5 || h >= 20) greetingEl.textContent = "Good night";
    else if (h < 12) greetingEl.textContent = "Good morning";
    else if (h < 18) greetingEl.textContent = "Good afternoon";
    else greetingEl.textContent = "Good evening";
  }
  
  // 2) Footer year (All pages)
  function addYear() {
    setTextIfExists("copyYear", String(new Date().getFullYear()));
  }
  
  // 3) Tickets reveal (Tickets page)
  function wireTicketsReveal() {
    const btn = document.getElementById("showTicketsBtn");
    const table = document.getElementById("ticketTable");
    if (!btn || !table) return;
  
    btn.addEventListener("click", () => {
      table.classList.remove("hidden");
      btn.classList.add("hidden");
    });
  }
  
  // 4) Read more / less (Home)
  function wireReadMore() {
    const moreBtn = document.getElementById("readMoreBtn");
    const lessBtn = document.getElementById("readLessBtn");
    const longText = document.getElementById("longIntro");
    if (!moreBtn || !lessBtn || !longText) return;
  
    moreBtn.addEventListener("click", () => {
      longText.classList.remove("hidden");
      moreBtn.classList.add("hidden");
      lessBtn.classList.remove("hidden");
    });
  
    lessBtn.addEventListener("click", () => {
      longText.classList.add("hidden");
      lessBtn.classList.add("hidden");
      moreBtn.classList.remove("hidden");
    });
  }
  
  // 5) Advice Slip API (Explore)
  async function getAdvice() {
    const adviceText = document.getElementById("adviceText");
    const adviceErr = document.getElementById("adviceErr");
  
    if (adviceErr) adviceErr.textContent = "";
    if (adviceText) adviceText.textContent = "Loading…";
  
    try {
      // Cache-buster avoids repeated cached responses
      const url = `https://api.adviceslip.com/advice?t=${Date.now()}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  
      const data = await res.json();
      const advice = data?.slip?.advice ?? "No advice found.";
  
      if (adviceText) adviceText.textContent = advice;
    } catch (e) {
      if (adviceText) adviceText.textContent = "Couldn’t load a curator note right now.";
      if (adviceErr) adviceErr.textContent = "Please try again in a moment.";
    }
  }
  
  function wireAdviceButton() {
    const btn = document.getElementById("adviceBtn");
    if (!btn) return;
    btn.addEventListener("click", getAdvice);
  }
  
  // 6) Checkout email “check” (simple client-side feedback)
  function wireEmailCheck() {
    const btn = document.getElementById("checkEmailBtn");
    const input = document.getElementById("email");
    const msg = document.getElementById("emailMsg");
    if (!btn || !input || !msg) return;
  
    btn.addEventListener("click", () => {
      const v = input.value.trim();
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      msg.textContent = ok ? "Email looks valid." : "Please enter a valid email (example: you@domain.com).";
    });
  }
  
  // 7) ZIP lookup (Visit page) - public API
  async function lookupZip(zip) {
    const out = document.getElementById("zipResult");
    if (!out) return;
  
    out.textContent = "Checking…";
  
    try {
      const res = await fetch(`https://api.zippopotam.us/us/${encodeURIComponent(zip)}`);
      if (!res.ok) throw new Error("ZIP not found");
  
      const data = await res.json();
      const place = data?.places?.[0];
      if (!place) throw new Error("No place");
  
      out.textContent = `${zip} is ${place["place name"]}, ${place["state abbreviation"]}.`;
    } catch {
      out.textContent = "Couldn’t find that ZIP code. Try another (US ZIP only).";
    }
  }
  
  function wireZipLookup() {
    const btn = document.getElementById("zipBtn");
    const input = document.getElementById("zipInput");
    if (!btn || !input) return;
  
    btn.addEventListener("click", () => {
      const zip = input.value.trim();
      if (!/^\d{5}$/.test(zip)) {
        const out = document.getElementById("zipResult");
        if (out) out.textContent = "Enter a 5-digit ZIP code.";
        return;
      }
      lookupZip(zip);
    });
  }
  
  // 8) Prevent form submit (demo)
  function wireCheckoutSubmit() {
    const form = document.getElementById("checkoutForm");
    if (!form) return;
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Demo checkout submitted (no real payment).");
    });
  }

  function initCheckoutFriction() {
    const checkbox = document.getElementById("confirmPolicy");
    const humanCheck = document.getElementById("humanCheck");
    const msg = document.getElementById("humanMsg");
    const submitBtn = document.getElementById("submitBtn");
  
    // Only run on checkout page
    if (!checkbox || !humanCheck || !submitBtn) return;
  
    function validate() {
      const checked = checkbox.checked;
      const answer = humanCheck.value.trim();
      const humanOk = answer === "7";
  
      if (msg) {
        if (answer.length === 0) msg.textContent = "";
        else msg.textContent = humanOk ? "Looks good." : "Please enter the correct answer.";
      }
  
      submitBtn.disabled = !(checked && humanOk);
    }
  
    checkbox.addEventListener("change", validate);
    humanCheck.addEventListener("input", validate);
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    initCheckoutFriction();
  });
  

  
  // Boot
  document.addEventListener("DOMContentLoaded", () => {
    greetingFunc();
    addYear();
  
    wireTicketsReveal();
    wireReadMore();
    wireAdviceButton();
    wireEmailCheck();
    wireZipLookup();
    wireCheckoutSubmit();
  });
  