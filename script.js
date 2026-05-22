const form = document.getElementById("formObjeto")
const mensagem = document.getElementById("mensagem")
const listaRegistros = document.getElementById("listaRegistros")
const totalRegistros = document.getElementById("totalRegistros")
const btnAtualizar = document.getElementById("btnAtualiza")
const botoesFiltro = document.querySelectorAll(".filtro")

let registros = []
let filtroAtual = "todos"

function mostrarMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = `mensagem ${tipo}`
}
function apagaMensagem() {
    setTimeout(() => {
        mensagem.textContent = "";
        mensagem.className = "mensagem";
    }, 4500)
}
function formatarData(dataISO) {

    if (!dataISO) return "Data não informada"
    const partes = dataISO.split("-")

    if (partes.length !== 3) {
        return "Data inválida"
    } else {
        return `${partes[2]}/${partes[1]}/${partes[0]}`
    }
}
function renderizarRegistros() {
    const registrosFiltrados = filtroAtual === "todos" ?
        registros : registros.filter((item) => item.tipo === filtroAtual)

    totalRegistros.textContent = registros.length

    listaRegistros.innerHTML = "";

    if (registrosFiltrados.length == 0) {
        listaRegistros.innerHTML = "<p>0 registros encontrados"
        return
    }
    registrosFiltrados.forEach((item) => {
        const div = document.createElement("div")
        div.className = "item"

        div.innerHTML = `<div class = "item-img">${iconeDoObjeto(item.objeto)} </div>
        <div>
            <div class ="tag ${escaparHTML(item.tipo)}">${escaparHTML(item.tipo).toUpperCase()}
            </div>
        <h3>${escaparHTML(itemObjeto)}</h3>
        <p><strong>Local:</strong>${escaparHTML(item.local)}</p>
        <p><strong>Data:</strong>${formatarData(escaparHTML(item.data))}</p>
        <p><strong>Descrição:</strong>${escaparHTML(item.desricao)}</p>

        </div>
        `
        listaRegistros.appendChild(div)
    })
}
