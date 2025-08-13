// Dados de exemplo para demonstração
let produtos = [
    { nome: "JBL Boombox 3", quantidade: 5 },
    { nome: "JBL Tune 720BT", quantidade: 10 },
    { nome: "Amvox caixa amplificada ACA 1000", quantidade: 5 },
    { nome: "Amvox caixa amplificada ACA 150 pop", quantidade: 10 },
    { nome: "Headset Redragon Zeus Pro", quantidade: 10 }
];

// Função para renderizar a tabela
function renderizarTabela(produtosFiltrados = produtos) {
    const tbody = document.getElementById('listaEstoque');
    tbody.innerHTML = '';

    produtosFiltrados.forEach(produto => {
        const tr = document.createElement('tr');

        // Determinar classe CSS baseada na quantidade
        let classeQuantidade = '';
        if (produto.quantidade <= 3) {
            classeQuantidade = 'quantidade-baixa';
        } else if (produto.quantidade <= 5) {
            classeQuantidade = 'quantidade-media';
        } else {
            classeQuantidade = 'quantidade-alta';
        }

        tr.innerHTML = `
            <td>${produto.nome}</td>
            <td class="${classeQuantidade}">${produto.quantidade}</td>
        `;

        tbody.appendChild(tr);
    });

    // Atualizar contador de resultados
    const searchResults = document.getElementById('searchResults');
    if (produtosFiltrados.length !== produtos.length) {
        searchResults.textContent = `${produtosFiltrados.length} produto(s) encontrado(s)`;
    } else {
        searchResults.textContent = '';
    }
}

// Função de pesquisa
function pesquisarProdutos() {
    const termo = document.getElementById('searchInput').value.toLowerCase();
    const produtosFiltrados = produtos.filter(produto => 
        produto.nome.toLowerCase().includes(termo)
    );
    renderizarTabela(produtosFiltrados);
}

// Event listeners
document.getElementById('searchInput').addEventListener('input', pesquisarProdutos);

document.getElementById('btnLimpar').addEventListener('click', function() {
    document.getElementById('searchInput').value = '';
    renderizarTabela();
});

// Renderizar tabela inicial
renderizarTabela();