const galeria = document.querySelector(".gallery");
const buscaInput = document.getElementById("busca");
const categoriaSelect = document.getElementById("categoria");

let modelos = [];

// =========================
// CARREGAR JSON
// =========================
fetch("modelos.json")
  .then(res => res.json())
  .then(data => {
    modelos = data;

    preencherCategorias();
    renderizar(modelos);
  })
  .catch(err => {
    console.error("Erro ao carregar JSON:", err);
  });

// =========================
// CATEGORIAS
// =========================
function preencherCategorias() {

  const categorias = [...new Set(modelos.map(m => m.categoria))];

  categorias.forEach(cat => {

    const option = document.createElement("option");

    option.value = cat;
    option.textContent = cat;

    categoriaSelect.appendChild(option);

  });

}

// =========================
// RENDERIZAÇÃO
// =========================
function renderizar(lista) {

  galeria.innerHTML = "";

  lista.forEach(modelo => {

    // =========================
    // IMAGENS
    // =========================
    const imagens = modelo.imagens && modelo.imagens.length > 0
      ? modelo.imagens
      : (
          modelo.imagem
            ? [modelo.imagem]
            : [
                "img/sem-imagem-1.png",
                "img/sem-imagem-2.png"
              ]
        );

    const card = document.createElement("div");

    card.classList.add("card");

    card.innerHTML = `
      <div class="carousel">

        ${imagens.map((img, i) => `
          <img
            src="${img}"
            class="slide ${i === 0 ? 'ativo' : ''}"
            alt="${modelo.nome}"
            onerror="this.src='img/sem-imagem-1.png'"
          >
        `).join("")}

        ${imagens.length > 1 ? `
          <button class="prev">‹</button>
          <button class="next">›</button>
        ` : ""}

      </div>

      <div class="card-content">

        <h3>${modelo.nome}</h3>

        <p>${modelo.descricao}</p>

        <p>
          <strong>Disciplina:</strong>
          ${modelo.categoria}
        </p>

        <a
          class="download"
          href="${modelo.download}"
          target="_blank"
        >
          Download STL
        </a>

      </div>
    `;

    galeria.appendChild(card);

  });

  iniciarCarrossel();

}

// =========================
// CARROSSEL
// =========================
function iniciarCarrossel() {

  document.querySelectorAll(".carousel").forEach(carousel => {

    const slides = carousel.querySelectorAll(".slide");

    // evita erro se tiver só 1
    if (slides.length <= 1) return;

    let index = 0;

    const mostrar = (i) => {

      slides.forEach(s =>
        s.classList.remove("ativo")
      );

      slides[i].classList.add("ativo");

    };

    // =========================
    // AUTO PLAY
    // =========================
    let intervalo = setInterval(() => {

      index = (index + 1) % slides.length;

      mostrar(index);

    }, 2500);

    // =========================
    // BOTÕES
    // =========================
    const next = carousel.querySelector(".next");
    const prev = carousel.querySelector(".prev");

    if (next) {

      next.onclick = () => {

        index = (index + 1) % slides.length;

        mostrar(index);

      };

    }

    if (prev) {

      prev.onclick = () => {

        index = (index - 1 + slides.length) % slides.length;

        mostrar(index);

      };

    }

    // =========================
    // PAUSA NO HOVER
    // =========================
    carousel.addEventListener("mouseenter", () => {

      clearInterval(intervalo);

    });

    carousel.addEventListener("mouseleave", () => {

      intervalo = setInterval(() => {

        index = (index + 1) % slides.length;

        mostrar(index);

      }, 2500);

    });

  });

}

// =========================
// FILTRO
// =========================
function filtrar() {

  const termo = buscaInput.value.toLowerCase();

  const categoria = categoriaSelect.value;

  const filtrados = modelos.filter(m =>

    (
      m.nome.toLowerCase().includes(termo)
      ||
      m.descricao.toLowerCase().includes(termo)
    )

    &&

    (
      categoria === "todas"
      ||
      m.categoria === categoria
    )

  );

  renderizar(filtrados);

}

// =========================
// EVENTOS
// =========================
buscaInput.addEventListener("input", filtrar);

categoriaSelect.addEventListener("change", filtrar);
