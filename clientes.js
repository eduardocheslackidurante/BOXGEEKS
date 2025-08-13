 // Variáveis globais
 let clients = [
    { id: 1001, nome: "João Silva", cpf: "123.456.789-00", telefone: "(11) 99999-9999", email: "joao.silva@email.com", endereco: "Rua A, 123 - Centro, São Paulo - SP", status: "Ativo" },
    { id: 1002, nome: "Maria Oliveira", cpf: "987.654.321-00", telefone: "(11) 98888-8888", email: "maria.oliveira@email.com", endereco: "Av. B, 456 - Jardins, São Paulo - SP", status: "Ativo" },
    { id: 1003, nome: "Carlos Souza", cpf: "456.789.123-00", telefone: "(11) 97777-7777", email: "carlos.souza@email.com", endereco: "Rua C, 789 - Vila Mariana, São Paulo - SP", status: "Inativo" },
    { id: 1004, nome: "Ana Santos", cpf: "789.123.456-00", telefone: "(11) 96666-6666", email: "ana.santos@email.com", endereco: "Av. D, 1011 - Moema, São Paulo - SP", status: "Ativo" },
    { id: 1005, nome: "Pedro Costa", cpf: "321.654.987-00", telefone: "(11) 95555-5555", email: "pedro.costa@email.com", endereco: "Rua E, 1213 - Pinheiros, São Paulo - SP", status: "Ativo" }
];

let editingClientId = null;
let clientToDeleteId = null;

// Elementos do DOM
const clientModal = document.getElementById('clientModal');
const confirmModal = document.getElementById('confirmModal');
const btnAddClient = document.getElementById('btnAddClient');
const btnCancel = document.getElementById('btnCancel');
const btnCancelDelete = document.getElementById('btnCancelDelete');
const btnConfirmDelete = document.getElementById('btnConfirmDelete');
const closeModalButtons = document.querySelectorAll('.close-modal');
const clientForm = document.getElementById('clientForm');
const searchInput = document.getElementById('searchInput');
const btnClearSearch = document.getElementById('btnClearSearch');
const searchResults = document.getElementById('searchResults');
const successAlert = document.getElementById('successAlert');
const errorAlert = document.getElementById('errorAlert');

// Função para gerar próximo ID
function getNextId() {
    if (clients.length === 0) return 1001;
    return Math.max(...clients.map(c => c.id)) + 1;
}

// Função para renderizar tabela
function renderTable(clientsToRender = clients) {
    const tbody = document.getElementById('clientsList');
    tbody.innerHTML = '';

    if (clientsToRender.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>Nenhum cliente encontrado</h3>
                    <p>Adicione um novo cliente ou refine sua pesquisa.</p>
                </td>
            </tr>
        `;
        return;
    }

    clientsToRender.forEach(client => {
        const row = document.createElement('tr');
        const statusClass = client.status === 'Ativo' ? 'active' : 'inactive';

        row.innerHTML = `
            <td>${client.id}</td>
            <td>${client.nome}</td>
            <td>${client.cpf}</td>
            <td>${client.telefone}</td>
            <td>${client.email}</td>
            <td><span class="status-badge ${statusClass}">${client.status}</span></td>
            <td class="actions">
                <button class="action-btn edit-btn" title="Editar" onclick="openEditModal(${client.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" title="Excluir" onclick="openDeleteModal(${client.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        tbody.appendChild(row);
    });
}

// Função para atualizar estatísticas
function updateStats() {
    const totalClients = clients.length;
    const activeClients = clients.filter(c => c.status === 'Ativo').length;
    const inactiveClients = clients.filter(c => c.status === 'Inativo').length;

    // Simular novos clientes (últimos 30 dias)
    const newClients = Math.floor(totalClients * 0.1);

    document.querySelector('.status-bar .status-item:nth-child(1) .status-value').textContent = totalClients;
    document.querySelector('.status-bar .status-item:nth-child(2) .status-value').textContent = activeClients;
    document.querySelector('.status-bar .status-item:nth-child(3) .status-value').textContent = inactiveClients;
    document.querySelector('.status-bar .status-item:nth-child(4) .status-value').textContent = newClients;
}

