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
npm install express mysql2 cors dotenv
```

- `express`: Framework para criar o servidor e rotas.
- `mysql2`: Pacote para interagir com o banco de dados MySQL.
- `cors`: Middleware para permitir requisições de diferentes origens.
- `dotenv`: Biblioteca para carregar variáveis de ambiente de um arquivo .env em seu projeto Node.js.

3. **Criação do arquivo `server.js`**:

Crie o arquivo `.env` e adicione nele as variáveis de ambiente e as informações para acesso ao bando de dados MySQL:

```plaintext
DB_HOST=localhost
DB_USER=seu_usuario_mysql
DB_PASSWORD=sua_senha_mysql
DB_NAME=nome_do_banco
PORT=5000
```

4. **Criação do arquivo `server.js`**:

Crie o arquivo `server.js` para configurar o servidor Express e a conexão com o MySQL.

```javascript
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Carregar variáveis do .env
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuração do banco de dados
const db = mysql.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbName
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
```

5. **Inicie o servidor**:

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


## Refatorando o Front-End com o Bootstrap 5

### **Passo 1: Adicionar o Bootstrap**

1. No diretório do front-end, adicione o Bootstrap ao projeto:

   - **Opção 1: Usar CDN**  
     Adicione o seguinte link no `public/index.html`, dentro da tag `<head>`:

     ```html
     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

     <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
     ```

   - **Opção 2: Instalar via npm**
     No terminal do front-end, execute:

     ```bash
     npm install bootstrap
     ```

     Em seguida, importe o Bootstrap no arquivo `src/index.js`:

     ```javascript
     import 'bootstrap/dist/css/bootstrap.min.css';
     ```

### **Passo 2: Refatorar o Layout em `App.js`**

Substitua o conteúdo de `App.js` por este código, que utiliza classes do Bootstrap para um layout mais organizado:

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
      .then(response => setColaboradores(response.data))
      .catch(error => console.error('Erro ao buscar colaboradores', error));
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
      .then(() => axios.get(apiUrl).then(response => setColaboradores(response.data)))
      .catch(error => console.error('Erro ao deletar colaborador', error));
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Gestão de Colaboradores</h1>

      <div className="card mb-4">
        <div className="card-header">Adicionar/Editar Colaborador</div>
        <div className="card-body">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              editId ? updateColaborador() : addColaborador();
            }}
          >
            <div className="row g-3">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome"
                  required
                />
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  placeholder="Cargo"
                  required
                />
              </div>
              <div className="col-md-4">
                <input
                  type="number"
                  className="form-control"
                  value={idade}
                  onChange={(e) => setIdade(e.target.value)}
                  placeholder="Idade"
                  required
                />
              </div>
            </div>
            <div className="mt-3 text-end">
              <button type="submit" className="btn btn-primary">
                {editId ? 'Atualizar' : 'Adicionar'}
              </button>
              {editId && (
                <button
                  type="button"
                  className="btn btn-secondary ms-2"
                  onClick={() => {
                    setNome('');
                    setCargo('');
                    setIdade('');
                    setEditId(null);
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <table className="table table-bordered table-striped">
        <thead>
          <tr className="table-primary">
            <th>Nome</th>
            <th>Cargo</th>
            <th>Idade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {colaboradores.map((colaborador) => (
            <tr key={colaborador.id}>
              <td>{colaborador.nome}</td>
              <td>{colaborador.cargo}</td>
              <td>{colaborador.idade}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => {
                    setNome(colaborador.nome);
                    setCargo(colaborador.cargo);
                    setIdade(colaborador.idade);
                    setEditId(colaborador.id);
                  }}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteColaborador(colaborador.id)}
                >
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
```

### **Explicação do Layout com Bootstrap**

1. **Estrutura Responsiva**:  
   A classe `container` centraliza e organiza o conteúdo, enquanto `row` e `col-md-*` dividem a tela em colunas responsivas.

2. **Botões e Formulários**:  
   Usamos classes como `form-control` para inputs e `btn btn-primary` para botões estilizados.

3. **Tabela Estilizada**:  
   A tabela utiliza `table`, `table-bordered`, e `table-striped` para uma aparência limpa e profissional.

4. **Cartões (Cards)**:  
   O formulário foi encapsulado em um card (`card`, `card-header`, e `card-body`) para separá-lo visualmente da tabela.

---

### **Passo 3: Executar o Projeto**

- Certifique-se de que o servidor back-end está rodando (`node server.js`).
- Inicie o front-end (`npm start`).

A aplicação agora terá um layout estilizado e organizado com **Bootstrap 5**! 🚀 

Se quiser adicionar mais elementos ou personalizações, como um tema de cores, o Bootstrap permite uma customização bastante flexível.