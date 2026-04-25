const galeria = document.querySelector(".gallery");
const buscaInput = document.getElementById("busca");
const categoriaSelect = document.getElementById("categoria");

let modelos = [];

// Carregar JSON
fetch("modelos.json")
  .then(res => res.json())
  .then(data => {
    modelos = data;

    preencherCategorias();
    renderizar(modelos);
  });

// Criar categorias automaticamente
function preencherCategorias() {
  const categorias = [...new Set(modelos.map(m => m.categoria))];

  categorias.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoriaSelect.appendChild(option);
  });
}

// Renderizar modelos 
function renderizar(lista) {
  galeria.innerHTML = "";

  lista.forEach(modelo => {

    // Suporte a imagem única OU múltiplas
    const imagens = modelo.imagens 
      ? modelo.imagens 
      : (modelo.imagem ? [modelo.imagem] : ["img/placeholder.png"]);

    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="carousel">
        ${imagens.map((img, i) => `
          <img src="${img}" class="slide ${i === 0 ? 'ativo' : ''}">
        `).join("")}

        ${imagens.length > 1 ? `
          <button class="prev">‹</button>
          <button class="next">›</button>
        ` : ""}
      </div>

      <div class="card-content">
        <h3>${modelo.nome}</h3>
        <p>${modelo.descricao}</p>
        <p><strong>Disciplina:</strong> ${modelo.categoria}</p>

        <a class="download" href="${modelo.download}" target="_blank">
          Download STL
        </a>
      </div>
    `;

    galeria.appendChild(card);
  });

  ativarCarrossel();
}

// Carrossel
function ativarCarrossel() {

  document.querySelectorAll(".carousel").forEach(carousel => {

    let index = 0;
    const slides = carousel.querySelectorAll(".slide");

    const prev = carousel.querySelector(".prev");
    const next = carousel.querySelector(".next");

    function mostrar(i) {
      slides.forEach(s => s.classList.remove("ativo"));
      slides[i].classList.add("ativo");
    }

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

  });

}

// Filtro combinado (busca + categoria)
function filtrar() {
  const termo = buscaInput.value.toLowerCase();
  const categoria = categoriaSelect.value;

  const filtrados = modelos.filter(m => {
    const matchTexto =
      m.nome.toLowerCase().includes(termo) ||
      m.descricao.toLowerCase().includes(termo);

    const matchCategoria =
      categoria === "todas" || m.categoria === categoria;

    return matchTexto && matchCategoria;
  });

  renderizar(filtrados);
}

// 🔹 Eventos
buscaInput.addEventListener("input", filtrar);
categoriaSelect.addEventListener("change", filtrar);
