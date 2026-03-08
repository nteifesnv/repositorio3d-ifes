fetch("modelos.json")
.then(response => response.json())
.then(data => {

const gallery = document.getElementById("gallery");

data.forEach(modelo => {

const card = document.createElement("div");
card.className = "card";

card.innerHTML = `

<img src="${modelo.imagem}">

<div class="card-content">

<h3>${modelo.nome}</h3>

<p>${modelo.descricao}</p>

<p><strong>Disciplina:</strong> ${modelo.categoria}</p>

<a class="download" href="${modelo.download}" target="_blank">

Download STL

</a>

</div>

`;

gallery.appendChild(card);

});

});