// Função para abrir o modal de cliente
function openClientModal(client = null) {
    const modalTitle = document.getElementById('modalTitle');
    const clientId = document.getElementById('clientId');
    const clientNome = document.getElementById('clientNome');
    const clientCpf = document.getElementById('clientCpf');
    const clientTelefone = document.getElementById('clientTelefone');
    const clientEmail = document.getElementById('clientEmail');
    const clientEndereco = document.getElementById('clientEndereco');
    const clientStatus = document.getElementById('clientStatus');

    if (client) {
        modalTitle.textContent = 'Editar Cliente';
        editingClientId = client.id;
        clientId.value = client.id;
        clientNome.value = client.nome;
        clientCpf.value = client.cpf;
        clientTelefone.value = client.telefone;
        clientEmail.value = client.email;
        clientEndereco.value = client.endereco;
        clientStatus.value = client.status;
    } else {
        modalTitle.textContent = 'Adicionar Cliente';
        editingClientId = null;
        clientForm.reset();
        clientId.value = '';
    }

    clientModal.style.display = 'block';
}

// Função global para abrir modal de edição
function openEditModal(clientId) {
    const client = clients.find(c => c.id === clientId);
    if (client) {
        openClientModal(client);
    }
}

// Função global para abrir modal de exclusão
function openDeleteModal(clientId) {
    clientToDeleteId = clientId;
    confirmModal.style.display = 'block';
}

// Função para fechar modais
function closeModals() {
    clientModal.style.display = 'nane';
    confirmModal.style.display = 'nane';
    editingClientId = null;
    clientToDeleteId = null;
}

// Função para mostrar mensagem
function showAlert(message, type = 'success') {
    const alertElement = type === 'success' ? successAlert : errorAlert;
    alertElement.textContent = message;
    alertElement.style.display = 'block';

    setTimeout(() => {
        alertElement.style.display = 'none';
    }, 3000);
}

// Função para validar CPF (básica)
function isValidCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    return cpf.length === 11 && !clients.some(c => c.id !== editingClientId && c.cpf.replace(/\D/g, '') === cpf);
}

// Função para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && !clients.some(c => c.id !== editingClientId && c.email === email);
}

// Event Listeners
btnAddClient.addEventListener('click', () => openClientModal());

btnCancel.addEventListener('click', closeModals);
btnCancelDelete.addEventListener('click', closeModals);

closeModalButtons.forEach(button => {
    button.addEventListener('click', closeModals);
});

window.addEventListener('click', (event) => {
    if (event.target === clientModal || event.target === confirmModal) {
        closeModals();
    }
});

// Máscaras para CPF e telefone
document.getElementById('clientCpf').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length > 3) value = value.substring(0, 3) + '.' + value.substring(3);
    if (value.length > 7) value = value.substring(0, 7) + '.' + value.substring(7);
    if (value.length > 11) value = value.substring(0, 11) + '-' + value.substring(11);
    if (value.length > 14) value = value.substring(0, 14);

    e.target.value = value;
});

document.getElementById('clientTelefone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length > 0) value = '(' + value;
    if (value.length > 3) value = value.substring(0, 3) + ') ' + value.substring(3);
    if (value.length > 10) value = value.substring(0, 10) + '-' + value.substring(10);
    if (value.length > 15) value = value.substring(0, 15);

    e.target.value = value;
});

