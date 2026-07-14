# Cadastro de Cidadãos

Aplicação web para cadastro e pesquisa de cidadãos brasileiros pelo nome ou CPF.

O projeto foi desenvolvido como solução para um desafio técnico, com foco em organização, orientação a objetos, separação de responsabilidades, testes automatizados e facilidade de execução.

## Funcionalidades

- Cadastro de cidadãos com nome completo e CPF;
- Validação automática dos dígitos verificadores do CPF;
- Normalização do CPF antes do armazenamento;
- Bloqueio de CPFs duplicados;
- Pesquisa por CPF, com ou sem formatação;
- Pesquisa parcial por nome;
- Exibição dos cidadãos encontrados;
- Mensagens amigáveis de sucesso e erro;
- Persistência dos dados em SQLite;
- Interface responsiva;
- Testes automatizados das regras de negócio.

## Tecnologias utilizadas

### Backend

- Node.js;
- TypeScript;
- Express;
- Prisma ORM;
- SQLite.

### Frontend

- HTML;
- CSS;
- JavaScript.

### Testes

- Vitest.

## Requisitos

Antes de começar, tenha instalado:

- Node.js 24 ou superior;
- npm;
- Git.

## Instalação

Clone o repositório:

```bash
git clone URL_DO_REPOSITORIO
```

Entre na pasta do projeto:

```bash
cd cadastro-cidadaos
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo local de variáveis de ambiente:

```bash
cp .env.example .env
```

Gere o Prisma Client e aplique as migrations:

```bash
npm run setup
```

## Executando em desenvolvimento

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em:

```text
http://localhost:3000
```

A rota de verificação do servidor estará disponível em:

```text
http://localhost:3000/health
```

## Executando a versão compilada

Compile o TypeScript:

```bash
npm run build
```

Inicie a aplicação compilada:

```bash
npm start
```

## Executando os testes

Para executar todos os testes uma vez:

```bash
npm test
```

Para manter os testes em execução durante o desenvolvimento:

```bash
npm run test:watch
```

Para executar build e testes em sequência:

```bash
npm run check
```

## Banco de dados

A aplicação utiliza SQLite. O banco é armazenado em um arquivo local e não precisa de um servidor de banco de dados separado.

Para aplicar as migrations existentes:

```bash
npm run db:deploy
```

Para criar uma nova migration durante o desenvolvimento:

```bash
npm run db:migrate
```

Para gerar novamente o Prisma Client:

```bash
npm run db:generate
```

Para visualizar os dados pelo Prisma Studio:

```bash
npm run db:studio
```

## API

### Cadastrar cidadão

```http
POST /api/citizens
```

Corpo da requisição:

```json
{
  "fullName": "Maria da Silva",
  "cpf": "529.982.247-25"
}
```

Resposta de sucesso:

```json
{
  "message": "Cidadão cadastrado com sucesso.",
  "citizen": {
    "id": 1,
    "fullName": "Maria da Silva",
    "cpf": "52998224725"
  }
}
```

### Pesquisar cidadão

```http
GET /api/citizens?query=Maria
```

A consulta pode conter:

- parte do nome do cidadão;
- CPF com formatação;
- CPF sem formatação.

Resposta de sucesso:

```json
{
  "citizens": [
    {
      "id": 1,
      "fullName": "Maria da Silva",
      "cpf": "52998224725"
    }
  ]
}
```

Quando nenhum cidadão é encontrado:

```json
{
  "message": "Cidadão não encontrado"
}
```

## Estrutura do projeto

```text
cadastro-cidadaos/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── public/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── src/
│   ├── controllers/
│   ├── database/
│   ├── errors/
│   ├── middlewares/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   ├── app.ts
│   └── server.ts
├── tests/
│   ├── fakes/
│   └── unit/
├── .env.example
├── package.json
├── prisma.config.ts
└── tsconfig.json
```

## Arquitetura

O backend foi organizado em camadas:

- **Controller:** recebe requisições HTTP e produz respostas;
- **Service:** concentra as regras de negócio;
- **Repository:** realiza operações de persistência;
- **Validator:** contém a validação matemática do CPF;
- **Middleware:** centraliza o tratamento de erros.

O serviço depende de um contrato de repositório. Durante a execução normal, esse contrato é implementado pelo repositório com Prisma. Nos testes unitários, ele é substituído por um repositório em memória.

Essa separação reduz o acoplamento e permite testar as regras de negócio sem depender de um banco real.

## Regras de validação

No cadastro:

- nome e CPF são obrigatórios;
- o nome precisa possuir pelo menos três caracteres;
- espaços duplicados no nome são removidos;
- o CPF precisa conter 11 dígitos;
- os dígitos verificadores são calculados;
- sequências repetidas, como `111.111.111-11`, são rejeitadas;
- o CPF é armazenado somente com números;
- um CPF não pode ser cadastrado mais de uma vez.

## Decisões técnicas

### SQLite

Foi escolhido por não exigir a instalação de um servidor separado, simplificando a execução e avaliação do projeto.

### TypeScript

Foi utilizado para melhorar a segurança de tipos, a clareza dos contratos e a manutenção do código.

### Prisma

Foi utilizado para gerenciar o schema, as migrations e o acesso tipado ao banco.

### Frontend sem framework

A interface é pequena e possui somente dois formulários. HTML, CSS e JavaScript foram suficientes para atender ao escopo sem adicionar complexidade desnecessária.

## Licença

Projeto desenvolvido exclusivamente para fins de avaliação técnica.
