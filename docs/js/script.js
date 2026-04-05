const galeria = document.querySelector(".gallery");
const buscaInput = document.getElementById("busca");
const categoriaSelect = document.getElementById("categoria");

let modelos = [];

// 🔹 Carregar JSON
fetch("modelos.json")
  .then(res => res.json())
  .then(data => {
    modelos = data;

    preencherCategorias();
    renderizar(modelos);
  });

// 🔹 Criar categorias automaticamente
function preencherCategorias() {
  const categorias = [...new Set(modelos.map(m => m.categoria))];

  categorias.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoriaSelect.appendChild(option);
  });
}

// 🔹 Renderizar modelos
function renderizar(lista) {
  galeria.innerHTML = "";

  lista.forEach(modelo => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${modelo.imagem}" alt="${modelo.nome}">

      <div class="card-content">
        <h3>${modelo.nome}</h3>
        <p>${modelo.descricao}</p>
        <p><strong>Disciplina:</strong> ${modelo.categoria}</p>

        <a class="download" href="${modelo.download}">
          Download STL
        </a>
      </div>
    `;

    galeria.appendChild(card);
  });
}

// 🔹 Filtro combinado (busca + categoria)
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
