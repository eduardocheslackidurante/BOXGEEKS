const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();


const app = express();
const port = process.env.PORT || 3000;

// Serve os arquivos estáticos da pasta "public"
app.use(express.static('public'));

// Configura o body-parser para ler JSON
app.use(bodyParser.json());

// Conexão com o banco de dados SQLite
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

// Criação das tabelas
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            preco REAL NOT NULL,
            descricao TEXT,
            categoria TEXT,
            quantidade_estoque INTEGER NOT NULL,
            fornecedor TEXT,
        )
    `);

    db.run(`
         CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome VARCHAR(100) NOT NULL,
            cpf VARCHAR(14) NOT NULL UNIQUE,
            telefone VARCHAR(15),
            email VARCHAR(100),
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


    console.log('Tabelas criadas com sucesso.');
});



///////////////////////////// Rotas para Fornecedores /////////////////////////////
///////////////////////////// Rotas para Fornecedores /////////////////////////////
///////////////////////////// Rotas para Fornecedores /////////////////////////////


// Cadastrar produto
app.post('/produtos', (req, res) => {
    const { nome, preco, descricao, categoria, quantidade_estoque, fornecedor } = req.body;

    if (!nome || !preco || quantidade_estoque === undefined) {
        return res.status(400).send('Nome, preço e quantidade em estoque são obrigatórios.');
    }

    const query = `INSERT INTO produtos (nome, preco, descricao, categoria, quantidade_estoque, fornecedor) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(query, [nome, preco, descricao, categoria, quantidade_estoque, fornecedor], function (err) {
        if (err) {
            return res.status(500).send('Erro ao cadastrar produto.');
        }
        res.status(201).send({ id: this.lastID, message: 'Produto cadastrado com sucesso.' });
    });
});

// Listar produtos
app.get('/produtos', (req, res) => {
    const nome = req.query.nome || '';  // Recebe o nome da query string (se houver)

    if (nome) {
        // Se nome foi passado, busca produtos que possuam esse nome ou parte dele
        const query = `SELECT * FROM produtos WHERE nome LIKE ?`;

        db.all(query, [`%${nome}%`], (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Erro ao buscar produtos.' });
            }
            res.json(rows);  // Retorna os produtos encontrados ou um array vazio
        });
    } else {
        // Se nome não foi passado, retorna todos os produtos
        const query = `SELECT * FROM produtos`;

        db.all(query, (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Erro ao buscar produtos.' });
            }
            res.json(rows);  // Retorna todos os produtos
        });
    }
});

// Atualizar produto por nome
app.put('/produtos/nome/:nome', (req, res) => {
    const { nome } = req.params;
    const { preco, descricao, categoria, quantidade_estoque, fornecedor } = req.body;

    const query = `UPDATE produtos SET preco = ?, descricao = ?, categoria = ?, quantidade_estoque = ?, fornecedor = ? WHERE nome = ?`;
    db.run(query, [preco, descricao, categoria, quantidade_estoque, fornecedor, nome], function (err) {
        if (err) {
            return res.status(500).send('Erro ao atualizar produto.');
        }
        if (this.changes === 0) {
            return res.status(404).send('Produto não encontrado.');
        }
        res.send('Produto atualizado com sucesso.');
    });
});

// Buscar produto por nome específico
app.get('/produtos/nome/:nome', (req, res) => {
    const { nome } = req.params;
    
    const query = `SELECT * FROM produtos WHERE nome = ?`;
    db.get(query, [nome], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro ao buscar produto.' });
        }
        if (!row) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }
        res.json(row);
    });
});

// Deletar produto por nome
app.delete('/produtos/nome/:nome', (req, res) => {
    const { nome } = req.params;

    const query = `DELETE FROM produtos WHERE nome = ?`;
    db.run(query, [nome], function (err) {
        if (err) {
            return res.status(500).send('Erro ao deletar produto.');
        }
        if (this.changes === 0) {
            return res.status(404).send('Produto não encontrado.');
        }
        res.send('Produto deletado com sucesso.');
    });
});

///////////////////////////// Rotas para Produtos /////////////////////////////
///////////////////////////// Rotas para Produtos /////////////////////////////
///////////////////////////// Rotas para Produtos /////////////////////////////

// Cadastrar produto
app.post('/produtos', (req, res) => {
    const { nome, preco, descricao, categoria, quantidade_estoque, fornecedor_id } = req.body;
    const sql = `INSERT INTO produtos (nome, preco, descricao, categoria, quantidade_estoque, fornecedor_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.run(sql, [nome, preco, descricao, categoria, quantidade_estoque, fornecedor_id], function(err) {
        if (err) {
            return res.status(500).json({ message: "Erro ao cadastrar produto", error: err });
        }
        res.status(200).json({ message: "Produto cadastrado com sucesso", id: this.lastID });
    });
});

// Listar produtos
app.get('/produtos', (req, res) => {
    const query = `SELECT * FROM produtos`;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).send('Erro ao listar produtos.');
        }
        res.send(rows);
    });
});

