// Minimal progressive enhancement
document.addEventListener('DOMContentLoaded', () => {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Update coord clock on the hero
  const clock = document.querySelector('[data-utc]');
  if (clock) {
    const tick = () => {
      const d = new Date();
      const hh = String(d.getUTCHours()).padStart(2, '0');
      const mm = String(d.getUTCMinutes()).padStart(2, '0');
      const ss = String(d.getUTCSeconds()).padStart(2, '0');
      clock.textContent = `${hh}:${mm}:${ss} UTC`;
    };
    tick(); setInterval(tick, 1000);
  }
});
