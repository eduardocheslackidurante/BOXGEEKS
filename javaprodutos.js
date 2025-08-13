// Dados dos produtos (simulando um banco de dados)
let products = [
    { id: 1001, nome: "JBL Boombox 3", description: "caixa potente a prova de água", category: "caixa de som", preco: 2499.90, stock: 5 },
    { id: 1002, nome: "JBL Tune 720BT", description: "dura até 76 horas de uso constante", category: "caixa de som", preco: 439.90, stock: 12 },
    { id: 1003, nome: "Amvox caixa amplificada ACA 1000", description: "torre de som amplificada", category: "caixa de som", preco: 1049.99, stock: 5 },
    { id: 1004, nome: "Amvox caixa amplificada ACA 150 pop", description: "qualidade e portabilidade", category: "eletronicos", preco: 219.90, stock: 10 },
    { id: 1005, nome: "Headset Redragon Zeus Pro", description: "potente e confortável", category: "eletronicos", preco: 149.90, stock: 10 },
];

// Variáveis globais
let nextId = 1006;
let productToDelete = null;
let filteredProducts = [...products];

// Elementos do DOM
const productModal = document.getElementById('productModal');
const confirmModal = document.getElementById('confirmModal');
const btnAddProduct = document.getElementById('btnAddProduct');
const btnCancel = document.getElementById('btnCancel');
const btnCancelDelete = document.getElementById('btnCancelDelete');
const btnConfirmDelete = document.getElementById('btnConfirmDelete');
const closeModalButtons = document.querySelectorAll('.close-modal');
const productForm = document.getElementById('productForm');
const searchInput = document.getElementById('searchInput');
const btnClearSearch = document.getElementById('btnClearSearch');
const searchResults = document.getElementById('searchResults');
const productsList = document.getElementById('productsList');

// Função para carregar os produtos na tabela
function loadProducts() {
    productsList.innerHTML = '';

    filteredProducts.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.description}</td>
            <td>${product.category}</td>
            <td>R$ ${product.price.toFixed(2).replace('.', ',')}</td>
            <td>${product.stock} unidades</td>
            <td class="actions">
                <button class="action-btn edit-btn" data-id="${product.id}" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" data-id="${product.id}" title="Excluir">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        productsList.appendChild(tr);
    });

    // Adicionar event listeners aos botões de ação
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => editProduct(parseInt(btn.getAttribute('data-id'))));
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => openDeleteModal(parseInt(btn.getAttribute('data-id'))));
    });
}

// Função para filtrar produtos por nome ou ID
function filterProducts(searchTerm) {
    if (!searchTerm.trim()) {
        filteredProducts = [...products];
    } else {
        const term = searchTerm.toLowerCase().trim();
        filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(term) || 
            product.id.toString().includes(term)
        );
    }

    loadProducts();
    updateSearchResults(searchTerm);
}

// Função para atualizar os resultados da pesquisa
function updateSearchResults(searchTerm) {
    if (!searchTerm.trim()) {
        searchResults.textContent = '';
    } else {
        const total = filteredProducts.length;
        searchResults.textContent = `${total} resultado${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`;
    }
}

// Função para limpar a pesquisa
function clearSearch() {
    searchInput.value = '';
    filteredProducts = [...products];
    loadProducts();
    searchResults.textContent = '';
}

// Função para abrir o modal de produto
function openProductModal(product = null) {
    const modalTitle = document.getElementById('modalTitle');
    const productId = document.getElementById('productId');
    const productName = document.getElementById('productName');
    const productDescription = document.getElementById('productDescription');
    const productCategory = document.getElementById('productCategory');
    const productPrice = document.getElementById('productPrice');
    const productStock = document.getElementById('productStock');

    if (product) {
        modalTitle.textContent = 'Editar Produto';
        productId.value = product.id;
        productName.value = product.name;
        productDescription.value = product.description;
        productCategory.value = product.category;
        productPrice.value = product.price;
        productStock.value = product.stock;
    } else {
        modalTitle.textContent = 'Adicionar Produto';
        productForm.reset();
        productId.value = '';
    }

    productModal.style.display = 'block';
}

// Função para editar um produto
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        openProductModal(product);
    }
}

// Função para abrir o modal de confirmação de exclusão
function openDeleteModal(id) {
    productToDelete = id;
    confirmModal.style.display = 'block';
}

// Função para fechar todos os modais
function closeModals() {
    productModal.style.display = 'none';
    confirmModal.style.display = 'none';
}

// Função para salvar um produto (adicionar ou editar)
function saveProduct(event) {
    event.preventDefault();

    const id = document.getElementById('productId').value ? parseInt(document.getElementById('productId').value) : nextId;
    const name = document.getElementById('productName').value;
    const description = document.getElementById('productDescription').value;
    const category = document.getElementById('productCategory').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const stock = parseInt(document.getElementById('productStock').value);

    if (document.getElementById('productId').value) {
        // Editar produto existente
        const index = products.findIndex(p => p.id === parseInt(document.getElementById('productId').value));
        if (index !== -1) {
            products[index] = { id, name, description, category, price, stock };
        }
    } else {
        // Adicionar novo produto
        products.push({ id, name, description, category, price, stock });
        nextId++;
    }

    closeModals();
    filterProducts(searchInput.value);
}

// Função para excluir um produto
function deleteProduct() {
    const index = products.findIndex(p => p.id === productToDelete);
    if (index !== -1) {
        products.splice(index, 1);
        closeModals();
        filterProducts(searchInput.value);
    }
}

// Event Listeners
btnAddProduct.addEventListener('click', () => openProductModal());

btnCancel.addEventListener('click', closeModals);
btnCancelDelete.addEventListener('click', closeModals);

closeModalButtons.forEach(button => {
    button.addEventListener('click', closeModals);
});

window.addEventListener('click', (event) => {
    if (event.target === productModal || event.target === confirmModal) {
        closeModals();
    }
});

productForm.addEventListener('submit', saveProduct);
btnConfirmDelete.addEventListener('click', deleteProduct);

// Event Listeners para pesquisa
searchInput.addEventListener('input', (e) => {
    filterProducts(e.target.value);
});

btnClearSearch.addEventListener('click', clearSearch);

// Carregar os produtos ao iniciar a página
document.addEventListener('DOMContentLoaded', () => {
    filteredProducts = [...products];
    loadProducts();
});