const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('.'));
app.use(cors());

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'estoque_imdaz'
};

// Classe Pilha para inserção e remoção de produtos (LIFO)
class Pilha {
    constructor() {
        this.itens = [];
    }
    push(item) {
        this.itens.push(item);
    }
    pop() {
        if (this.isEmpty()) return null;
        return this.itens.pop();
    }
    isEmpty() {
        return this.itens.length === 0;
    }
}

// Classe Fila para exibição e remoção do estoque (FIFO)
class Fila {
    constructor() {
        this.itens = [];
    }
    enqueue(item) {
        this.itens.push(item);
    }
    dequeue() {
        if (this.isEmpty()) return null;
        return this.itens.shift();
    }
    isEmpty() {
        return this.itens.length === 0;
    }
    getItens() {
        return [...this.itens];
    }
}

const pilhaProdutos = new Pilha();
const filaEstoque = new Fila();

async function conectarDB() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Conectado ao banco de dados MySQL');
        return connection;
    } catch (error) {
        console.error('Erro ao conectar ao banco:', error.message);
        throw error;
    }
}

app.post('/api/doadores', async (req, res) => {
    console.log('POST /api/doadores recebido:', req.body);
    const { doador, endereco, telefone, email } = req.body;

    if (!doador || !endereco || !telefone) {
        return res.status(400).json({ error: 'Campos doador, endereco e telefone são obrigatórios' });
    }

    try {
        const connection = await conectarDB();
        const [result] = await connection.execute(
            'INSERT INTO doadores (doador, endereco, telefone, email) VALUES (?, ?, ?, ?)',
            [doador, endereco, telefone, email || null]
        );
        console.log('Doador inserido, ID:', result.insertId);
        await connection.end();
        res.status(201).json({ id: result.insertId, message: 'Doador cadastrado com sucesso' });
    } catch (error) {
        console.error('Erro ao cadastrar doador:', error.message);
        res.status(500).json({ error: 'Erro ao cadastrar doador' });
    }
});

app.get('/api/doadores', async (req, res) => {
    console.log('GET /api/doadores recebido');
    try {
        const connection = await conectarDB();
        const [rows] = await connection.execute('SELECT * FROM doadores');
        console.log('Doadores encontrados:', rows);
        await connection.end();
        res.json(rows);
    } catch (error) {
        console.error('Erro ao listar doadores:', error.message);
        res.status(500).json({ error: 'Erro ao listar doadores' });
    }
});

app.post('/api/produtos', async (req, res) => {
    console.log('POST /api/produtos recebido:', req.body);
    const produto = req.body;

    if (!produto.item || !produto.quantidade || !produto.valor || !produto.data_doacao || !produto.id_doador) {
        return res.status(400).json({ error: 'Campos item, quantidade, valor, data_doacao e id_doador são obrigatórios' });
    }

    pilhaProdutos.push(produto);

    try {
        const connection = await conectarDB();
        const ultimoProduto = pilhaProdutos.pop();
        if (!ultimoProduto) {
            await connection.end();
            return res.status(400).json({ error: 'Nenhum produto na pilha' });
        }

        const { item, quantidade, valor, data_vencimento, data_doacao, id_doador } = ultimoProduto;
        const [result] = await connection.execute(
            'INSERT INTO produtos (item, quantidade, valor, data_vencimento, data_doacao, id_doador) VALUES (?, ?, ?, ?, ?, ?)',
            [item, quantidade, valor, data_vencimento || null, data_doacao, id_doador]
        );

        filaEstoque.enqueue({ id_produto: result.insertId, ...ultimoProduto });
        console.log('Produto inserido, ID:', result.insertId);
        await connection.end();
        res.status(201).json({ id: result.insertId, message: 'Produto cadastrado com sucesso' });
    } catch (error) {
        console.error('Erro ao cadastrar produto:', error.message);
        res.status(500).json({ error: 'Erro ao cadastrar produto' });
    }
});

app.get('/api/estoque', async (req, res) => {
    console.log('GET /api/estoque recebido');
    try {
        const connection = await conectarDB();
        const [rows] = await connection.execute('SELECT * FROM produtos');
        console.log('Dados do estoque:', rows);
        filaEstoque.itens = [];
        rows.forEach(produto => filaEstoque.enqueue(produto));

        const estoque = filaEstoque.getItens();
        await connection.end();
        res.json(estoque);
    } catch (error) {
        console.error('Erro ao listar estoque:', error.message);
        res.status(500).json({ error: 'Erro ao listar estoque' });
    }
});

// Novo endpoint para remover o último produto da pilha (LIFO)
app.delete('/api/produtos/pilha', async (req, res) => {
    console.log('DELETE /api/produtos/pilha recebido');
    try {
        const connection = await conectarDB();
        // Seleciona o último produto inserido (maior id_produto)
        const [rows] = await connection.execute('SELECT * FROM produtos ORDER BY id_produto DESC LIMIT 1');
        if (rows.length === 0) {
            await connection.end();
            return res.status(404).json({ error: 'Nenhum produto na pilha' });
        }
        const produto = rows[0];
        // Remove o produto do banco
        await connection.execute('DELETE FROM produtos WHERE id_produto = ?', [produto.id_produto]);
        console.log('Produto removido da pilha, ID:', produto.id_produto);
        await connection.end();
        res.json({ message: 'Último produto removido da pilha', produto });
    } catch (error) {
        console.error('Erro ao remover produto da pilha:', error.message);
        res.status(500).json({ error: 'Erro ao remover produto da pilha' });
    }
});

// Novo endpoint para remover o primeiro produto da fila (FIFO)
app.delete('/api/produtos/fila', async (req, res) => {
    console.log('DELETE /api/produtos/fila recebido');
    try {
        const connection = await conectarDB();
        // Seleciona o primeiro produto inserido (menor id_produto)
        const [rows] = await connection.execute('SELECT * FROM produtos ORDER BY id_produto ASC LIMIT 1');
        if (rows.length === 0) {
            await connection.end();
            return res.status(404).json({ error: 'Nenhum produto na fila' });
        }
        const produto = rows[0];
        // Remove o produto do banco
        await connection.execute('DELETE FROM produtos WHERE id_produto = ?', [produto.id_produto]);
        console.log('Produto removido da fila, ID:', produto.id_produto);
        await connection.end();
        res.json({ message: 'Primeiro produto removido da fila', produto });
    } catch (error) {
        console.error('Erro ao remover produto da fila:', error.message);
        res.status(500).json({ error: 'Erro ao remover produto da fila' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});