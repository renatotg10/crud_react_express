# Tutorial CRUD com React e Express
`Autor: Renato Teixeira Gomes - renatotgomes.dev@gmail.com`

Neste tutorial iremos criar um CRUD utilizando React no Front-End e Express no Back-End, com uma API para comunicação entre as duas partes. O banco de dados utilizado será o MySQL.

### **Passo 1: Preparando o ambiente**

Antes de começarmos, você precisa ter algumas ferramentas instaladas no seu computador:

- **Node.js**: A versão mais recente pode ser baixada de [nodejs.org](https://nodejs.org/).
- **MySQL**: Instale o MySQL, se ainda não o fez, a partir de [mysql.com](https://www.mysql.com/).
- **Editor de código**: Use o [Visual Studio Code](https://code.visualstudio.com/) ou o editor de sua preferência.

### **Passo 2: Configuração do Banco de Dados MySQL**

1. **Criação do Banco de Dados e Tabela**:
   Abra o MySQL e crie um banco de dados e uma tabela para armazenar os dados do CRUD (colaboradores, por exemplo).

```sql
CREATE DATABASE crud_react_express;

USE crud_react_express;

CREATE TABLE colaboradores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cargo VARCHAR(255) NOT NULL,
    idade INT NOT NULL
);
```

### **Passo 3: Configuração do Back-End (Express)**

1. **Inicialize o projeto**:
   Crie um diretório para o back-end e inicie o projeto Node.js:

```bash
mkdir backend
cd backend
npm init -y
```

2. **Instalar dependências**:

```bash
npm install express mysql2 cors
```

- `express`: Framework para criar o servidor e rotas.
- `mysql2`: Pacote para interagir com o banco de dados MySQL.
- `cors`: Middleware para permitir requisições de diferentes origens.

3. **Criação do arquivo `server.js`**:

Crie o arquivo `server.js` para configurar o servidor Express e a conexão com o MySQL.

```javascript
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
    user: 'root',   // Alterar conforme necessário
    password: '',   // Alterar conforme necessário
    database: 'crud_react_express'
});

// Conectar ao banco de dados
db.connect((err) => {
    if (err) {
        console.error('Erro de conexão:', err);
    } else {
        console.log('Conectado ao banco de dados');
    }
});

// CRUD APIs

// Criar novo colaborador
app.post('/colaboradores', (req, res) => {
    const { nome, cargo, idade } = req.body;
    const query = 'INSERT INTO colaboradores (nome, cargo, idade) VALUES (?, ?, ?)';
    
    db.query(query, [nome, cargo, idade], (err, result) => {
        if (err) {
            res.status(500).send('Erro ao adicionar colaborador');
        } else {
            res.status(201).send('Colaborador adicionado');
        }
    });
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
            res.status(500).send('Erro ao atualizar colaborador');
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
            res.status(500).send('Erro ao deletar colaborador');
        } else {
            res.status(200).send('Colaborador deletado');
        }
    });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
```

4. **Inicie o servidor**:

```bash
node server.js
```

Agora, o back-end está pronto e rodando na porta `5000`.

### **Passo 4: Configuração do Front-End (React)**

1. **Criação do projeto React**:
   
Abra o terminal e crie o projeto React na pasta do Front-End:

```bash
npx create-react-app frontend
cd frontend
```

2. **Instalar Axios**:

O Axios será utilizado para realizar as requisições à API.

```bash
npm install axios
```

3. **Criação do arquivo `App.js`**:

Edite o `src/App.js` para fazer a comunicação com a API criada no Express. Adicionaremos as funções para criar, listar, atualizar e excluir colaboradores.

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [colaboradores, setColaboradores] = useState([]);
  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('');
  const [idade, setIdade] = useState('');
  const [editId, setEditId] = useState(null);

  const apiUrl = 'http://localhost:5000/colaboradores';

  useEffect(() => {
    axios.get(apiUrl)
      .then(response => {
        setColaboradores(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar colaboradores', error);
      });
  }, []);

  const addColaborador = () => {
    axios.post(apiUrl, { nome, cargo, idade })
      .then(() => {
        setNome('');
        setCargo('');
        setIdade('');
        setEditId(null);
        axios.get(apiUrl).then(response => setColaboradores(response.data));
      })
      .catch(error => console.error('Erro ao adicionar colaborador', error));
  };

  const updateColaborador = () => {
    axios.put(`${apiUrl}/${editId}`, { nome, cargo, idade })
      .then(() => {
        setNome('');
        setCargo('');
        setIdade('');
        setEditId(null);
        axios.get(apiUrl).then(response => setColaboradores(response.data));
      })
      .catch(error => console.error('Erro ao atualizar colaborador', error));
  };

  const deleteColaborador = (id) => {
    axios.delete(`${apiUrl}/${id}`)
      .then(() => {
        axios.get(apiUrl).then(response => setColaboradores(response.data));
      })
      .catch(error => console.error('Erro ao deletar colaborador', error));
  };

  return (
    <div className="App">
      <h1>Gestão de Colaboradores</h1>
      <div>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome"
        />
        <input
          type="text"
          value={cargo}
          onChange={(e) => setCargo(e.target.value)}
          placeholder="Cargo"
        />
        <input
          type="number"
          value={idade}
          onChange={(e) => setIdade(e.target.value)}
          placeholder="Idade"
        />
        {editId ? (
          <button onClick={updateColaborador}>Atualizar</button>
        ) : (
          <button onClick={addColaborador}>Adicionar</button>
        )}
      </div>

      <ul>
        {colaboradores.map((colaborador) => (
          <li key={colaborador.id}>
            {colaborador.nome} - {colaborador.cargo} - {colaborador.idade} anos
            <button onClick={() => {
              setNome(colaborador.nome);
              setCargo(colaborador.cargo);
              setIdade(colaborador.idade);
              setEditId(colaborador.id);
            }}>Editar</button>
            <button onClick={() => deleteColaborador(colaborador.id)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

### **Passo 5: Rodando o Front-End**

1. No diretório `frontend`, inicie o servidor do React:

```bash
npm start
```

Isso abrirá a aplicação no navegador, geralmente na URL `http://localhost:3000`.

### **Passo 6: Testando o CRUD**

Agora, você pode testar as funcionalidades:

1. Adicionar um colaborador.
2. Listar todos os colaboradores.
3. Editar um colaborador.
4. Excluir um colaborador.

Essas ações devem ser refletidas no banco de dados MySQL e na interface do React.



### **Conclusão**

Você agora tem um CRUD completo com React no Front-End e Express no Back-End, interagindo com um banco de dados MySQL. Se precisar de melhorias ou personalizações, como validação de formulários ou tratamentos de erro mais avançados, você pode expandir esse código conforme necessário.