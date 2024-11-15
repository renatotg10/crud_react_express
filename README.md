# CRUD com React e Express
`Autor: Renato Teixeira Gomes - renatotgomes.dev@gmail.com`

Este é um projeto de CRUD (Create, Read, Update, Delete) utilizando **React** no front-end e **Express** no back-end. O banco de dados utilizado é o **MySQL**.

## Pré-requisitos

Antes de começar, você precisará ter o seguinte instalado no seu computador:

- **Node.js** (versão 12 ou superior)
- **MySQL** (para gerenciar o banco de dados)
- **npm** (gerenciador de pacotes do Node.js)
- **Postman** (opcional, mas recomendado para testar as APIs)

## Configuração do Projeto

### 1. Clonando o Repositório

Clone o repositório para sua máquina local:

```bash
git clone https://github.com/renatotg10/crud_react_express.git
cd crud-react-express
```

### 2. Configuração do Back-End (Express)

1. Navegue até a pasta do back-end e instale as dependências:

```bash
cd backend
npm install
```

2. Crie o arquivo `.env` e adicione nele as variáveis de ambiente e as informações para acesso ao bando de dados MySQL:

```plaintext
DB_HOST=localhost
DB_USER=seu_usuario_mysql
DB_PASSWORD=sua_senha_mysql
DB_NAME=nome_do_banco
PORT=5000
```

3. Inicie o servidor Express:

```bash
npm start
```

O servidor Express agora estará rodando em `http://localhost:5000`.

### 3. Configuração do Front-End (React)

1. Navegue até a pasta do front-end e instale as dependências:

```bash
cd frontend
npm install
```

2. Inicie o front-end:

```bash
npm start
```

O React será executado em `http://localhost:3000`.

### 4. Banco de Dados

Crie a tabela `colaboradores` no MySQL com o seguinte comando:

```sql
CREATE TABLE colaboradores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  cargo VARCHAR(255) NOT NULL,
  idade INT NOT NULL
);
```

Isso criará a tabela necessária para o CRUD.

### 5. Testando a Aplicação

Após seguir os passos de configuração, você pode acessar:

- O front-end em `http://localhost:3000`.
- O back-end em `http://localhost:5000`.

O front-end se comunica com a API do back-end para realizar as operações de **Create**, **Read**, **Update**, e **Delete**.

Você também pode usar o **Postman** ou qualquer outra ferramenta de testes de APIs para fazer requisições diretas para o back-end, como por exemplo:

- **GET**: `http://localhost:5000/colaboradores`
- **POST**: `http://localhost:5000/colaboradores`
- **PUT**: `http://localhost:5000/colaboradores/:id`
- **DELETE**: `http://localhost:5000/colaboradores/:id`

### 6. Construindo para Produção

Caso queira criar a versão de produção do projeto:

1. No front-end, execute:

```bash
npm run build
```

2. Para rodar a versão de produção, você pode usar um servidor como o **serve**:

```bash
npm install -g serve
serve -s build
```

Isso servirá o front-end compilado, que estará disponível em `http://localhost:5000` (ou outra porta configurada no Express).

## Contribuições

Sinta-se à vontade para contribuir! Para enviar uma contribuição:

1. Fork o repositório.
2. Crie uma nova branch (`git checkout -b minha-nova-funcionalidade`).
3. Faça suas alterações e faça commit (`git commit -am 'Adicionando nova funcionalidade'`).
4. Envie para o seu repositório (`git push origin minha-nova-funcionalidade`).
5. Abra um Pull Request.

## Documentação do Projeto

Se quiser saber como foi criado esse projeto, verifique a documentação no arquivo `Documentação.md` na raiz desse projeto.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE.md) para mais detalhes.