// Atualizar produto
app.put('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const { nome, preco, descricao, categoria, quantidade_estoque, dimensoes, fornecedor_id } = req.body;

    const query = `UPDATE produtos SET nome = ?, preco = ?, descricao = ?, categoria = ?, quantidade_estoque = ?, dimensoes = ?, fornecedor_id = ? WHERE id = ?`;
    db.run(query, [nome, preco, descricao, categoria, quantidade_estoque, dimensoes, fornecedor_id, id], function (err) {
        if (err) {
            return res.status(500).send('Erro ao atualizar produto.');
        }
        if (this.changes === 0) {
            return res.status(404).send('Produto não encontrado.');
        }
        res.send('Produto atualizado com sucesso.');
    });
});
// ROTA PARA BUSCAR TODOS OS FORNECEDORES PARA CADASTRAR O PRODUTO
app.get('/buscar-fornecedores', (req, res) => {
    db.all("SELECT id, nome FROM fornecedores", [], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar serviços:', err);
            res.status(500).send('Erro ao buscar serviços');
        } else {
            res.json(rows); // Retorna os serviços em formato JSON
        }
    });
});




///////////////////////////// Rotas para Clientes /////////////////////////////
///////////////////////////// Rotas para Clientes /////////////////////////////
///////////////////////////// Rotas para Clientes /////////////////////////////

