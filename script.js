/* Script común para index/creadores/eras
   - Maneja carrusel modal (mostrar/ocultar)
   - Navegación prev/next
   - Autoplay con pausa on hover
   - Scroll reveal simple
*/

(() => {
  // Scroll reveal
  const revealEls = document.querySelectorAll(".scroll-reveal");
  function revealOnScroll(){
    revealEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80) el.classList.add("visible");
    });
  }
  window.addEventListener("scroll", revealOnScroll);
  window.addEventListener("load", revealOnScroll);
  revealOnScroll();

  // Carousel modal logic
  const modal = document.getElementById("modalCarousel");
  const btnShow = document.getElementById("btnVerCreadores");
  const btnClose = document.getElementById("closeCarousel");

  // If modal exists on this page set handlers; otherwise skip gracefully
  if (modal) {
    const slides = Array.from(modal.querySelectorAll(".carousel-slide"));
    const prevBtn = modal.querySelector(".prev");
    const nextBtn = modal.querySelector(".next");

    let current = slides.findIndex(s => s.classList.contains("active"));
    if (current === -1) current = 0;
    let intervalId = null;
    const AUTOPLAY_MS = 3800;

    function showSlide(n) {
      slides.forEach((s, i) => {
        s.classList.toggle("active", i === n);
      });
      current = n;
    }

    function next() { showSlide((current + 1) % slides.length); }
    function prev() { showSlide((current - 1 + slides.length) % slides.length); }

    function startAuto() {
      stopAuto();
      intervalId = setInterval(next, AUTOPLAY_MS);
    }
    function stopAuto() {
      if (intervalId) { clearInterval(intervalId); intervalId = null; }
    }

    // Buttons
    if (nextBtn) nextBtn.addEventListener("click", () => { next(); startAuto(); });
    if (prevBtn) prevBtn.addEventListener("click", () => { prev(); startAuto(); });

    // Hover pause
    modal.addEventListener("mouseover", stopAuto);
    modal.addEventListener("mouseout", startAuto);

    // Close button
    if (btnClose) btnClose.addEventListener("click", () => {
      modal.classList.add("hidden");
      modal.setAttribute("aria-hidden", "true");
      stopAuto();
    });

    // Show button (may not exist on all pages)
    if (btnShow) {
      btnShow.addEventListener("click", (e) => {
        e.preventDefault();
        modal.classList.remove("hidden");
        modal.setAttribute("aria-hidden", "false");
        // ensure first slide visible
        showSlide(0);
        startAuto();
      });
    }

    // Keyboard navigation when modal open
    document.addEventListener("keydown", (e) => {
      if (modal.classList.contains("hidden")) return;
      if (e.key === "ArrowRight") { next(); startAuto(); }
      if (e.key === "ArrowLeft") { prev(); startAuto(); }
      if (e.key === "Escape") { modal.classList.add("hidden"); stopAuto(); }
    });

    // Initialize: ensure only one active slide
    showSlide(current);
  }
})();