// Salvamento de cliente
clientForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const clientName = document.getElementById('clientNome').value.trim();
    const clientCpf = document.getElementById('clientCpf').value.trim();
    const clientPhone = document.getElementById('clientTelefone').value.trim();
    const clientEmail = document.getElementById('clientEmail').value.trim();
    const clientAddress = document.getElementById('clientEndereco').value.trim();
    const clientStatus = document.getElementById('clientStatus').value;

    // Validações
    if (!clientNome) {
        showAlert('Nome é obrigatório!', 'error');
        return;
    }

    if (!isValidCPF(clientCpf)) {
        showAlert('CPF inválido ou já cadastrado!', 'error');
        return;
    }

    if (!clientTelefone) {
        showAlert('Telefone é obrigatório!', 'error');
        return;
    }

    if (!isValidEmail(clientEmail)) {
        showAlert('Email inválido ou já cadastrado!', 'error');
        return;
    }

    const clientData = {
        name: clientNome,
        cpf: clientCpf,
        telefone : clientTelefone,
        email: clientEmail,
        endereco : clientEndereco,
        status: clientStatus
    };

    if (editingClientId) {
        // Editar cliente existente
        const clientIndex = clients.findIndex(c => c.id === editingClientId);
        if (clientIndex !== -1) {
            clients[clientIndex] = { ...clients[clientIndex], ...clientData };
            showAlert('Cliente atualizado com sucesso!');
        }
    } else {
        // Adicionar novo cliente
        const newClient = {
            id: getNextId(),
            ...clientData
        };
        clients.push(newClient);
        showAlert('Cliente cadastrado com sucesso!');
    }

    renderTable();
    updateStats();
    closeModals();
});

// Exclusão de cliente
btnConfirmDelete.addEventListener('click', function() {
    if (clientToDeleteId) {
        clients = clients.filter(c => c.id !== clientToDeleteId);
        showAlert('Cliente excluído com sucesso!');
        renderTable();
        updateStats();

        // Limpar pesquisa se não há mais resultados
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            performSearch(searchTerm);
        }
    }
    closeModals();
});

// Função de pesquisa
function performSearch(searchTerm) {
    if (searchTerm) {
        const results = clients.filter(client => 
            client.nome.toLowerCase().includes(searchTerm) || 
            client.id.toString().includes(searchTerm) ||
            client.cpf.includes(searchTerm) ||
            client.email.toLowerCase().includes(searchTerm) ||
            client.telefone.includes(searchTerm)
        );

        renderTable(results);
        searchResults.textContent = `${results.length} resultado${results.length !== 1 ? 's' : ''} encontrado${results.length !== 1 ? 's' : ''}`;
    } else {
        renderTable();
        searchResults.textContent = '';
    }
}

// Limpar pesquisa
btnClearSearch.addEventListener('click', function() {
    searchInput.value = '';
    searchResults.textContent = '';
    renderTable();
});

// Pesquisar clientes
searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    performSearch(searchTerm);
});

// CSS adicional para status badges
const additionalStyles = `
    <style>
        .status-badge {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 500;
        }

        .status-badge.active {
            background-color: rgba(46, 204, 113, 0.2);
            color: #27ae60;
        }

        .status-badge.inactive {
            background-color: rgba(231, 76, 60, 0.2);
            color: #c0392b;
        }

        .empty-state {
            padding: 3rem !important;
            text-align: center;
            color: var(--text-light);
        }

        .empty-state i {
            font-size: 3rem;
            color: var(--secondary-color);
            margin-bottom: 1rem;
            display: block;
        }

        .empty-state h3 {
            color: var(--primary-color);
            margin-bottom: 0.5rem;
        }

        #clientStatus {
            width: 100%;
            padding: 0.8rem;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 1rem;
            transition: border-color 0.3s;
        }

        #clientStatus:focus {
            outline: none;
            border-color: var(--secondary-color);
            box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
        }
    </style>
`;

// Adicionar estilos extras
document.head.insertAdjacentHTML('beforeend', additionalStyles);

// Inicializar página
document.addEventListener('DOMContentLoaded', function() {
    renderTable();
    updateStats();
});