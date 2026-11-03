// CARREGAR AS VARIÁVEIS DO .ENV

require("dotenv").config();


// IMPORTAR O MYSQL

const mysql = require("mysql2");


// CRIAR O POOL DE LIGAÇÕES À BASE DE DADOS

const ligacao = mysql.createPool({

    host: process.env.DB_HOST,

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME,

    dateStrings: true,

    waitForConnections: true,

    connectionLimit: 10,

    queueLimit: 0

});


// TESTAR A LIGAÇÃO À BASE DE DADOS

ligacao.promise()
    .query("SELECT 1")
    .then(function () {

        console.log(
            "Ligação à base de dados efetuada com sucesso!"
        );

    })
    .catch(function (erro) {

        console.log(
            "Não foi possível ligar à base de dados."
        );

        console.log(erro.message);

    });


// EXPORTAR O POOL DE LIGAÇÕES

module.exports = ligacao;