/* Moumi weds Arnab — wedding invitation
   Everything you might want to change is in CONFIG. */
const CONFIG = {
  // Countdown target. The card only says "evening", so 6:00 PM IST is assumed. Change if needed.
  weddingStart: "2026-11-26T18:00:00+05:30",
  weddingHours: 4,                       // length of the calendar event
  venueName: "Asmi Banquet",
  venueAddress: "Bhorer Alo Apartment, 287 N. S. Road, New Barrackpore, North 24 Parganas, Kolkata 700131 (beside Krishty Auditorium)",
  musicVolume: 0.7,
};

(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const start = new Date(CONFIG.weddingStart);
  if (reduced) document.querySelectorAll("animateTransform").forEach((a) => a.remove());

  /* ---------- Bengali numerals ---------- */
  const BN = ["০","১","২","৩","৪","৫","৬","৭","৮","৯"];
  const bn = (n) => String(n).replace(/\d/g, (d) => BN[d]);

  /* ---------- Music ---------- */
  const audio = $("#bgm");
  const musicBtn = $("#musicBtn");
  let wantPlaying = false;

  function setMusicUI(on) {
    musicBtn.classList.toggle("playing", on);
    musicBtn.setAttribute("aria-pressed", String(on));
    musicBtn.setAttribute("aria-label", on ? "Pause music" : "Play music");
  }
  async function play() {
    try { audio.volume = CONFIG.musicVolume; await audio.play(); wantPlaying = true; setMusicUI(true); }
    catch (e) { wantPlaying = false; setMusicUI(false); }
  }
  function pause() { audio.pause(); wantPlaying = false; setMusicUI(false); }
  musicBtn.addEventListener("click", () => (audio.paused ? play() : pause()));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { if (!audio.paused) audio.pause(); }
    else if (wantPlaying) audio.play().catch(() => {});
  });

  /* ---------- Gate + flower shower ---------- */
  const gate = $("#gate");
  const html = document.documentElement;
  function shower() {
    if (reduced) return;
    const box = $("#petals");
    const colors = ["#f0a81c", "#f6c744", "#e8731a", "#d9341f", "#f9d976"];
    const N = window.innerWidth < 600 ? 34 : 60;
    for (let i = 0; i < N; i++) {
      const p = document.createElement("span");
      const size = 9 + Math.random() * 11;
      p.style.cssText =
        `left:${Math.random() * 100}%;width:${size}px;height:${size * 1.35}px;` +
        `background:${colors[(Math.random() * colors.length) | 0]};` +
        `--dx:${(Math.random() - 0.5) * 160}px;--rot:${(Math.random() < 0.5 ? -1 : 1) * (240 + Math.random() * 420)}deg;` +
        `--dur:${5.5 + Math.random() * 4}s;--delay:${0.5 + Math.random() * 3.2}s;`;
      box.appendChild(p);
    }
    setTimeout(() => (box.textContent = ""), 12500);
  }
  function openGate() {
    gate.classList.add("open");
    musicBtn.hidden = false;
    play();
    shower();
    window.scrollTo(0, 0);
    setTimeout(() => {
      gate.style.display = "none";
      html.classList.remove("gated");
    }, reduced ? 50 : 2200);
  }
  $("#openBtn").addEventListener("click", openGate);
  $("#openBtn").focus({ preventScroll: true });

  /* ---------- Countdown ---------- */
  const units = { d: $('[data-u="d"]'), h: $('[data-u="h"]'), m: $('[data-u="m"]'), s: $('[data-u="s"]') };
  const countEl = $("#count");
  const msgEl = $("#countMsg");
  const endMs = start.getTime() + CONFIG.weddingHours * 3600 * 1000;

  function tick() {
    const now = Date.now();
    const diff = start.getTime() - now;
    if (diff <= 0) {
      countEl.hidden = true; msgEl.hidden = false;
      msgEl.innerHTML = now < endMs
        ? 'আজ আমাদের শুভবিবাহ<small>Today is the day. See you at the wedding!</small>'
        : 'আপনাদের আশীর্বাদের জন্য ধন্যবাদ<small>Thank you for your blessings.</small>';
      return false;
    }
    const s = Math.floor(diff / 1000);
    units.d.textContent = bn(Math.floor(s / 86400));
    units.h.textContent = bn(Math.floor((s % 86400) / 3600));
    units.m.textContent = bn(Math.floor((s % 3600) / 60));
    units.s.textContent = bn(s % 60);
    return true;
  }
  if (tick()) {
    const t = setInterval(() => { if (!tick()) clearInterval(t); }, 1000);
  }

  /* ---------- Add to calendar (.ics) ---------- */
  const fmt = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  $("#calBtn").addEventListener("click", () => {
    const end = new Date(endMs);
    const esc = (t) => t.replace(/[\\,;]/g, (m) => "\\" + m);
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Moumi weds Arnab//Invitation//EN", "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      "UID:moumi-arnab-wedding-" + fmt(start) + "@invitation",
      "DTSTAMP:" + fmt(new Date()),
      "DTSTART:" + fmt(start),
      "DTEND:" + fmt(end),
      "SUMMARY:" + esc("Moumi weds Arnab - Shubho Bibaho"),
      "LOCATION:" + esc(CONFIG.venueName + ", " + CONFIG.venueAddress),
      "DESCRIPTION:" + esc("Wedding of Moumi and Arnab. Your blessings and presence will make our day complete."),
      "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", "DESCRIPTION:Moumi weds Arnab is tomorrow evening", "END:VALARM",
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url; a.download = "moumi-arnab-wedding.ics";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  });

  /* ---------- Share ---------- */
  $("#shareBtn").addEventListener("click", async () => {
    const url = location.href.split("#")[0];
    const title = "মৌমি ও অর্ণব-এর শুভবিবাহ | Moumi weds Arnab";
    const text = "আপনাকে সাদর আমন্ত্রণ — ২৬ নভেম্বর ২০২৬, সন্ধ্যায়।\nYou are warmly invited to our wedding, 26 November 2026.";
    if (navigator.share) {
      try { await navigator.share({ title, text, url }); return; } catch (e) { if (e.name === "AbortError") return; }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(text + "\n" + url)}`, "_blank", "noopener");
  });
})();