// Cadastrar cliente
app.post('/clientes', (req, res) => {
    const { nome, cpf, email, telefone, endereco } = req.body;

    if (!nome || !cpf) {
        return res.status(400).send('Nome e CPF são obrigatórios.');
    }

    const query = `INSERT INTO clientes (nome, cpf, email, telefone, endereco) VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [nome, cpf, email, telefone, endereco], function (err) {
        if (err) {
            return res.status(500).send('Erro ao cadastrar cliente.');
        }
        res.status(201).send({ id: this.lastID, message: 'Cliente cadastrado com sucesso.' });
    });
});

// Listar clientes
// Endpoint para listar todos os clientes ou buscar por CPF
app.get('/clientes', (req, res) => {
    const cpf = req.query.cpf || '';  // Recebe o CPF da query string (se houver)

    if (cpf) {
        // Se CPF foi passado, busca clientes que possuam esse CPF ou parte dele
        const query = `SELECT * FROM clientes WHERE cpf LIKE ?`;

        db.all(query, [`%${cpf}%`], (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Erro ao buscar clientes.' });
            }
            res.json(rows);  // Retorna os clientes encontrados ou um array vazio
        });
    } else {
        // Se CPF não foi passado, retorna todos os clientes
        const query = `SELECT * FROM clientes`;

        db.all(query, (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Erro ao buscar clientes.' });
            }
            res.json(rows);  // Retorna todos os clientes
        });
    }
});



// Atualizar cliente
app.put('/clientes/cpf/:cpf', (req, res) => {
    const { cpf } = req.params;
    const { nome, email, telefone, endereco } = req.body;

    const query = `UPDATE clientes SET nome = ?, email = ?, telefone = ?, endereco = ? WHERE cpf = ?`;
    db.run(query, [nome, email, telefone, endereco, cpf], function (err) {
        if (err) {
            return res.status(500).send('Erro ao atualizar cliente.');
        }
        if (this.changes === 0) {
            return res.status(404).send('Cliente não encontrado.');
        }
        res.send('Cliente atualizado com sucesso.');
    });
});



///////////////////////////// Rotas para Vendas /////////////////////////////
///////////////////////////// Rotas para Vendas /////////////////////////////
///////////////////////////// Rotas para Vendas /////////////////////////////

app.post('/vendas', (req, res) => {
    const { cliente_cpf, itens } = req.body;

    if (!cliente_cpf || !itens || itens.length === 0) {
        return res.status(400).send("Dados da venda incompletos.");
    }

    const dataVenda = new Date().toISOString();

    db.serialize(() => {
        const insertSaleQuery = `INSERT INTO vendas (cliente_cpf, produto_id, quantidade, data) VALUES (?, ?, ?, ?)`;
        const updateStockQuery = `UPDATE produtos SET quantidade_estoque = quantidade_estoque - ? WHERE id = ?`;

        let erroOcorrido = false;

        itens.forEach(({ idProduto, quantidade }) => {
            if (!idProduto || !quantidade || quantidade <= 0) {
                console.error(`Dados inválidos para o produto ID: ${idProduto}, quantidade: ${quantidade}`);
                erroOcorrido = true;
                return;
            }

            // Registrar a venda
            db.run(insertSaleQuery, [cliente_cpf, idProduto, quantidade, dataVenda], function (err) {
                if (err) {
                    console.error("Erro ao registrar venda:", err.message);
                    erroOcorrido = true;
                }
            });

            // Atualizar o estoque
            db.run(updateStockQuery, [quantidade, idProduto], function (err) {
                if (err) {
                    console.error("Erro ao atualizar estoque:", err.message);
                    erroOcorrido = true;
                }
            });
        });

        if (erroOcorrido) {
            res.status(500).send("Erro ao processar a venda.");
        } else {
            res.status(201).send({ message: "Venda registrada com sucesso." });
        }
    });
});




app.get('/clientes/:cpf', (req, res) => {
    const cpf = req.params.cpf;
    db.get("SELECT * FROM clientes WHERE cpf = ?", [cpf], (err, row) => {
      if (err) {
        res.status(500).json({ error: "Erro no servidor." });
      } else if (!row) {
        res.status(404).json({ error: "Cliente não encontrado." });
      } else {
        res.json(row);
      }
    });
});
app.get('/produtos_carrinho/:id', (req, res) => {
    const id = req.params.id;
    db.get("SELECT * FROM produtos WHERE id = ? ", [id], (err, row) => {
        if (err) {
          res.status(500).json({ error: "Erro no servidor." });
        } else if (!row) {
          res.status(404).json({ error: "Produto não encontrado.." });
        } else {
          res.json(row);
        }
      }
    );
});





// ROTA PARA BUSCAR TODOS OS PRODUTOS PÁGINA DE VENDAS
app.get('/buscar-produtos', (req, res) => {
    db.all("SELECT id, nome, quantidade_estoque FROM produtos", [], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar produtos:', err);
            res.status(500).send('Erro ao buscar produtos');
        } else {
            res.json(rows); // Retorna os serviços em formato JSON
        }
    });
});

///////////////////////////// Rotas para consulta /////////////////////////////
///////////////////////////// Rotas para consulta /////////////////////////////
///////////////////////////// Rotas para consulta /////////////////////////////



// Rota para buscar vendas com filtros (cpf, produto, data)
app.get('/relatorios', (req, res) => {
    const { cpf, produto, dataInicio, dataFim } = req.query;

    let query = `SELECT vendas.id, vendas.cliente_cpf, vendas.produto_id, vendas.quantidade, vendas.data, 
                    produtos.nome AS produto_nome, clientes.nome AS cliente_nome
                 FROM vendas
                 JOIN produtos ON vendas.produto_id = produtos.id
                 JOIN clientes ON vendas.cliente_cpf = clientes.cpf
                 WHERE 1=1`;  // Começar com um WHERE sempre verdadeiro (1=1)

    const params = [];

    // Filtro por CPF do cliente
    if (cpf) {
        query += ` AND vendas.cliente_cpf = ?`;
        params.push(cpf);
    }

    // Filtro por nome do produto
    if (produto) {
        query += ` AND produtos.nome LIKE ?`;
        params.push(`%${produto}%`);
    }

    // Filtro por data
    if (dataInicio && dataFim) {
        query += ` AND vendas.data BETWEEN ? AND ?`;
        params.push(dataInicio, dataFim);
    }

    // Executa a query com os filtros aplicados
    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao buscar relatórios.', error: err.message });
        }

        res.json(rows);  // Retorna os resultados da query
    });
});








// Teste para verificar se o servidor está rodando
app.get('/', (req, res) => {
    res.send('Servidor está rodando e tabelas criadas!');
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
