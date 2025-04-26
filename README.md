# Projeto Estoque IMDAZ

Este é um sistema para gerenciamento de estoque de produtos perecíveis e doadores do Instituto de Menores Dom Antônio Zattera, utilizando Node.js, Express, MySQL e JavaScript no frontend.

## Pré-requisitos
- **Node.js** (v16 ou superior)
- **MySQL** (v8 ou superior)
- Navegador web (Chrome, Firefox, etc.)
- Terminal (para comandos)

## Estrutura do Projeto
- `app.js`: Backend com Express, conecta ao MySQL e gerencia APIs.
- `cliente.js`: Lógica JavaScript do frontend para interagir com as APIs.
- `index.html`: Página inicial.
- `estoque.html`: Página para consultar o estoque.
- `doadores.html`: Página para gerenciar doadores.
- `cadastro-produto.html`: Página para cadastrar produtos.
- `styles.css`: Estilos CSS.
- `estoque_imdaz.sql`: Dump do banco de dados MySQL.

## Configuração

### 1. Configurar o Banco de Dados
1. Instale o MySQL no seu computador.
2. Inicie o serviço MySQL:
   ```bash
   # No Windows
   # No Linux/Mac:
   sudo service mysql start
   ```
3. Crie o banco de dados `estoque_imdaz`:
   ```bash
   mysql -u root -p
   # Digite a senha: 1234
   CREATE DATABASE estoque_imdaz;
   EXIT;
   ```
4. Importe o banco de dados:
   ```bash
   mysql -u root -p estoque_imdaz < estoque_imdaz.sql
   # Digite a senha: 1234
   ```

### 2. Instalar Dependências
1. Certifique-se de que o Node.js está instalado:
   ```bash
   node -v
   ```
2. Navegue até a pasta do projeto:
   ```bash
   cd caminho/para/projeto_estoque_imdaz
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
   (Isso instalará `express`, `mysql2`, e `cors` se `package.json` estiver presente. Caso contrário, instale manualmente:
   ```bash
   npm install express mysql2 cors
   ```)

### 3. Iniciar o Servidor
1. Inicie o servidor Node.js:
   ```bash
   node app.js
   ```
2. O servidor estará rodando em `http://localhost:3000`.

### 4. Acessar o Sistema
- Abra um navegador e acesse `http://localhost:3000`.
- Navegue pelas opções para cadastrar produtos, consultar estoque ou gerenciar doadores.

## Notas
- A senha do MySQL no código (`app.js`) está configurada como `1234`. Se usar uma senha diferente, atualize a constante `dbConfig` em `app.js`.
- Certifique-se de que a porta 3000 não está em uso.
- O banco de dados usa uma pilha (LIFO) para inserção de produtos e uma fila (FIFO) para exibição/remoção do estoque.

## Solução de Problemas
- **Erro de conexão com MySQL**: Verifique se o MySQL está ativo e se a senha em `app.js` está correta.
- **Erro "porta em uso"**: Mude a porta em `app.js` (altere `const port = 3000` para outro valor, como `3001`).
- **Dependências não instaladas**: Execute `npm install` novamente.