// CARREGAR AS VARIÁVEIS DO .ENV

require("dotenv").config();


// IMPORTAR O EXPRESS

const express = require("express");


// IMPORTAR O CORS

const cors = require("cors");


// IMPORTAR A LIGAÇÃO À BASE DE DADOS

const ligacao = require("./db");


// IMPORTAR O BCRYPT

const bcrypt = require("bcryptjs");


// IMPORTAR O JSON WEB TOKEN

const jwt = require("jsonwebtoken");


// IMPORTAR O NODEMAILER

const nodemailer = require("nodemailer");


// CRIAR A APLICAÇÃO

const app = express();


// PERMITIR A COMUNICAÇÃO COM O FRONTEND

app.use(cors());


// PERMITIR RECEBER JSON

app.use(
    express.json({
        limit: "100kb"
    })
);


// DEFINIR A PORTA

const PORT =
    Number(process.env.PORT) || 3000;


// CHAVE PARA CRIAR OS TOKENS

const chaveToken =
    process.env.JWT_SECRET;


// VERIFICAR SE A CHAVE JWT EXISTE

if (!chaveToken) {

    console.log(
        "Erro: JWT_SECRET não está definida no ficheiro .env."
    );

    process.exit(1);

}


// VERIFICAR SE OS DADOS DO EMAIL EXISTEM

const emailConfigurado =
    Boolean(
        process.env.EMAIL_USER &&
        process.env.EMAIL_APP_PASSWORD &&
        process.env.EMAIL_DESTINO
    );


// CRIAR O TRANSPORTE DE EMAIL

let transporteEmail = null;

if (emailConfigurado) {

    transporteEmail =
        nodemailer.createTransport({

            service: "gmail",

            auth: {

                user:
                    process.env.EMAIL_USER,

                pass:
                    process.env.EMAIL_APP_PASSWORD.replace(
                        /\s/g,
                        ""
                    )

            }

        });


    // TESTAR A LIGAÇÃO AO EMAIL

    transporteEmail
        .verify()
        .then(function () {

            console.log(
                "Serviço de email preparado com sucesso!"
            );

        })
        .catch(function (erro) {

            console.log(
                "Não foi possível autenticar o serviço de email."
            );

            console.log(
                erro.message
            );

        });

}

else {

    console.log(
        "Aviso: dados de email incompletos no ficheiro .env."
    );

}


// ENVIAR EMAIL DE NOVA RESERVA

async function enviarEmailNovaReserva(
    dados,
    horario,
    nomeServico,
    idReserva
) {

    if (!transporteEmail) {

        console.log(
            "Aviso: o pedido foi guardado, mas o serviço de email não está configurado."
        );

        return false;

    }


    const horaInicio =
        dados.hora_inicio.slice(
            0,
            5
        );

    const horaFim =
        dados.hora_fim.slice(
            0,
            5
        );


    const partesData =
        String(horario.data).split("-");

    const dataFormatada =
        partesData.length === 3
            ? partesData[2] +
              "/" +
              partesData[1] +
              "/" +
              partesData[0]
            : horario.data;


    let textoTaxi =
        "Não";

    if (
        Number(dados.id_servico) === 6 ||
        dados.incluir_taxi === true ||
        dados.incluir_taxi === 1
    ) {

        textoTaxi =
            "Sim" +
            "\nOrigem: " +
            (dados.origem_taxi || "-") +
            "\nDestino: " +
            (dados.destino_taxi || "-") +
            "\nData do Taxi: " +
            (dados.data_taxi || "-") +
            "\nHora do Taxi: " +
            (dados.hora_taxi || "-");

    }


    const textoEmail =
        "Novo pedido de reserva - Entre Patas\n\n" +
        "Reserva: #" + idReserva + "\n" +
        "Estado: Pendente\n\n" +
        "Tutor: " + dados.nome_tutor + "\n" +
        "Telefone: " + dados.telefone + "\n" +
        "Email: " + dados.email + "\n\n" +
        "Animal: " + dados.nome_animal + "\n" +
        "Espécie: " + dados.especie + "\n\n" +
        "Serviço: " + nomeServico + "\n" +
        "Data: " + dataFormatada + "\n" +
        "Horário pedido: " + horaInicio + " - " + horaFim + "\n\n" +
        "Concelho: " + dados.concelho + "\n" +
        "Morada: " + dados.morada_servico + "\n" +
        "Código postal: " + dados.codigo_postal + "\n\n" +
        "Entre Patas Taxi: " + textoTaxi + "\n\n" +
        "Observações: " + (dados.observacoes || "Sem observações") + "\n";


    try {

        await transporteEmail.sendMail({

            from:
                "Entre Patas <" +
                process.env.EMAIL_USER +
                ">",

            to:
                process.env.EMAIL_DESTINO,

            replyTo:
                dados.email,

            subject:
                "Novo pedido de reserva #" +
                idReserva +
                " - Entre Patas",

            text:
                textoEmail

        });


        console.log(
            "Notificação da reserva #" +
            idReserva +
            " enviada por email."
        );

        return true;

    }

    catch (erro) {

        console.log(
            "A reserva foi criada, mas não foi possível enviar a notificação por email."
        );

        console.log(
            erro.message
        );

        return false;

    }

}


