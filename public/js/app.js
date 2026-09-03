const API_URL = "/produtos";

const formulario = document.getElementById("form-produto");
const tabela = document.getElementById("tabela-produtos");

const campoId = document.getElementById("id");
const campoDescricao = document.getElementById("descricao");
const campoPreco = document.getElementById("preco");
const campoCategoria = document.getElementById("categoria");
const campoEstoque = document.getElementById("estoque");

const tituloFormulario = document.getElementById("titulo-formulario");
const botaoSalvar = document.getElementById("botao-salvar");
const botaoCancelar = document.getElementById("botao-cancelar");

async function carregarProdutos() {
    try {
        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar produtos.");
        }

        const produtos = await resposta.json();

        tabela.innerHTML = "";

        produtos.forEach(produto => {
            const linha = document.createElement("tr");

            linha.innerHTML = `
                <td>${produto.id}</td>
                <td>${produto.descricao}</td>
                <td>R$ ${Number(produto.preco).toFixed(2)}</td>
                <td>${produto.categoria}</td>
                <td>${produto.estoque}</td>
                <td>
                    <button class="botao-editar" onclick="editarProduto(${produto.id})">
                        Editar
                    </button>
                    <button class="botao-excluir" onclick="excluirProduto(${produto.id})">
                        Excluir
                    </button>
                </td>
            `;

            tabela.appendChild(linha);
        });

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível carregar os produtos.");
    }
}

formulario.addEventListener("submit", async function(evento) {
    evento.preventDefault();

    const id = campoId.value;

    const produto = {
        descricao: campoDescricao.value,
        preco: Number(campoPreco.value),
        categoria: campoCategoria.value,
        estoque: Number(campoEstoque.value)
    };

    try {
        let resposta;

        if (id) {
            resposta = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(produto)
            });
        } else {
            resposta = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(produto)
            });
        }

        if (!resposta.ok) {
            throw new Error("Erro ao salvar produto.");
        }

        alert(id ? "Produto atualizado com sucesso!" : "Produto cadastrado com sucesso!");

        limparFormulario();
        carregarProdutos();

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível salvar o produto.");
    }
});

async function editarProduto(id) {
    try {
        const resposta = await fetch(`${API_URL}/${id}`);

        if (!resposta.ok) {
            throw new Error("Produto não encontrado.");
        }

        const produto = await resposta.json();

        campoId.value = produto.id;
        campoDescricao.value = produto.descricao;
        campoPreco.value = produto.preco;
        campoCategoria.value = produto.categoria;
        campoEstoque.value = produto.estoque;

        tituloFormulario.textContent = "Editar Produto";
        botaoSalvar.textContent = "Salvar Alterações";
        botaoCancelar.style.display = "inline-block";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível carregar o produto.");
    }
}

async function excluirProduto(id) {
    const confirmar = confirm("Tem certeza que deseja excluir este produto?");

    if (!confirmar) {
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!resposta.ok) {
            throw new Error("Erro ao excluir produto.");
        }

        alert("Produto excluído com sucesso!");

        carregarProdutos();

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível excluir o produto.");
    }
}

function cancelarEdicao() {
    limparFormulario();
}

function limparFormulario() {
    formulario.reset();

    campoId.value = "";

    tituloFormulario.textContent = "Cadastrar Produto";
    botaoSalvar.textContent = "Cadastrar Produto";
    botaoCancelar.style.display = "none";
}

carregarProdutos();