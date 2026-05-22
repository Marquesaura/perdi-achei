const form = document.getElementById("formObjeto");
const mensagem = document.getElementById("mensagem");
const listaRegistros = document.getElementById("listaRegistros");
const totalRegistros = document.getElementById("totalRegistros");
const botoesFiltro = document.querySelectorAll(".filtro");
const btnAtualizar = document.getElementById("btnAtualizar");

let registros = [];
let filtroAtual = "todos";

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = `mensagem ${tipo}`;
}

function limparMensagemDepoisDeAlgunsSegundos() {
  setTimeout(() => {
    mensagem.textContent = "";
    mensagem.className = "mensagem";
  }, 4500);
}

function iconeDoObjeto(nome) {
  const texto = String(nome).toLowerCase();

  if (texto.includes("fone")) return "🎧";
  if (texto.includes("chave")) return "🔑";
  if (texto.includes("mochila")) return "🎒";
  if (texto.includes("carteira")) return "👛";
  if (texto.includes("celular")) return "📱";
  if (texto.includes("livro")) return "📚";
  if (texto.includes("óculos") || texto.includes("oculos")) return "👓";
  if (texto.includes("garrafa")) return "🧴";

  return "📦";
}

function formatarData(dataISO) {
  if (!dataISO) return "Data não informada";

  const partes = dataISO.split("-");
  if (partes.length !== 3) return dataISO;

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function escaparHTML(valor) {
  return String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderizarRegistros() {
  const registrosFiltrados = filtroAtual === "todos"
    ? registros
    : registros.filter((item) => item.tipo === filtroAtual);

  totalRegistros.textContent = registros.length;

  listaRegistros.innerHTML = "";

  if (registrosFiltrados.length === 0) {
    listaRegistros.innerHTML = "<p>Nenhum registro encontrado para este filtro.</p>";
    return;
  }

  registrosFiltrados.forEach((item) => {
    const div = document.createElement("div");
    div.className = "item";

    div.innerHTML = `
      <div class="item-img">${iconeDoObjeto(item.objeto)}</div>
      <div>
        <span class="tag ${escaparHTML(item.tipo)}">${escaparHTML(item.tipo).toUpperCase()}</span>
        <h3>${escaparHTML(item.objeto)}</h3>
        <p><strong>Local:</strong> ${escaparHTML(item.local)}</p>
        <p><strong>Data:</strong> ${formatarData(escaparHTML(item.data))}</p>
        <p><strong>Descrição:</strong> ${escaparHTML(item.descricao)}</p>
        <p><strong>Contato:</strong> ${escaparHTML(item.contato)}</p>
        <p><strong>Registrado em:</strong> ${escaparHTML(item.criado_em || "Não informado")}</p>
      </div>
    `;

    listaRegistros.appendChild(div);
  });
}

async function carregarRegistros() {
  try {
    const resposta = await fetch("listar.php", {
      method: "GET",
      cache: "no-store"
    });

    if (!resposta.ok) {
      throw new Error("Erro ao carregar registros.");
    }

    const dados = await resposta.json();

    registros = Array.isArray(dados) ? dados : [];
    renderizarRegistros();
  } catch (erro) {
    listaRegistros.innerHTML = `
      <p>
        Não foi possível carregar os registros. Verifique se o projeto está rodando pelo Apache/XAMPP.
      </p>
    `;
  }
}

async function salvarRegistro(dados) {
  const resposta = await fetch("salvar.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dados)
  });

  return resposta.json();
}

form.addEventListener("submit", async function (evento) {
  evento.preventDefault();

  const formData = new FormData(form);

  const dados = {
    objeto: formData.get("objeto").trim(),
    tipo: formData.get("tipo"),
    local: formData.get("local").trim(),
    data: formData.get("data"),
    descricao: formData.get("descricao").trim(),
    contato: formData.get("contato").trim()
  };

  try {
    const resultado = await salvarRegistro(dados);

    if (resultado.sucesso) {
      mostrarMensagem("Registro salvo com sucesso!", "sucesso");
      form.reset();
      await carregarRegistros();
    } else {
      mostrarMensagem(`Erro: ${resultado.erro}`, "erro");
    }
  } catch (erro) {
    mostrarMensagem("Falha ao conectar com o servidor. Abra pelo http://localhost/perdi-achei/ no XAMPP.", "erro");
  }

  limparMensagemDepoisDeAlgunsSegundos();
});

botoesFiltro.forEach((botao) => {
  botao.addEventListener("click", () => {
    botoesFiltro.forEach((b) => b.classList.remove("ativo"));
    botao.classList.add("ativo");
    filtroAtual = botao.dataset.filtro;
    renderizarRegistros();
  });
});

btnAtualizar.addEventListener("click", carregarRegistros);

carregarRegistros();