// VERIFICAR SE O ERRO É DE LIGAÇÃO À BASE DE DADOS

function baseDadosIndisponivel(erro) {

    const codigosErroLigacao = [

        "ECONNREFUSED",
        "PROTOCOL_CONNECTION_LOST",
        "ETIMEDOUT",
        "EHOSTUNREACH",
        "ENOTFOUND",
        "ER_CON_COUNT_ERROR",
        "ER_ACCESS_DENIED_ERROR",
        "ER_BAD_DB_ERROR"

    ];

    return codigosErroLigacao.includes(
        erro.code
    );

}


// RESPONDER A ERROS DA BASE DE DADOS

function responderErroBaseDados(
    res,
    erro,
    mensagemErro
) {

    console.log(mensagemErro);

    console.log(erro);


    // BASE DE DADOS INDISPONÍVEL

    if (baseDadosIndisponivel(erro)) {

        return res.status(503).json({

            mensagem:
                "Serviço temporariamente indisponível. Tenta novamente mais tarde."

        });

    }


    // OUTRO ERRO DO SERVIDOR

    return res.status(500).json({

        mensagem:
            "Ocorreu um erro no servidor."

    });

}


// CALCULAR A DURAÇÃO EM MINUTOS

function calcularDuracaoMinutos(
    horaInicio,
    horaFim
) {

    const partesInicio =
        horaInicio
            .slice(0, 5)
            .split(":")
            .map(Number);

    const partesFim =
        horaFim
            .slice(0, 5)
            .split(":")
            .map(Number);


    const minutosInicio =
        partesInicio[0] * 60 +
        partesInicio[1];

    const minutosFim =
        partesFim[0] * 60 +
        partesFim[1];


    return (
        minutosFim -
        minutosInicio
    );

}


// VERIFICAR O TOKEN DO ADMINISTRADOR

function verificarToken(
    req,
    res,
    next
) {

    const autorizacao =
        req.headers.authorization;


    if (
        !autorizacao ||
        !autorizacao.startsWith("Bearer ")
    ) {

        return res.status(401).json({

            mensagem:
                "Acesso não autorizado."

        });

    }


    const token =
        autorizacao.split(" ")[1];


    jwt.verify(

        token,

        chaveToken,

        function (
            erro,
            dadosToken
        ) {

            if (erro) {

                return res.status(403).json({

                    mensagem:
                        "Sessão inválida ou expirada."

                });

            }


            req.admin =
                dadosToken;

            next();

        }

    );

}


// CRIAR UMA ROTA DE TESTE

app.get(
    "/",
    function (req, res) {

        res.send(
            "Entre Patas - servidor com CORS ativo!"
        );

    }
);


// VERIFICAR O ESTADO DO SERVIDOR E DA BASE DE DADOS

app.get(
    "/api/estado",
    async function (req, res) {

        try {

            await ligacao
                .promise()
                .query(
                    "SELECT 1"
                );


            res.status(200).json({

                servidor:
                    "online",

                base_dados:
                    "online"

            });

        }

        catch (erro) {

            console.log(
                "A base de dados está indisponível:"
            );

            console.log(erro);


            res.status(503).json({

                servidor:
                    "online",

                base_dados:
                    "offline"

            });

        }

    }
);


// LISTAR OS SERVIÇOS

app.get(
    "/api/servicos",
    async function (req, res) {

        try {

            const [resultados] =
                await ligacao
                    .promise()
                    .query(
                        "SELECT * FROM servicos"
                    );

            res.json(resultados);

        }

        catch (erro) {

            return responderErroBaseDados(
                res,
                erro,
                "Erro ao consultar os serviços:"
            );

        }

    }
);


