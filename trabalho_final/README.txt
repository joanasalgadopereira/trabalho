- Entre Patas

Entre Patas é uma aplicação web para gestão de pedidos de serviços de cuidados para animais.

A aplicação permite consultar os serviços disponíveis, efetuar pedidos de reserva e, através de uma área de administração, gerir reservas e horários.

## Tecnologias utilizadas

- HTML
- CSS
- JavaScript
- Node.js
- Express
- MySQL
- MySQL2
- JWT
- Bcrypt
- Nodemailer

## Como iniciar o projeto

### 1. Base de dados

Iniciar o MySQL e garantir que a base de dados `entre_patas` está criada.

Caso seja necessário criar a base de dados de raiz, executar o ficheiro:


scheme.sql


O ficheiro `testes.sql` contém consultas e dados destinados a testes da base de dados.

### 2. Abrir o terminal na pasta do projeto


cd projeto


### 3. Instalar as dependências

Na primeira utilização do projeto:


npm i


### 4. Iniciar o servidor


npm run dev


O backend fica disponível em:


http://localhost:3000


### 5. Abrir o frontend

Abrir o ficheiro:


trabalho.html


Pode ser utilizado o **Live Server** do Visual Studio Code ou o ficheiro pode ser aberto diretamente no browser.

## Área de administração

A área de administração permite:

- consultar e gerir reservas;
- confirmar ou concluir reservas;
- eliminar reservas;
- criar horários;
- editar horários;
- bloquear ou disponibilizar horários;
- eliminar horários sem reservas associadas.

O acesso é protegido através de autenticação.

## Reservas

Os pedidos efetuados pelo formulário são inicialmente guardados com o estado:


pendente


A reserva apenas fica efetivamente confirmada depois de ser alterada para:


confirmada


O sistema verifica conflitos entre reservas confirmadas e impede a confirmação de períodos sobrepostos.

## Estrutura principal


projeto/
├── imagens_final/
├── admin.html
├── db.js
├── horarios.html
├── horarios.js
├── login.html
├── login.js
├── marcacao.html
├── reservas.html
├── reservas.js
├── scheme.sql
├── server.js
├── servicos.html
├── testes.sql
├── trabalho.css
├── trabalho.html
├── trabalho.js
├── package.json
└── .env


## Nota

O ficheiro `.env` contém as configurações locais necessárias para a ligação à base de dados, autenticação e envio de emails.

PS: Sempre que é feito um pedido de reserva, eu recebo um email que criei para o projeto.