const galeria = document.querySelector(".gallery");
const buscaInput = document.getElementById("busca");
const categoriaSelect = document.getElementById("categoria");

let modelos = [];

// =========================
// CORES AUTOMÁTICAS
// =========================
//
// Essas cores serão usadas somente
// para disciplinas que ainda não
// possuem uma cor definida no CSS.
//

const coresAutomaticas = [
  {
    fundo: "#e8def8",
    texto: "#663399",
    borda: "#cdb9e8"
  },
  {
    fundo: "#dff0e8",
    texto: "#26734d",
    borda: "#b8dbc8"
  },
  {
    fundo: "#fde2e2",
    texto: "#a83232",
    borda: "#efbcbc"
  },
  {
    fundo: "#e1effa",
    texto: "#24658f",
    borda: "#bdd7eb"
  },
  {
    fundo: "#fff0dc",
    texto: "#a05a00",
    borda: "#efd0a5"
  },
  {
    fundo: "#e9e5d8",
    texto: "#70643a",
    borda: "#d5ceb4"
  },
  {
    fundo: "#f4e1f0",
    texto: "#8a3d78",
    borda: "#dfc1d8"
  },
  {
    fundo: "#dff4f2",
    texto: "#18756d",
    borda: "#b9dfdc"
  }
];


// =========================
// CATEGORIAS COM CORES FIXAS
// =========================
//
// Essas são as categorias que já
// possuem cores definidas no CSS.
// As disciplinas foram escolhidas
// por acaso (as que lembrei ...)

const categoriasComCor = [
  "biologia",
  "fisica",
  "geografia",
  "geologia",
  "historia",
  "matematica",
  "quimica",
  "arte",
  "ciencia",
  "educacao",
  "outros"
];


// =========================
// GERAR COR AUTOMÁTICA
// =========================
//
// A cor é calculada a partir do
// nome da disciplina.
//
// Dessa forma:
//
// "Robótica" → sempre terá a mesma cor
//
// "Matemática" → sempre terá a mesma cor
//
// Não muda ao recarregar a página.
//

function obterCorAutomatica(categoria) {

  let valor = 0;

  for (let i = 0; i < categoria.length; i++) {

    valor =
      categoria.charCodeAt(i) +
      ((valor << 5) - valor);

  }

  const indice =
    Math.abs(valor) % coresAutomaticas.length;

  return coresAutomaticas[indice];

}


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

    console.error(
      "Erro ao carregar JSON:",
      err
    );

  });


// =========================
// CATEGORIAS
// =========================

function preencherCategorias() {

  const categorias = [...new Set(

    modelos
      .map(m => m.categoria)
      .filter(Boolean)

  )].sort((a, b) =>

    a.localeCompare(
      b,
      "pt-BR",
      {
        sensitivity: "base"
      }
    )

  );


  categorias.forEach(cat => {

    const option =
      document.createElement("option");

    option.value = cat;

    option.textContent = cat;

    categoriaSelect.appendChild(option);

  });

}


// =========================
// CRIAR CLASSE DA CATEGORIA
// =========================

function classeCategoria(categoria) {

  return categoria

    .toLowerCase()

    .normalize("NFD")

    .replace(
      /[\u0300-\u036f]/g,
      ""
    )

    .replace(
      /[^a-z0-9]+/g,
      "-"
    )

    .replace(
      /^-+|-+$/g,
      ""
    );

}


// =========================
// RENDERIZAÇÃO
// =========================