// LISTAR OS HORÁRIOS

app.get(
    "/api/horarios",
    verificarToken,
    async function (req, res) {

        try {

            const [resultados] =
                await ligacao
                    .promise()
                    .query(
                        `
                        SELECT *
                        FROM horarios
                        ORDER BY
                            data,
                            hora_inicio
                        `
                    );

            res.json(resultados);

        }

        catch (erro) {

            return responderErroBaseDados(
                res,
                erro,
                "Erro ao consultar os horários:"
            );

        }

    }
);


// LISTAR OS HORÁRIOS DISPONÍVEIS

app.get(
    "/api/horarios/disponiveis",
    async function (req, res) {

        try {

            const [resultados] =
                await ligacao
                    .promise()
                    .query(
                        `
                        SELECT
                            id_horario,
                            data,
                            hora_inicio,
                            hora_fim,
                            estado

                        FROM horarios

                        WHERE
                            estado = 'disponivel'
                            AND data >= CURDATE()

                        ORDER BY
                            data,
                            hora_inicio
                        `
                    );

            res.json(resultados);

        }

        catch (erro) {

            return responderErroBaseDados(
                res,
                erro,
                "Erro ao consultar os horários disponíveis:"
            );

        }

    }
);


// LISTAR AS RESERVAS

app.get(
    "/api/reservas",
    verificarToken,
    async function (req, res) {

        const sql = `
            SELECT
                r.id_reserva,
                r.nome_tutor,
                r.telefone,
                r.email,
                r.nome_animal,
                r.especie,
                r.concelho,
                r.morada_servico,
                r.codigo_postal,
                r.incluir_taxi,
                r.origem_taxi,
                r.destino_taxi,
                r.data_taxi,
                r.hora_taxi,
                r.observacoes,
                r.estado,
                r.criado_em,
                r.hora_inicio,
                r.hora_fim,
                s.nome AS servico,
                h.data

            FROM reservas AS r

            INNER JOIN servicos AS s
                ON r.id_servico = s.id_servico

            INNER JOIN horarios AS h
                ON r.id_horario = h.id_horario

            ORDER BY
                h.data,
                r.hora_inicio
        `;


        try {

            const [resultados] =
                await ligacao
                    .promise()
                    .query(sql);

            res.json(resultados);

        }

        catch (erro) {

            return responderErroBaseDados(
                res,
                erro,
                "Erro ao consultar as reservas:"
            );

        }

    }
);


// CRIAR UMA RESERVA

