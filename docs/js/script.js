function ativarCarrossel() {

  document.querySelectorAll(".carousel").forEach(carousel => {

    let index = 0;
    const slides = carousel.querySelectorAll(".slide");

    const prev = carousel.querySelector(".prev");
    const next = carousel.querySelector(".next");

    let interval = null;

    function mostrar(i) {
      slides.forEach(s => s.classList.remove("ativo"));
      slides[i].classList.add("ativo");
    }

    function proximo() {
      index = (index + 1) % slides.length;
      mostrar(index);
    }

    // 🔹 AUTO PLAY só se tiver mais de 1 imagem
    if (slides.length > 1) {
      interval = setInterval(proximo, 2500);
    }

    // 🔹 BOTÕES
    if (next) {
      next.addEventListener("click", () => {
        index = (index + 1) % slides.length;
        mostrar(index);
      });
    }

    if (prev) {
      prev.addEventListener("click", () => {
        index = (index - 1 + slides.length) % slides.length;
        mostrar(index);
      });
    }

    // 🔹 HOVER (com proteção)
    carousel.addEventListener("mouseenter", () => {
      if (interval) clearInterval(interval);
    });

    carousel.addEventListener("mouseleave", () => {
      if (slides.length > 1) {
        interval = setInterval(proximo, 2500);
      }
    });

  });

}
