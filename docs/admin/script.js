document.addEventListener("DOMContentLoaded", function () {

    // ======================================================
    // ELEMENTOS
    // ======================================================

    const form = document.getElementById("modeloForm");

    const resultado = document.getElementById("resultado");
    const jsonOutput = document.getElementById("jsonOutput");

    const copiarBtn = document.getElementById("copiar");
    const baixarBtn = document.getElementById("baixar");
    const limparBtn = document.getElementById("limpar");

    const tipoGerado = document.getElementById("tipoGerado");
    const status = document.getElementById("status");

    const campoImagemUnica =
        document.getElementById("imagemUnica");

    const campoImagens =
        document.getElementById("imagensMultiplas");

    const listaImagens =
        document.getElementById("listaImagens");

    const adicionarImagemBtn =
        document.getElementById("adicionarImagem");


    // ======================================================
    // DISCIPLINA
    // ======================================================

    const categoriaSelect =
        document.getElementById("categoria");

    const novaDisciplinaArea =
        document.getElementById("novaDisciplinaArea");

    const novaDisciplinaInput =
        document.getElementById("novaDisciplina");


    // ======================================================
    // IMAGENS PADRÃO
    // ======================================================

    const imagensDefault = [
        "img/sem-imagem-1.png",
        "img/sem-imagem-2.png"
    ];


    // ======================================================
    // CONVERTER LINK DO GOOGLE DRIVE - DOWNLOAD
    // ======================================================
    //
    // Esta função continua sendo usada somente
    // para arquivos de download.
    //
    // Outros links permanecem intactos.
    //

    function converterLinkGoogleDrive(link) {

        if (!link) {
            return link;
        }


        // --------------------------------------------------
        // Formato:
        // https://drive.google.com/file/d/ID/view
        // --------------------------------------------------

        const matchFile = link.match(
            /drive\.google\.com\/file\/d\/([^/]+)/
        );


        if (matchFile) {

            const id = matchFile[1];

            return `https://drive.google.com/uc?export=download&id=${id}`;

        }


        // --------------------------------------------------
        // Formato:
        // https://drive.google.com/open?id=ID
        // --------------------------------------------------

        const matchOpen = link.match(
            /drive\.google\.com\/open\?id=([^&]+)/
        );


        if (matchOpen) {

            const id = matchOpen[1];

            return `https://drive.google.com/uc?export=download&id=${id}`;

        }


        // --------------------------------------------------
        // Se não for Google Drive,
        // mantém o link original.
        // --------------------------------------------------

        return link;

    }


    // ======================================================
    // CONVERTER LINK DO GOOGLE DRIVE - IMAGEM
    // ======================================================
    //
    // Diferente do download, a imagem precisa de uma
    // URL que possa ser utilizada diretamente pelo <img>.
    //
    // Se não for Google Drive, o link permanece intacto.
    //

    function converterLinkGoogleDriveImagem(link) {

        if (!link) {
            return link;
        }


        // --------------------------------------------------
        // Formato:
        // https://drive.google.com/file/d/ID/view
        // --------------------------------------------------

        const matchFile = link.match(
            /drive\.google\.com\/file\/d\/([^/]+)/
        );


        if (matchFile) {

            const id = matchFile[1];

            return `https://drive.google.com/uc?export=view&id=${id}`;

        }


        // --------------------------------------------------
        // Formato:
        // https://drive.google.com/open?id=ID
        // --------------------------------------------------

        const matchOpen = link.match(
            /drive\.google\.com\/open\?id=([^&]+)/
        );


        if (matchOpen) {

            const id = matchOpen[1];

            return `https://drive.google.com/uc?export=view&id=${id}`;

        }


        // --------------------------------------------------
        // Formato:
        // https://drive.google.com/uc?...&id=ID
        //
        // Se alguém já tiver colocado um link de download
        // do Drive, também transformamos para visualização.
        // --------------------------------------------------

        const matchUC = link.match(
            /drive\.google\.com\/uc\?[^#]*id=([^&]+)/
        );


        if (matchUC) {

            const id = matchUC[1];

            return `https://drive.google.com/uc?export=view&id=${id}`;

        }


        // --------------------------------------------------
        // Se não for Google Drive,
        // mantém o link original.
        // --------------------------------------------------

        return link;

    }


    // ======================================================
    // NOVA DISCIPLINA
    // ======================================================

    if (
        categoriaSelect &&
        novaDisciplinaArea &&
        novaDisciplinaInput
    ) {

        categoriaSelect.addEventListener(
            "change",
            function () {

                if (categoriaSelect.value === "__nova__") {

                    novaDisciplinaArea.classList.remove(
                        "hidden"
                    );

                    novaDisciplinaInput.required = false;

                    novaDisciplinaInput.focus();

                } else {

                    novaDisciplinaArea.classList.add(
                        "hidden"
                    );

                    novaDisciplinaInput.required = false;

                    novaDisciplinaInput.value = "";

                }

            }
        );

    }


    // ======================================================
    // ALTERAR TIPO DE IMAGEM
    // ======================================================

    const tiposImagem =
        document.querySelectorAll(
            'input[name="tipoImagem"]'
        );


    tiposImagem.forEach(radio => {

        radio.addEventListener(
            "change",
            function () {

                if (this.value === "uma") {

                    campoImagemUnica.classList.remove(
                        "hidden"
                    );

                    campoImagens.classList.add(
                        "hidden"
                    );

                } else {

                    campoImagemUnica.classList.add(
                        "hidden"
                    );

                    campoImagens.classList.remove(
                        "hidden"
                    );


                    // Cria o primeiro campo caso ainda não exista

                    if (
                        listaImagens.children.length === 0
                    ) {

                        adicionarCampoImagem();

                    }

                }

            }
        );

    });


    // ======================================================
    // ADICIONAR CAMPO DE IMAGEM
    // ======================================================

    function adicionarCampoImagem() {

        const campo =
            document.createElement("div");

        campo.classList.add(
            "campo-imagem"
        );


        campo.innerHTML = `
            <input
                type="text"
                class="imagem-input"
                placeholder="https://... ou img/nome-do-arquivo.png"
            >

            <button
                type="button"
                class="btn btn-danger btn-remover-imagem"
                title="Remover imagem"
            >
                ×
            </button>
        `;


        listaImagens.appendChild(campo);


        // --------------------------------------------------
        // Botão remover
        // --------------------------------------------------

        const removerBtn =
            campo.querySelector(
                ".btn-remover-imagem"
            );


        removerBtn.addEventListener(
            "click",
            function () {

                campo.remove();

            }
        );

    }


    // ======================================================
    // BOTÃO ADICIONAR IMAGEM
    // ======================================================

    adicionarImagemBtn.addEventListener(
        "click",
        function () {

            adicionarCampoImagem();

        }
    );


    // ======================================================
    // GERAR JSON
    // ======================================================

    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            // ==================================================
            // DADOS PRINCIPAIS
            // ==================================================

            const nome =
                document
                    .getElementById("nome")
                    .value
                    .trim();


            const descricao =
                document
                    .getElementById("descricao")
                    .value
                    .trim();


            // ==================================================
            // DISCIPLINA
            // ==================================================

            let categoria = "";


            if (
                categoriaSelect.value === "__nova__"
            ) {

                // ----------------------------------------------
                // NOVA DISCIPLINA
                // ----------------------------------------------

                categoria =
                    novaDisciplinaInput.value.trim();


                // ----------------------------------------------
                // Validação
                // ----------------------------------------------

                if (!categoria) {

                    novaDisciplinaInput.focus();

                    status.textContent =
                        "Digite o nome da nova disciplina.";

                    return;

                }

            } else {

                // ----------------------------------------------
                // DISCIPLINA EXISTENTE
                // ----------------------------------------------

                categoria =
                    categoriaSelect.value.trim();

            }


            // ==================================================
            // DOWNLOAD
            // ==================================================

            const downloadInformado =
                document
                    .getElementById("download")
                    .value
                    .trim();


            // --------------------------------------------------
            // Continua convertendo somente o download
            // --------------------------------------------------

            const download =
                converterLinkGoogleDrive(
                    downloadInformado
                );


            // ==================================================
            // TIPO DE IMAGEM
            // ==================================================

            const tipoSelecionado =
                document.querySelector(
                    'input[name="tipoImagem"]:checked'
                ).value;


            // ==================================================
            // CRIAR OBJETO
            // ==================================================

            const modelo = {

                nome: nome,

                descricao: descricao

            };


            // ==================================================
            // IMAGEM ÚNICA
            // ==================================================

            if (
                tipoSelecionado === "uma"
            ) {

                const imagemInformada =
                    document
                        .getElementById("imagem")
                        .value
                        .trim();


                if (imagemInformada !== "") {

                    // --------------------------------------------------
                    // Converte somente se for Google Drive.
                    // URLs externas e imagens locais permanecem iguais.
                    // --------------------------------------------------

                    modelo.imagem =
                        converterLinkGoogleDriveImagem(
                            imagemInformada
                        );

                } else {

                    modelo.imagens = [
                        ...imagensDefault
                    ];

                }

            }


            // ==================================================
            // MÚLTIPLAS IMAGENS
            // ==================================================

            else {

                const campos =
                    listaImagens.querySelectorAll(
                        ".imagem-input"
                    );


                const imagens =
                    Array.from(campos)

                        .map(
                            input =>
                                input.value.trim()
                        )

                        .filter(
                            imagem =>
                                imagem !== ""
                        )

                        // --------------------------------------------------
                        // Converte cada imagem individualmente.
                        // --------------------------------------------------
                        .map(
                            imagem =>
                                converterLinkGoogleDriveImagem(
                                    imagem
                                )
                        );


                if (
                    imagens.length === 0
                ) {

                    modelo.imagens = [
                        ...imagensDefault
                    ];

                } else {

                    modelo.imagens =
                        imagens;

                }

            }


            // ==================================================
            // CATEGORIA E DOWNLOAD
            // ==================================================

            modelo.categoria =
                categoria;

            modelo.download =
                download;


            // ==================================================
            // GERAR JSON
            // ==================================================

            const json =
                JSON.stringify(
                    modelo,
                    null,
                    2
                );


            jsonOutput.value =
                json;


            // ==================================================
            // MOSTRAR RESULTADO
            // ==================================================

            resultado.classList.remove(
                "hidden"
            );


            // ==================================================
            // INDICADOR
            // ==================================================

            if (modelo.imagem) {

                tipoGerado.textContent =
                    "Imagem única";

            } else {

                tipoGerado.textContent =
                    `${modelo.imagens.length} imagens`;

            }


            // ==================================================
            // STATUS
            // ==================================================

            status.textContent =
                "JSON gerado com sucesso! Revise os dados antes de adicioná-lo ao repositório.";


            // ==================================================
            // ROLAR ATÉ RESULTADO
            // ==================================================

            resultado.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        }
    );


    // ======================================================
    // COPIAR JSON
    // ======================================================

    copiarBtn.addEventListener(
        "click",
        async function () {

            const texto =
                jsonOutput.value;


            if (!texto) {

                status.textContent =
                    "Não há JSON para copiar.";

                return;

            }


            try {

                await navigator.clipboard.writeText(
                    texto
                );


                copiarBtn.textContent =
                    "✓ Copiado!";


                status.textContent =
                    "JSON copiado para a área de transferência.";


                setTimeout(
                    () => {

                        copiarBtn.textContent =
                            "Copiar JSON";

                    },
                    2000
                );


            } catch (erro) {

                // Compatibilidade com navegadores antigos

                jsonOutput.select();

                document.execCommand(
                    "copy"
                );


                copiarBtn.textContent =
                    "✓ Copiado!";


                status.textContent =
                    "JSON copiado para a área de transferência.";


                setTimeout(
                    () => {

                        copiarBtn.textContent =
                            "Copiar JSON";

                    },
                    2000
                );

            }

        }
    );


    // ======================================================
    // BAIXAR JSON
    // ======================================================

    baixarBtn.addEventListener(
        "click",
        function () {

            const conteudo =
                jsonOutput.value;


            if (!conteudo) {

                status.textContent =
                    "Não há JSON para baixar.";

                return;

            }


            const arquivo =
                new Blob(

                    [conteudo],

                    {
                        type:
                            "application/json;charset=utf-8"
                    }

                );


            const url =
                URL.createObjectURL(
                    arquivo
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                url;

            link.download =
                "modelo.json";


            document.body.appendChild(
                link
            );


            link.click();


            document.body.removeChild(
                link
            );


            URL.revokeObjectURL(
                url
            );


            status.textContent =
                "Arquivo modelo.json baixado com sucesso.";

        }
    );


    // ======================================================
    // LIMPAR
    // ======================================================

    limparBtn.addEventListener(
        "click",
        function () {

            form.reset();


            // --------------------------------------------------
            // Voltar para imagem única
            // --------------------------------------------------

            campoImagemUnica.classList.remove(
                "hidden"
            );

            campoImagens.classList.add(
                "hidden"
            );


            // --------------------------------------------------
            // Limpar múltiplas imagens
            // --------------------------------------------------

            listaImagens.innerHTML =
                "";


            // --------------------------------------------------
            // Limpar nova disciplina
            // --------------------------------------------------

            novaDisciplinaArea.classList.add(
                "hidden"
            );

            novaDisciplinaInput.required =
                false;

            novaDisciplinaInput.value =
                "";


            // --------------------------------------------------
            // Esconder resultado
            // --------------------------------------------------

            resultado.classList.add(
                "hidden"
            );


            // --------------------------------------------------
            // Limpar JSON
            // --------------------------------------------------

            jsonOutput.value =
                "";


            // --------------------------------------------------
            // Limpar status
            // --------------------------------------------------

            status.textContent =
                "";


            // --------------------------------------------------
            // Restaurar botão
            // --------------------------------------------------

            copiarBtn.textContent =
                "Copiar JSON";

        }
    );

});