app.post(
    "/api/reservas",
    async function (req, res) {

        const dados =
            req.body;


        // VALIDAR OS CAMPOS OBRIGATÓRIOS

        if (
            !dados.id_servico ||
            !dados.id_horario ||
            !dados.hora_inicio ||
            !dados.hora_fim ||
            !dados.nome_tutor ||
            !dados.telefone ||
            !dados.email ||
            !dados.nome_animal ||
            !dados.especie ||
            !dados.concelho ||
            !dados.morada_servico ||
            !dados.codigo_postal
        ) {

            return res.status(400).json({

                mensagem:
                    "Existem campos obrigatórios por preencher."

            });

        }


        // VALIDAR O CÓDIGO POSTAL

        const formatoCodigoPostal =
            /^\d{4}-\d{3}$/;

        if (
            !formatoCodigoPostal.test(
                dados.codigo_postal
            )
        ) {

            return res.status(400).json({

                mensagem:
                    "Indica um código postal válido no formato 0000-000."

            });

        }


        // VALIDAR AS HORAS

        if (
            dados.hora_fim <=
            dados.hora_inicio
        ) {

            return res.status(400).json({

                mensagem:
                    "A hora de fim tem de ser posterior à hora de início."

            });

        }


        // VERIFICAR SE EXISTE PET TAXI

        const temTaxi =
            Number(dados.id_servico) === 6 ||
            dados.incluir_taxi === true ||
            dados.incluir_taxi === 1;


        // VALIDAR OS DADOS DO TAXI

        if (
            temTaxi &&
            (
                !dados.origem_taxi ||
                !dados.destino_taxi ||
                !dados.data_taxi ||
                !dados.hora_taxi
            )
        ) {

            return res.status(400).json({

                mensagem:
                    "Preenche os dados necessários do Entre Patas Taxi."

            });

        }


        try {


            // PROCURAR A DISPONIBILIDADE ESCOLHIDA

            const [horarios] =
                await ligacao
                    .promise()
                    .execute(
                        `
                        SELECT
                            id_horario,
                            data,
                            hora_inicio,
                            hora_fim,
                            estado

                        FROM horarios

                        WHERE
                            id_horario = ?
                        `,
                        [
                            dados.id_horario
                        ]
                    );


            if (
                horarios.length === 0
            ) {

                return res.status(404).json({

                    mensagem:
                        "A disponibilidade escolhida não existe."

                });

            }


            const horario =
                horarios[0];


            // VERIFICAR SE ESTÁ DISPONÍVEL

            if (
                horario.estado !==
                "disponivel"
            ) {

                return res.status(409).json({

                    mensagem:
                        "Esta disponibilidade encontra-se bloqueada."

                });

            }


            // FORMATAR AS HORAS

            const horaInicioPedida =
                dados.hora_inicio.length === 5
                    ? dados.hora_inicio + ":00"
                    : dados.hora_inicio;

            const horaFimPedida =
                dados.hora_fim.length === 5
                    ? dados.hora_fim + ":00"
                    : dados.hora_fim;


            // VERIFICAR SE O PEDIDO CABE NA DISPONIBILIDADE

            if (
                horaInicioPedida <
                    horario.hora_inicio ||
                horaFimPedida >
                    horario.hora_fim
            ) {

                return res.status(409).json({

                    mensagem:
                        "O período escolhido está fora do horário disponível."

                });

            }


            // PROCURAR O SERVIÇO

            const [servicos] =
                await ligacao
                    .promise()
                    .execute(
                        `
                        SELECT
                            nome
                        FROM servicos
                        WHERE id_servico = ?
                        `,
                        [
                            dados.id_servico
                        ]
                    );


            if (
                servicos.length === 0
            ) {

                return res.status(404).json({

                    mensagem:
                        "O serviço escolhido não existe."

                });

            }


            const nomeServico =
                servicos[0].nome;


            // CALCULAR A DURAÇÃO DO SERVIÇO

            const duracaoMinutos =
                calcularDuracaoMinutos(
                    horaInicioPedida,
                    horaFimPedida
                );

            const idServico =
                Number(
                    dados.id_servico
                );


            // VALIDAR A DURAÇÃO DO PASSEIO

            if (
                idServico === 2 &&
                duracaoMinutos !== 30 &&
                duracaoMinutos !== 60
            ) {

                return res.status(400).json({

                    mensagem:
                        "O passeio deve ter uma duração de 30 ou 60 minutos."

                });

            }


            // VALIDAR O PACK ESSENCIAL

            if (
                idServico === 3 &&
                duracaoMinutos > 360
            ) {

                return res.status(400).json({

                    mensagem:
                        "O Pack Entre Patas Essencial permite até 6 horas."

                });

            }


            // VALIDAR O PACK CONFORTO

            if (
                idServico === 4 &&
                duracaoMinutos > 480
            ) {

                return res.status(400).json({

                    mensagem:
                        "O Pack Entre Patas Conforto permite até 8 horas."

                });

            }


            // VALIDAR O PACK COMPLETO

            if (
                idServico === 5 &&
                duracaoMinutos > 600
            ) {

                return res.status(400).json({

                    mensagem:
                        "O Pack Entre Patas Completo permite até 10 horas."

                });

            }


            // PROCURAR RESERVAS CONFIRMADAS SOBREPOSTAS

            const [reservasConfirmadas] =
                await ligacao
                    .promise()
                    .execute(
                        `
                        SELECT
                            r.id_reserva

                        FROM reservas AS r

                        INNER JOIN horarios AS h
                            ON r.id_horario = h.id_horario

                        WHERE
                            h.data = ?
                            AND r.estado = 'confirmada'
                            AND r.hora_inicio < ?
                            AND r.hora_fim > ?

                        LIMIT 1
                        `,
                        [
                            horario.data,
                            horaFimPedida,
                            horaInicioPedida
                        ]
                    );


            // HORÁRIO JÁ CONFIRMADO PARA OUTRA RESERVA

            if (
                reservasConfirmadas.length > 0
            ) {

                return res.status(409).json({

                    mensagem:
                        "Este período já se encontra ocupado por uma reserva confirmada."

                });

            }


            // CRIAR A RESERVA PENDENTE

            const [resultado] =
                await ligacao
                    .promise()
                    .execute(
                        `
                        INSERT INTO reservas
                        (
                            id_servico,
                            id_horario,
                            hora_inicio,
                            hora_fim,
                            nome_tutor,
                            telefone,
                            email,
                            nome_animal,
                            especie,
                            concelho,
                            morada_servico,
                            codigo_postal,
                            incluir_taxi,
                            origem_taxi,
                            destino_taxi,
                            data_taxi,
                            hora_taxi,
                            observacoes,
                            estado
                        )

                        VALUES
                        (
                            ?, ?, ?, ?, ?, ?, ?, ?, ?,
                            ?, ?, ?, ?, ?, ?, ?, ?, ?,
                            'pendente'
                        )
                        `,
                        [
                            dados.id_servico,
                            dados.id_horario,
                            horaInicioPedida,
                            horaFimPedida,
                            dados.nome_tutor,
                            dados.telefone,
                            dados.email,
                            dados.nome_animal,
                            dados.especie,
                            dados.concelho,
                            dados.morada_servico,
                            dados.codigo_postal,
                            dados.incluir_taxi || false,
                            dados.origem_taxi || null,
                            dados.destino_taxi || null,
                            dados.data_taxi || null,
                            dados.hora_taxi || null,
                            dados.observacoes || null
                        ]
                    );


            // ENVIAR A NOTIFICAÇÃO POR EMAIL

            await enviarEmailNovaReserva(

                {
                    ...dados,

                    hora_inicio:
                        horaInicioPedida,

                    hora_fim:
                        horaFimPedida
                },

                horario,

                nomeServico,

                resultado.insertId

            );


            // RESERVA CRIADA

            res.status(201).json({

                mensagem:
                    "Pedido de reserva enviado com sucesso. Aguarda confirmação.",

                id_reserva:
                    resultado.insertId

            });

        }

        catch (erro) {

            return responderErroBaseDados(
                res,
                erro,
                "Erro ao criar a reserva:"
            );

        }

    }
);


