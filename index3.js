const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

// Conexão com banco
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

// Criar tabelas
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            preco REAL NOT NULL,
            descricao TEXT,
            categoria TEXT,
            quantidade_estoque INTEGER NOT NULL,
            fornecedor_id INTEGER,
            dimensoes TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            cpf TEXT NOT NULL UNIQUE,
            telefone TEXT,
            email TEXT,
            endereco TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS vendas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cliente_cpf TEXT NOT NULL,
            produto_id INTEGER NOT NULL,
            quantidade INTEGER NOT NULL,
            data TEXT NOT NULL,
            FOREIGN KEY (cliente_cpf) REFERENCES clientes (cpf),
            FOREIGN KEY (produto_id) REFERENCES produtos (id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS funcionario (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            cpf TEXT NOT NULL UNIQUE,
            telefone TEXT,
            cargo TEXT
        )
    `);

    console.log('Tabelas criadas com sucesso.');
});

//////////////////// Rotas de Produtos ////////////////////

// Cadastrar produto
app.post('/produtos', (req, res) => {
    const { nome, preco, descricao, categoria, quantidade_estoque, fornecedor_id, dimensoes } = req.body;

    if (!nome || preco == null || quantidade_estoque == null) {
        return res.status(400).send('Nome, preço e quantidade em estoque são obrigatórios.');
    }

    const sql = `INSERT INTO produtos (nome, preco, descricao, categoria, quantidade_estoque, fornecedor_id, dimensoes) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.run(sql, [nome, preco, descricao, categoria, quantidade_estoque, fornecedor_id, dimensoes], function(err) {
        if (err) return res.status(500).json({ message: "Erro ao cadastrar produto", error: err });
        res.status(201).json({ id: this.lastID, message: "Produto cadastrado com sucesso" });
    });
});

// Listar produtos
app.get('/produtos', (req, res) => {
    const { nome } = req.query;
    let sql = "SELECT * FROM produtos";
    let params = [];

    if (nome) {
        sql += " WHERE nome LIKE ?";
        params.push(`%${nome}%`);
    }

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ message: 'Erro ao buscar produtos' });
        res.json(rows);
    });
});

// Atualizar produto por ID
app.put('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const { nome, preco, descricao, categoria, quantidade_estoque, fornecedor_id, dimensoes } = req.body;

    const sql = `UPDATE produtos SET nome=?, preco=?, descricao=?, categoria=?, quantidade_estoque=?, fornecedor_id=?, dimensoes=? WHERE id=?`;

    db.run(sql, [nome, preco, descricao, categoria, quantidade_estoque, fornecedor_id, dimensoes, id], function(err) {
        if (err) return res.status(500).send('Erro ao atualizar produto.');
        if (this.changes === 0) return res.status(404).send('Produto não encontrado.');
        res.send('Produto atualizado com sucesso.');
    });
});

// Deletar produto
app.delete('/produtos/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM produtos WHERE id=?", [id], function(err) {
        if (err) return res.status(500).send('Erro ao deletar produto.');
        if (this.changes === 0) return res.status(404).send('Produto não encontrado.');
        res.send('Produto deletado com sucesso.');
    });
});

//////////////////// Rotas de Funcionário ////////////////////

app.post('/funcionario', (req, res) => {
    const { nome, cpf, telefone, cargo } = req.body;

    if (!nome || !cpf) {
        return res.status(400).send('Nome e CPF são obrigatórios.');
    }

    const sql = `INSERT INTO funcionario (nome, cpf, telefone, cargo) VALUES (?, ?, ?, ?)`;

    db.run(sql, [nome, cpf, telefone, cargo], function(err) {
        if (err) return res.status(500).send('Erro ao cadastrar funcionário.');
        res.status(201).send({ id: this.lastID, message: 'Funcionário cadastrado com sucesso.' });
    });
});

//////////////////// Teste servidor ////////////////////

app.get('/', (req, res) => {
    res.send('Servidor está rodando e tabelas criadas!');
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
