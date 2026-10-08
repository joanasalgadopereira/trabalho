
/* ENTRE PATAS - TESTES DA BASE DE DADOS */


/* SELECIONAR A BASE DE DADOS */

USE entre_patas;


/* LIMPAR RESERVAS DE TESTES ANTERIORES */

TRUNCATE TABLE reservas;


/* VERIFICAR OS SERVIÇOS */

SELECT * FROM servicos;


/* VERIFICAR OS HORÁRIOS */

SELECT * FROM horarios;


/* CRIAR RESERVA 1 */

INSERT INTO reservas
(
    id_servico,
    id_horario,
    nome_tutor,
    telefone,
    email,
    nome_animal,
    especie,
    distrito,
    morada_servico,
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
    1,
    1,
    'Ana Martins',
    '912345678',
    'ana.martins@email.pt',
    'Luna',
    'Cão',
    'Braga',
    'Vila Nova de Famalicão',
    FALSE,
    NULL,
    NULL,
    NULL,
    NULL,
    'Animal sociável e habituado a visitas.',
    'pendente'
);


/* CRIAR RESERVA 2 */

INSERT INTO reservas
(
    id_servico,
    id_horario,
    nome_tutor,
    telefone,
    email,
    nome_animal,
    especie,
    distrito,
    morada_servico,
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
    2,
    2,
    'Miguel Silva',
    '913456789',
    'miguel.silva@email.pt',
    'Max',
    'Cão',
    'Porto',
    'Maia',
    FALSE,
    NULL,
    NULL,
    NULL,
    NULL,
    'Passeio adaptado a um cão jovem e energético.',
    'confirmada'
);


/* CRIAR RESERVA 3 */

INSERT INTO reservas
(
    id_servico,
    id_horario,
    nome_tutor,
    telefone,
    email,
    nome_animal,
    especie,
    distrito,
    morada_servico,
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
    3,
    3,
    'Sofia Costa',
    '914567890',
    'sofia.costa@email.pt',
    'Mimi',
    'Gato',
    'Braga',
    'Guimarães',
    FALSE,
    NULL,
    NULL,
    NULL,
    NULL,
    'Gata tranquila. Manter a rotina habitual de alimentação.',
    'pendente'
);


/* CRIAR RESERVA 4 COM TAXI COMO EXTRA */

INSERT INTO reservas
(
    id_servico,
    id_horario,
    nome_tutor,
    telefone,
    email,
    nome_animal,
    especie,
    distrito,
    morada_servico,
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
    4,
    4,
    'Rita Ferreira',
    '915678901',
    'rita.ferreira@email.pt',
    'Nala',
    'Cão',
    'Porto',
    'Vila Nova de Gaia',
    TRUE,
    'Vila Nova de Gaia',
    'Clínica Veterinária de Gaia',
    '2026-09-15',
    '19:00:00',
    'Pack Entre Patas Conforto com Entre Patas Taxi como extra.',
    'confirmada'
);


/* CRIAR RESERVA 5 COM TAXI COMO SERVIÇO PRINCIPAL */

INSERT INTO reservas
(
    id_servico,
    id_horario,
    nome_tutor,
    telefone,
    email,
    nome_animal,
    especie,
    distrito,
    morada_servico,
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
    6,
    5,
    'Carlos Oliveira',
    '916789012',
    'carlos.oliveira@email.pt',
    'Kiko',
    'Gato',
    'Braga',
    'Braga',
    FALSE,
    'Braga',
    'Clínica Veterinária',
    '2026-09-15',
    '18:30:00',
    'Transporte para consulta veterinária.',
    'pendente'
);


/* CONSULTAR TODAS AS RESERVAS */

SELECT * FROM reservas;


/* CONSULTAR RESERVAS COM SERVIÇO E HORÁRIO */

SELECT
    r.id_reserva,
    r.nome_tutor,
    r.nome_animal,
    r.especie,
    s.nome AS servico,
    r.incluir_taxi,
    r.origem_taxi,
    r.destino_taxi,
    r.data_taxi,
    r.hora_taxi,
    h.data,
    h.hora_inicio,
    h.hora_fim,
    r.distrito,
    r.estado

FROM reservas AS r

INNER JOIN servicos AS s
    ON r.id_servico = s.id_servico

INNER JOIN horarios AS h
    ON r.id_horario = h.id_horario

ORDER BY
    h.data,
    h.hora_inicio;


/* CONSULTAR UMA RESERVA ESPECÍFICA */

SELECT *
FROM reservas
WHERE id_reserva = 1;


/* FILTRAR RESERVAS PENDENTES */

SELECT *
FROM reservas
WHERE estado = 'pendente';


/* FILTRAR RESERVAS DO DISTRITO DE BRAGA */

SELECT *
FROM reservas
WHERE distrito = 'Braga';


/* CONSULTAR RESERVAS COM TAXI COMO EXTRA */

SELECT
    id_reserva,
    nome_tutor,
    nome_animal,
    id_servico,
    incluir_taxi,
    origem_taxi,
    destino_taxi,
    data_taxi,
    hora_taxi

FROM reservas

WHERE incluir_taxi = TRUE;


/* CONSULTAR TAXI COMO SERVIÇO PRINCIPAL */