// CONSULTAR UMA RESERVA PELO ID

app.get(
    "/api/reservas/:id",
    verificarToken,
    async function (req, res) {

        const idReserva =
            req.params.id;


        const sql = `
            SELECT
                r.id_reserva,
                r.nome_tutor,
                r.telefone,
                r.email,
                r.nome_animal,
                r.especie,
                r.concelho,
                r.morada_servico,
                r.codigo_postal,
                r.incluir_taxi,
                r.origem_taxi,
                r.destino_taxi,
                r.data_taxi,
                r.hora_taxi,
                r.observacoes,
                r.estado,
                r.criado_em,
                r.hora_inicio,
                r.hora_fim,
                s.nome AS servico,
                h.data

            FROM reservas AS r

            INNER JOIN servicos AS s
                ON r.id_servico = s.id_servico

            INNER JOIN horarios AS h
                ON r.id_horario = h.id_horario

            WHERE
                r.id_reserva = ?
        `;


        try {

            const [resultados] =
                await ligacao
                    .promise()
                    .execute(
                        sql,
                        [
                            idReserva
                        ]
                    );


            if (
                resultados.length === 0
            ) {

                return res.status(404).json({

                    mensagem:
                        "Reserva não encontrada."

                });

            }


            res.json(
                resultados[0]
            );

        }

        catch (erro) {

            return responderErroBaseDados(
                res,
                erro,
                "Erro ao consultar a reserva:"
            );

        }

    }
);


// ALTERAR UMA RESERVA

