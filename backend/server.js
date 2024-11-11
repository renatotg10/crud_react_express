const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuração do banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'crud_react_express'
});

// Conectar ao banco de dados
db.connect((err) => {
    if (err) {
        console.error('Erro de conexão: ', err);
    } else {
        console.log('Conectado ao banco de dados');
    }
});

// CURD APIs

// Criar novo colaborador
app.post('/colaboradores', (req, res) => {
    const { nome, cargo, idade } = req.body;
    const query = 'INSERT INTO colaboradores (nome, cargo, idade) VALUES (?, ?,?)';

    db.query(query, [nome, cargo, idade], (err, result) => {
        if (err) {
            res.status(500).send('Erro ao adicionar colaborador: ' + err);
        } else {
            res.status(201).send('Colaborador adicionado');
        }
    })
});

// Obter todos os colaboradores
app.get('/colaboradores', (req, res) => {
    const query = 'SELECT * FROM colaboradores';

    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send('Erro ao buscar colaboradores');
        } else {
            res.status(200).json(results);
        }
    });
});

// Atualizar colaborador
app.put('/colaboradores/:id', (req, res) => {
    const { nome, cargo, idade } = req.body;
    const { id } = req.params;
    const query = 'UPDATE colaboradores SET nome = ?, cargo = ?, idade = ? WHERE id = ?';

    db.query(query, [nome, cargo, idade, id], (err, result) => {
        if (err) {
            res.status(500).send('Erro ao atualizar colaborador' + err);
        } else {
            res.status(200).send('Colaborador atualizado');
        }
    });
});

// Deletar colaborador
app.delete('/colaboradores/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM colaboradores WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            res.status(500).send('Erro ao deletar colaborador' + err);
        } else {
            res.status(200).send('Colaborador deletado');
        }
    });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});