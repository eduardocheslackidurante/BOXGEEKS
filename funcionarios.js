// Variáveis globais
let employees = [
    { id: 1001, nome: "João Silva", cpf: "123.456.789-00", telefone: "(11) 99999-9999", funcao: "Gerente de Vendas", department: "Comercial", status: "Ativo" },
    { id: 1002, nome: "Maria Oliveira", cpf: "987.654.321-00", telefone: "(11) 98888-8888", funcao: "Desenvolvedor Sênior", department: "TI", status: "Ativo" },
    { id: 1003, nome: "Carlos Souza", cpf: "456.789.123-00", telefone: "(11) 97777-7777", funcao: "Analista Financeiro", department: "Financeiro", status: "Férias" },
    { id: 1004, nome: "Ana Santos", cpf: "789.123.456-00", telefone: "(11) 96666-6666", funcao: "Designer", department: "Marketing", status: "Ativo" },
    { id: 1005, nome: "Pedro Costa", cpf: "321.654.987-00", telefone: "(11) 95555-5555", funcao: "Assistente Administrativo", department: "Administrativo", status: "Desligado" }
];

// Elementos do DOM
const employeeModal = document.getElementById('employeeModal');
const confirmModal = document.getElementById('confirmModal');
const btnAddEmployee = document.getElementById('btnAddEmployee');
const btnCancel = document.getElementById('btnCancel');
const btnCancelDelete = document.getElementById('btnCancelDelete');
const btnConfirmDelete = document.getElementById('btnConfirmDelete');
const closeModalButtons = document.querySelectorAll('.close-modal');
const employeeForm = document.getElementById('employeeForm');
const searchInput = document.getElementById('searchInput');
const btnClearSearch = document.getElementById('btnClearSearch');
const searchResults = document.getElementById('searchResults');
const successAlert = document.getElementById('successAlert');
const errorAlert = document.getElementById('errorAlert');

// Função para abrir o modal de funcionário
function openEmployeeModal(employee = null) {
    const modalTitle = document.getElementById('modalTitle');
    const employeeId = document.getElementById('employeeId');
    const employeeName = document.getElementById('employeeName');
    const employeeCpf = document.getElementById('employeeCpf');
    const employeePhone = document.getElementById('employeePhone');
    const employeePosition = document.getElementById('employeePosition');
    const employeeDepartment = document.getElementById('employeeDepartment');
    const employeeStatus = document.getElementById('employeeStatus');

    if (employee) {
        modalTitle.textContent = 'Editar Funcionário';
        employeeId.value = employee.id;
        employeeName.value = employee.name;
        employeeCpf.value = employee.cpf;
        employeePhone.value = employee.phone;
        employeePosition.value = employee.position;
        employeeDepartment.value = employee.department;
        employeeStatus.value = employee.status;
    } else {
        modalTitle.textContent = 'Adicionar Funcionário';
        employeeForm.reset();
        employeeId.value = '';
    }

    employeeModal.style.display = 'block';
}

// Função para fechar modais
function closeModals() {
    employeeModal.style.display = 'none';
    confirmModal.style.display = 'none';
}

// Função para mostrar mensagem
function showAlert(message, type = 'success') {
    const alertElement = type === 'success' ? successAlert : errorAlert;
    alertElement.textContent = message;
    alertElement.style.display = 'block';

    // Esconder a mensagem após 3 segundos
    setTimeout(() => {
        alertElement.style.display = 'none';
    }, 3000);
}

// Event Listeners
btnAddEmployee.addEventListener('click', () => openEmployeeModal());

btnCancel.addEventListener('click', closeModals);
btnCancelDelete.addEventListener('click', closeModals);

closeModalButtons.forEach(button => {
    button.addEventListener('click', closeModals);
});

window.addEventListener('click', (event) => {
    if (event.target === employeeModal || event.target === confirmModal) {
        closeModals();
    }
});

// Máscaras para CPF e telefone
document.getElementById('employeeCpf').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length > 3) value = value.substring(0, 3) + '.' + value.substring(3);
    if (value.length > 7) value = value.substring(0, 7) + '.' + value.substring(7);
    if (value.length > 11) value = value.substring(0, 11) + '-' + value.substring(11);
    if (value.length > 14) value = value.substring(0, 14);

    e.target.value = value;
});

document.getElementById('employeePhone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length > 0) value = '(' + value;
    if (value.length > 3) value = value.substring(0, 3) + ') ' + value.substring(3);
    if (value.length > 10) value = value.substring(0, 10) + '-' + value.substring(10);
    if (value.length > 15) value = value.substring(0, 15);

    e.target.value = value;
});

// Simular salvamento de funcionário
employeeForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Aqui você normalmente faria uma requisição AJAX para salvar no servidor
    // Estamos apenas simulando o comportamento
    const employeeId = document.getElementById('employeeId').value;

    if (employeeId) {
        showAlert('Funcionário atualizado com sucesso!');
    } else {
        showAlert('Funcionário cadastrado com sucesso!');
    }

    closeModals();
});

// Simular exclusão de funcionário
btnConfirmDelete.addEventListener('click', function() {
    // Aqui você normalmente faria uma requisição AJAX para excluir no servidor
    showAlert('Funcionário excluído com sucesso!');
    closeModals();
});

// Event Listeners para os botões de editar/excluir na tabela
document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', function() {
        const row = this.closest('tr');
        const employeeId = row.cells[0].textContent;
        const employee = employees.find(emp => emp.id === parseInt(employeeId));

        if (employee) {
            openEmployeeModal(employee);
        }
    });
});

document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', function() {
        confirmModal.style.display = 'block';
    });
});

// Limpar pesquisa
btnClearSearch.addEventListener('click', function() {
    searchInput.value = '';
    searchResults.textContent = '';
});

// Pesquisar funcionários
searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();

    if (searchTerm) {
        const results = employees.filter(employee => 
            employee.name.toLowerCase().includes(searchTerm) || 
            employee.id.toString().includes(searchTerm)
        );

        searchResults.textContent = `${results.length} resultado${results.length !== 1 ? 's' : ''} encontrado${results.length !== 1 ? 's' : ''}`;
    } else {
        searchResults.textContent = '';
    }
});