app.put(
    "/api/reservas/:id",
    verificarToken,
    async function (req, res) {

        const idReserva =
            Number(req.params.id);

        const dados =
            req.body;


        // VALIDAR O ESTADO

        const estadosPermitidos = [
            "pendente",
            "confirmada",
            "concluida"
        ];

        if (
            !estadosPermitidos.includes(
                dados.estado
            )
        ) {

            return res.status(400).json({

                mensagem:
                    "Estado da reserva inválido."

            });

        }


        try {


            // PROCURAR A RESERVA

            const [reservas] =
                await ligacao
                    .promise()
                    .execute(
                        `
                        SELECT
                            r.id_reserva,
                            r.hora_inicio,
                            r.hora_fim,
                            h.data

                        FROM reservas AS r

                        INNER JOIN horarios AS h
                            ON r.id_horario = h.id_horario

                        WHERE
                            r.id_reserva = ?
                        `,
                        [
                            idReserva
                        ]
                    );


            if (
                reservas.length === 0
            ) {

                return res.status(404).json({

                    mensagem:
                        "Reserva não encontrada."

                });

            }


            const reserva =
                reservas[0];


            // VERIFICAR SOBREPOSIÇÕES ANTES DE CONFIRMAR

            if (
                dados.estado ===
                "confirmada"
            ) {

                const [reservasSobrepostas] =
                    await ligacao
                        .promise()
                        .execute(
                            `
                            SELECT
                                r.id_reserva

                            FROM reservas AS r

                            INNER JOIN horarios AS h
                                ON r.id_horario = h.id_horario

                            WHERE
                                h.data = ?
                                AND r.estado = 'confirmada'
                                AND r.id_reserva <> ?
                                AND r.hora_inicio < ?
                                AND r.hora_fim > ?

                            LIMIT 1
                            `,
                            [
                                reserva.data,
                                idReserva,
                                reserva.hora_fim,
                                reserva.hora_inicio
                            ]
                        );


                if (
                    reservasSobrepostas.length > 0
                ) {

                    return res.status(409).json({

                        mensagem:
                            "Não é possível confirmar esta reserva porque já existe outra reserva confirmada nesse período."

                    });

                }

            }


            // ALTERAR A RESERVA

            const [resultado] =
                await ligacao
                    .promise()
                    .execute(
                        `
                        UPDATE reservas

                        SET
                            estado = ?,
                            observacoes = ?

                        WHERE
                            id_reserva = ?
                        `,
                        [
                            dados.estado,
                            dados.observacoes || null,
                            idReserva
                        ]
                    );


            if (
                resultado.affectedRows === 0
            ) {

                return res.status(404).json({

                    mensagem:
                        "Reserva não encontrada."

                });

            }


            res.json({

                mensagem:
                    "Reserva alterada com sucesso."

            });

        }

        catch (erro) {

            return responderErroBaseDados(
                res,
                erro,
                "Erro ao alterar a reserva:"
            );

        }

    }
);


// ELIMINAR UMA RESERVA

app.delete(
    "/api/reservas/:id",
    verificarToken,
    async function (req, res) {

        const idReserva =
            req.params.id;


        try {

            const [resultado] =
                await ligacao
                    .promise()
                    .execute(
                        `
                        DELETE FROM reservas
                        WHERE id_reserva = ?
                        `,
                        [
                            idReserva
                        ]
                    );


            if (
                resultado.affectedRows === 0
            ) {

                return res.status(404).json({

                    mensagem:
                        "Reserva não encontrada."

                });

            }


            res.json({

                mensagem:
                    "Reserva eliminada com sucesso."

            });

        }

        catch (erro) {

            return responderErroBaseDados(
                res,
                erro,
                "Erro ao eliminar a reserva:"
            );

        }

    }
);


// INICIAR SESSÃO DO ADMINISTRADOR

app.post(
    "/api/login",
    async function (req, res) {

        const dados =
            req.body;


        if (
            !dados.utilizador ||
            !dados.password
        ) {

            return res.status(400).json({

                mensagem:
                    "Preenche o utilizador e a palavra-passe."

            });

        }


        try {

            const [resultados] =
                await ligacao
                    .promise()
                    .execute(
                        `
                        SELECT
                            id_admin,
                            utilizador,
                            password_hash

                        FROM administradores

                        WHERE
                            utilizador = ?
                        `,
                        [
                            dados.utilizador
                        ]
                    );


            if (
                resultados.length === 0
            ) {

                return res.status(401).json({

                    mensagem:
                        "Utilizador ou palavra-passe incorretos."

                });

            }


            const administrador =
                resultados[0];


            const passwordCorreta =
                await bcrypt.compare(
                    dados.password,
                    administrador.password_hash
                );


            if (!passwordCorreta) {

                return res.status(401).json({

                    mensagem:
                        "Utilizador ou palavra-passe incorretos."

                });

            }


            const token =
                jwt.sign(
                    {
                        id_admin:
                            administrador.id_admin,

                        utilizador:
                            administrador.utilizador
                    },
                    chaveToken,
                    {
                        expiresIn:
                            "2h"
                    }
                );


            res.json({

                mensagem:
                    "Sessão iniciada com sucesso.",

                token:
                    token

            });

        }

        catch (erro) {

            return responderErroBaseDados(
                res,
                erro,
                "Erro ao iniciar sessão:"
            );

        }

    }
);