function renderizar(lista) {

  galeria.innerHTML = "";


  // =========================
  // ORDENAR MODELOS
  // =========================
  //
  // Cria uma cópia da lista antes
  // de ordenar.
  //
  // Assim, a ordem original do
  // modelos.json não é alterada.
  //
  // A ordenação é feita pelo nome
  // do modelo, respeitando o
  // português e ignorando diferenças
  // entre maiúsculas/minúsculas.
  //

  const listaOrdenada =
    [...lista].sort((a, b) =>

      (a.nome || "").localeCompare(
        b.nome || "",
        "pt-BR",
        {
          sensitivity: "base"
        }
      )

    );


  listaOrdenada.forEach(modelo => {


    // =========================
    // IMAGENS
    // =========================

    const imagens =
      modelo.imagens &&
      modelo.imagens.length > 0

        ? modelo.imagens

        : (

          modelo.imagem

            ? [modelo.imagem]

            : [
                "img/sem-imagem-1.png",
                "img/sem-imagem-2.png"
              ]

        );


    // =========================
    // CATEGORIA
    // =========================

    const categoria =
      modelo.categoria || "Outros";


    const classeCat =
      classeCategoria(categoria);


    // =========================
    // VERIFICAR COR
    // =========================
    //
    // Se a categoria já possui
    // classe no CSS, não é feito nada.
    //
    // Se for uma categoria nova,
    // uma cor automática será aplicada.
    //

    const categoriaConhecida =
      categoriasComCor.includes(
        classeCat
      );


    const estiloAutomatico =
      categoriaConhecida
        ? ""
        : obterEstiloAutomatico(
            categoria
          );


    // =========================
    // CARD
    // =========================

    const card =
      document.createElement("div");

    card.classList.add("card");


    card.innerHTML = `

      <div class="carousel">

        ${imagens.map((img, i) => `

          <img
            src="${img}"
            class="slide ${i === 0 ? "ativo" : ""}"
            alt="${modelo.nome}"
            onerror="this.src='img/sem-imagem-1.png'"
          >

        `).join("")}


        ${imagens.length > 1 ? `

          <button
            class="prev"
            aria-label="Imagem anterior"
          >
            ‹
          </button>

          <button
            class="next"
            aria-label="Próxima imagem"
          >
            ›
          </button>

        ` : ""}

      </div>


      <div class="card-content">

        <h3>
          ${modelo.nome}
        </h3>


        <p class="descricao">
          ${modelo.descricao}
        </p>


        <div class="card-footer">

          <div
            class="categoria-badge categoria-${classeCat}"
            ${estiloAutomatico}
          >
            ${categoria}
          </div>


          <a
            class="download"
            href="${modelo.download}"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download STL
          </a>

        </div>

      </div>

    `;


    galeria.appendChild(card);

  });


  iniciarCarrossel();

}


// =========================
// ESTILO AUTOMÁTICO
// =========================

function obterEstiloAutomatico(categoria) {

  const cor =
    obterCorAutomatica(categoria);


  return `
    style="
      background: ${cor.fundo};
      color: ${cor.texto};
      border-color: ${cor.borda};
    "
  `;

}


// =========================
// CARROSSEL
// =========================

function iniciarCarrossel() {

  document
    .querySelectorAll(".carousel")
    .forEach(carousel => {


      const slides =
        carousel.querySelectorAll(
          ".slide"
        );


      // Evita erro se tiver
      // apenas uma imagem

      if (slides.length <= 1) return;


      let index = 0;


      const mostrar = (i) => {

        slides.forEach(slide =>

          slide.classList.remove(
            "ativo"
          )

        );


        slides[i].classList.add(
          "ativo"
        );

      };


      // =========================
      // AUTO PLAY
      // =========================

      let intervalo =
        setInterval(() => {

          index =
            (index + 1) %
            slides.length;

          mostrar(index);

        }, 2500);


      // =========================
      // BOTÕES
      // =========================

      const next =
        carousel.querySelector(
          ".next"
        );

      const prev =
        carousel.querySelector(
          ".prev"
        );


      if (next) {

        next.onclick = () => {

          index =
            (index + 1) %
            slides.length;

          mostrar(index);

        };

      }


      if (prev) {

        prev.onclick = () => {

          index =
            (index - 1 +
              slides.length) %
            slides.length;

          mostrar(index);

        };

      }


      // =========================
      // PAUSA NO HOVER
      // =========================

      carousel.addEventListener(
        "mouseenter",
        () => {

          clearInterval(
            intervalo
          );

        }
      );


      carousel.addEventListener(
        "mouseleave",
        () => {

          intervalo =
            setInterval(() => {

              index =
                (index + 1) %
                slides.length;

              mostrar(index);

            }, 2500);

        }
      );

    });

}


// =========================
// FILTRO
// =========================

function filtrar() {

  const termo =
    buscaInput.value.toLowerCase();


  const categoria =
    categoriaSelect.value;


  const filtrados =
    modelos.filter(m =>

      (

        m.nome
          .toLowerCase()
          .includes(termo)

        ||

        m.descricao
          .toLowerCase()
          .includes(termo)

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

buscaInput.addEventListener(
  "input",
  filtrar
);


categoriaSelect.addEventListener(
  "change",
  filtrar
);

