
let carrinho = [];

const painelCarrinho = document.getElementById("painel-carrinho");
const modalPagamento = document.getElementById("modal-pagamento");

document.getElementById("carrinho-btn").addEventListener("click", () => {
    painelCarrinho.classList.toggle("aberto");
});

document.getElementById("fechar-carrinho").addEventListener("click", () => {
    painelCarrinho.classList.remove("aberto");
});

document.querySelectorAll(".adicionar-carrinho").forEach(botao => {
    botao.addEventListener("click", () => {
        const nome = botao.dataset.nome;
        const preco = Number(botao.dataset.preco);

        if (!nome || !Number.isFinite(preco)) {
            alert("Confira o nome e o preço deste produto!");
            return;
        }

        const existente = carrinho.find(item => item.nome === nome);

        if (existente) {
            existente.quantidade++;
        } else {
            carrinho.push({
                nome: nome,
                preco: preco,
                quantidade: 1
            });
        }

        atualizarCarrinho();
    });
});

function atualizarCarrinho() {
    const lista = document.getElementById("itens-carrinho");
    const contador = document.getElementById("carrinho-contador");
    const totalElemento = document.getElementById("total-carrinho");

    lista.innerHTML = "";

    let total = 0;
    let quantidadeTotal = 0;

    carrinho.forEach((item, indice) => {
        total += item.preco * item.quantidade;
        quantidadeTotal += item.quantidade;

        lista.innerHTML += `
            <div class="item-carrinho">
                <strong>${item.nome}</strong>
                <p>Quantidade: ${item.quantidade}</p>
                <p>R$ ${(item.preco * item.quantidade).toFixed(2).replace(".", ",")}</p>
                <button onclick="removerProduto(${indice})">Remover</button>
            </div>
        `;
    });

    if (carrinho.length === 0) {
        lista.innerHTML = "<p>Seu carrinho está vazio.</p>";
    }

    contador.textContent = quantidadeTotal;
    totalElemento.textContent = total.toFixed(2).replace(".", ",");
}

function removerProduto(indice) {
    carrinho.splice(indice, 1);
    atualizarCarrinho();
}

document.getElementById("ir-pagamento").addEventListener("click", () => {
    if (carrinho.length === 0) {
        alert("Adicione algum produto antes de continuar!");
        return;
    }

    painelCarrinho.classList.remove("aberto");
    mostrarResumo();
    modalPagamento.classList.add("aberto");
});

document.getElementById("fechar-pagamento").addEventListener("click", () => {
    modalPagamento.classList.remove("aberto");
});

function mostrarResumo() {
    const resumo = document.getElementById("resumo-pedido");

    let total = 0;
    let texto = "<h3>Resumo do pedido</h3>";

    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;

        texto += `
            <p>${item.quantidade}x ${item.nome} — R$ ${subtotal.toFixed(2).replace(".", ",")}</p>
        `;
    });

    texto += `
        <h3>Total: R$ ${total.toFixed(2).replace(".", ",")}</h3>
    `;

    resumo.innerHTML = texto;
}

document.getElementById("confirmar-pedido").addEventListener("click", () => {
    const selecionado = document.querySelector('input[name="pagamento"]:checked');

    if (selecionado.value === "Dinheiro") {
    const total = carrinho.reduce(
        (soma, item) => soma + item.preco * item.quantidade,
        0
    );

    if (valorPago.value === "" || Number(valorPago.value) < total) {
        alert("O valor informado não é suficiente para pagar o pedido!");
        return;
    }
}
});

const opcoesPagamento = document.querySelectorAll(
    'input[name="pagamento"]'
);

const areaDinheiro = document.getElementById("area-dinheiro");
const valorPago = document.getElementById("valor-pago");
const valorTroco = document.getElementById("valor-troco");

function calcularTroco() {
    const total = carrinho.reduce((soma, item) => {
        return soma + item.preco * item.quantidade;
    }, 0);

    const pago = Number(valorPago.value);

    if (valorPago.value === "") {
        valorTroco.textContent = "0,00";
        return;
    }

    if (pago < total) {
        valorTroco.textContent = "Valor insuficiente";
        return;
    }

    valorTroco.textContent = (pago - total)
        .toFixed(2)
        .replace(".", ",");
}

opcoesPagamento.forEach(opcao => {
    opcao.addEventListener("change", () => {
        areaDinheiro.style.display =
            opcao.value === "Dinheiro" && opcao.checked
                ? "block"
                : "none";

        calcularTroco();
    });
});

valorPago.addEventListener("input", calcularTroco);