// CRIAR UM HORÁRIO

app.post(
    "/api/horarios",
    verificarToken,
    async function (req, res) {

        const {
            data,
            hora_inicio,
            hora_fim
        } = req.body;


        if (
            !data ||
            !hora_inicio ||
            !hora_fim
        ) {

            return res.status(400).json({

                mensagem:
                    "Preenche todos os dados do horário."

            });

        }


        if (
            hora_fim <=
            hora_inicio
        ) {

            return res.status(400).json({

                mensagem:
                    "A hora de fim tem de ser posterior à hora de início."

            });

        }


        try {

            const [resultado] =
                await ligacao
                    .promise()
                    .execute(
                        `
                        INSERT INTO horarios
                        (
                            data,
                            hora_inicio,
                            hora_fim,
                            estado
                        )

                        VALUES
                        (
                            ?, ?, ?, 'disponivel'
                        )
                        `,
                        [
                            data,
                            hora_inicio,
                            hora_fim
                        ]
                    );


            res.status(201).json({

                mensagem:
                    "Horário criado com sucesso.",

                id_horario:
                    resultado.insertId

            });

        }

        catch (erro) {

            if (
                erro.code ===
                "ER_DUP_ENTRY"
            ) {

                return res.status(409).json({

                    mensagem:
                        "Este horário já existe."

                });

            }


            return responderErroBaseDados(
                res,
                erro,
                "Erro ao criar o horário:"
            );

        }

    }
);


// ALTERAR UM HORÁRIO

app.put(
    "/api/horarios/:id",
    verificarToken,
    async function (req, res) {

        const idHorario =
            Number(req.params.id);

        const dados =
            req.body;


        // VALIDAR O ID

        if (
            !Number.isInteger(idHorario) ||
            idHorario <= 0
        ) {

            return res.status(400).json({

                mensagem:
                    "Horário inválido."

            });

        }


        // VERIFICAR SE ESTAMOS A EDITAR DATA OU HORAS

        const editarDataOuHoras =
            dados.data !== undefined ||
            dados.hora_inicio !== undefined ||
            dados.hora_fim !== undefined;


        // EDITAR DATA E HORAS

        if (editarDataOuHoras) {


            // VALIDAR OS CAMPOS

            if (
                !dados.data ||
                !dados.hora_inicio ||
                !dados.hora_fim
            ) {

                return res.status(400).json({

                    mensagem:
                        "Preenche a data, a hora de início e a hora de fim."

                });

            }


            // VALIDAR AS HORAS

            if (
                dados.hora_fim <=
                dados.hora_inicio
            ) {

                return res.status(400).json({

                    mensagem:
                        "A hora de fim tem de ser posterior à hora de início."

                });

            }


            try {


                // PROCURAR O HORÁRIO

                const [horarios] =
                    await ligacao
                        .promise()
                        .execute(
                            `
                            SELECT
                                id_horario,
                                estado

                            FROM horarios

                            WHERE
                                id_horario = ?
                            `,
                            [
                                idHorario
                            ]
                        );


                // HORÁRIO NÃO ENCONTRADO

                if (
                    horarios.length === 0
                ) {

                    return res.status(404).json({

                        mensagem:
                            "Horário não encontrado."

                    });

                }


                // PROCURAR RESERVAS ASSOCIADAS

                const [reservas] =
                    await ligacao
                        .promise()
                        .execute(
                            `
                            SELECT
                                id_reserva

                            FROM reservas

                            WHERE
                                id_horario = ?

                            LIMIT 1
                            `,
                            [
                                idHorario
                            ]
                        );


                // NÃO ALTERAR UM HORÁRIO QUE JÁ TEM RESERVAS

                if (
                    reservas.length > 0
                ) {

                    return res.status(409).json({

                        mensagem:
                            "Não é possível alterar a data ou as horas deste horário porque já existem reservas associadas."

                    });

                }


                // MANTER O ESTADO ATUAL

                const estadoAtual =
                    horarios[0].estado;


                // ATUALIZAR O HORÁRIO

                const [resultado] =
                    await ligacao
                        .promise()
                        .execute(
                            `
                            UPDATE horarios

                            SET
                                data = ?,
                                hora_inicio = ?,
                                hora_fim = ?,
                                estado = ?

                            WHERE
                                id_horario = ?
                            `,
                            [
                                dados.data,
                                dados.hora_inicio,
                                dados.hora_fim,
                                estadoAtual,
                                idHorario
                            ]
                        );


                if (
                    resultado.affectedRows === 0
                ) {

                    return res.status(404).json({

                        mensagem:
                            "Horário não encontrado."

                    });

                }


                res.status(200).json({

                    mensagem:
                        "Horário alterado com sucesso."

                });

            }


            catch (erro) {


                // HORÁRIO REPETIDO

                if (
                    erro.code ===
                    "ER_DUP_ENTRY"
                ) {

                    return res.status(409).json({

                        mensagem:
                            "Já existe um horário com estes dados."

                    });

                }


                return responderErroBaseDados(
                    res,
                    erro,
                    "Erro ao alterar o horário:"
                );

            }


            return;

        }


        // ALTERAR APENAS O ESTADO

        const estado =
            dados.estado;


        // VALIDAR O ESTADO

        if (
            estado !== "disponivel" &&
            estado !== "bloqueado"
        ) {

            return res.status(400).json({

                mensagem:
                    "Estado do horário inválido."

            });

        }


        try {


            // ALTERAR O ESTADO

            const [resultado] =
                await ligacao
                    .promise()
                    .execute(
                        `
                        UPDATE horarios

                        SET
                            estado = ?

                        WHERE
                            id_horario = ?
                        `,
                        [
                            estado,
                            idHorario
                        ]
                    );


            if (
                resultado.affectedRows === 0
            ) {

                return res.status(404).json({

                    mensagem:
                        "Horário não encontrado."

                });

            }


            res.status(200).json({

                mensagem:
                    "Estado do horário alterado com sucesso."

            });

        }


        catch (erro) {

            return responderErroBaseDados(
                res,
                erro,
                "Erro ao alterar o estado do horário:"
            );

        }

    }
);