SELECT
    id_reserva,
    nome_tutor,
    nome_animal,
    id_servico,
    incluir_taxi,
    origem_taxi,
    destino_taxi,
    data_taxi,
    hora_taxi

FROM reservas

WHERE id_servico = 6;


/* ALTERAR O ESTADO DE UMA RESERVA */

UPDATE reservas

SET
    estado = 'confirmada',
    observacoes = 'Animal sociável. Reserva confirmada com o tutor.'

WHERE id_reserva = 1;


/* CONFIRMAR A ALTERAÇÃO */

SELECT *
FROM reservas
WHERE id_reserva = 1;


/* ALTERAR O TELEFONE DO TUTOR */

UPDATE reservas

SET
    telefone = '911111111'

WHERE id_reserva = 2;


/* CONFIRMAR A ALTERAÇÃO */

SELECT *
FROM reservas
WHERE id_reserva = 2;


/* ADICIONAR TAXI A UMA RESERVA */

UPDATE reservas

SET
    incluir_taxi = TRUE,
    origem_taxi = 'Guimarães',
    destino_taxi = 'Hospital Veterinário',
    data_taxi = '2026-09-16',
    hora_taxi = '15:30:00'

WHERE id_reserva = 3;


/* CONFIRMAR A ADIÇÃO DO TAXI */

SELECT
    id_reserva,
    nome_tutor,
    nome_animal,
    incluir_taxi,
    origem_taxi,
    destino_taxi,
    data_taxi,
    hora_taxi

FROM reservas

WHERE id_reserva = 3;


/* RETIRAR O TAXI DA RESERVA */

UPDATE reservas

SET
    incluir_taxi = FALSE,
    origem_taxi = NULL,
    destino_taxi = NULL,
    data_taxi = NULL,
    hora_taxi = NULL

WHERE id_reserva = 3;


/* CONFIRMAR A REMOÇÃO DO TAXI */

SELECT
    id_reserva,
    nome_tutor,
    nome_animal,
    incluir_taxi,
    origem_taxi,
    destino_taxi,
    data_taxi,
    hora_taxi

FROM reservas

WHERE id_reserva = 3;


/* ELIMINAR UMA RESERVA */

DELETE FROM reservas
WHERE id_reserva = 5;


/* CONFIRMAR A ELIMINAÇÃO */

SELECT * FROM reservas;


/* VERIFICAR HORÁRIOS LIVRES */

SELECT
    h.id_horario,
    h.data,
    h.hora_inicio,
    h.hora_fim

FROM horarios AS h

LEFT JOIN reservas AS r
    ON h.id_horario = r.id_horario

WHERE r.id_reserva IS NULL

ORDER BY
    h.data,
    h.hora_inicio;


/* MOSTRAR A DISPONIBILIDADE DOS HORÁRIOS */

SELECT
    h.id_horario,
    h.data,
    h.hora_inicio,
    h.hora_fim,

    CASE

        WHEN r.id_reserva IS NULL
            THEN 'Livre'

        ELSE 'Reservado'

    END AS disponibilidade

FROM horarios AS h

LEFT JOIN reservas AS r
    ON h.id_horario = r.id_horario

ORDER BY
    h.data,
    h.hora_inicio;


/* TESTES DE ERRO */

/*
OS TESTES SEGUINTES DEVEM DAR ERRO.

DEVEM SER EXECUTADOS INDIVIDUALMENTE.
*/


/* TESTAR DUPLA RESERVA DO MESMO HORÁRIO */

/*

INSERT INTO reservas
(
    id_servico,
    id_horario,
    nome_tutor,
    telefone,
    email,
    nome_animal,
    especie,
    distrito,
    morada_servico,
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
    2,
    1,
    'Pedro Sousa',
    '917890123',
    'pedro.sousa@email.pt',
    'Thor',
    'Cão',
    'Porto',
    'Porto',
    FALSE,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'pendente'
);

*/


/* TESTAR SERVIÇO INEXISTENTE */

/*

INSERT INTO reservas
(
    id_servico,
    id_horario,
    nome_tutor,
    telefone,
    email,
    nome_animal,
    especie,
    distrito,
    morada_servico,
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
    999,
    5,
    'Teste Serviço',
    '910000000',
    'teste.servico@email.pt',
    'Animal Teste',
    'Cão',
    'Braga',
    'Braga',
    FALSE,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'pendente'
);

*/


/* TESTAR HORÁRIO INEXISTENTE */

/*

INSERT INTO reservas
(
    id_servico,
    id_horario,
    nome_tutor,
    telefone,
    email,
    nome_animal,
    especie,
    distrito,
    morada_servico,
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
    1,
    999,
    'Teste Horário',
    '910000001',
    'teste.horario@email.pt',
    'Animal Teste',
    'Gato',
    'Porto',
    'Porto',
    FALSE,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'pendente'
);

*/


/* TESTAR HORÁRIO INVÁLIDO */

/*

INSERT INTO horarios
(
    data,
    hora_inicio,
    hora_fim,
    estado
)
VALUES
(
    '2026-09-16',
    '18:00:00',
    '15:00:00',
    'disponivel'
);

*/


/* VERIFICAR O ESTADO FINAL DOS DADOS */

SELECT * FROM servicos;

SELECT * FROM horarios;

SELECT * FROM reservas;