// ELIMINAR UM HORÁRIO

app.delete(
    "/api/horarios/:id",
    verificarToken,
    async function (req, res) {

        const idHorario =
            Number(req.params.id);


        // VALIDAR O ID

        if (
            !Number.isInteger(idHorario) ||
            idHorario <= 0
        ) {

            return res.status(400).json({

                mensagem:
                    "Horário inválido."

            });

        }


        try {


            // PROCURAR O HORÁRIO

            const [horarios] =
                await ligacao
                    .promise()
                    .execute(
                        `
                        SELECT
                            id_horario

                        FROM horarios

                        WHERE
                            id_horario = ?
                        `,
                        [
                            idHorario
                        ]
                    );


            // HORÁRIO NÃO ENCONTRADO

            if (
                horarios.length === 0
            ) {

                return res.status(404).json({

                    mensagem:
                        "Horário não encontrado."

                });

            }


            // PROCURAR RESERVAS ASSOCIADAS

            const [reservas] =
                await ligacao
                    .promise()
                    .execute(
                        `
                        SELECT
                            id_reserva

                        FROM reservas

                        WHERE
                            id_horario = ?

                        LIMIT 1
                        `,
                        [
                            idHorario
                        ]
                    );


            // NÃO ELIMINAR HORÁRIOS COM RESERVAS

            if (
                reservas.length > 0
            ) {

                return res.status(409).json({

                    mensagem:
                        "Não é possível eliminar este horário porque existem reservas associadas."

                });

            }


            // ELIMINAR O HORÁRIO

            const [resultado] =
                await ligacao
                    .promise()
                    .execute(
                        `
                        DELETE FROM horarios

                        WHERE
                            id_horario = ?
                        `,
                        [
                            idHorario
                        ]
                    );


            if (
                resultado.affectedRows === 0
            ) {

                return res.status(404).json({

                    mensagem:
                        "Horário não encontrado."

                });

            }


            res.status(200).json({

                mensagem:
                    "Horário eliminado com sucesso."

            });

        }


        catch (erro) {

            return responderErroBaseDados(
                res,
                erro,
                "Erro ao eliminar o horário:"
            );

        }

    }
);


// INICIAR O SERVIDOR

app.listen(
    PORT,
    function () {

        console.log(
            "Servidor a funcionar na porta " +
            PORT
        );

    }
);