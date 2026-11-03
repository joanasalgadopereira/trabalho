
/* ENTRE PATAS - TESTES DA BASE DE DADOS */


/* SELECIONAR A BASE DE DADOS */

USE entre_patas;


/* LIMPAR DADOS DE TESTES ANTERIORES */

TRUNCATE TABLE reservas;

TRUNCATE TABLE horarios;


/* VERIFICAR OS SERVIÇOS */

SELECT * FROM servicos;


/* VERIFICAR OS ADMINISTRADORES SEM MOSTRAR A PASSWORD */

SELECT
    id_admin,
    utilizador,
    criado_em
FROM administradores;


/* CRIAR HORÁRIOS DE TESTE */

INSERT INTO horarios
(
    data,
    hora_inicio,
    hora_fim,
    estado
)

VALUES

(
    '2026-11-10',
    '08:00:00',
    '18:00:00',
    'disponivel'
),

(
    '2026-11-11',
    '09:00:00',
    '18:00:00',
    'disponivel'
),

(
    '2026-11-12',
    '08:00:00',
    '18:00:00',
    'disponivel'
),

(
    '2026-11-13',
    '08:00:00',
    '18:00:00',
    'disponivel'
),

(
    '2026-11-14',
    '08:00:00',
    '20:00:00',
    'disponivel'
),

(
    '2026-11-15',
    '10:00:00',
    '16:00:00',
    'disponivel'
);


/* VERIFICAR OS HORÁRIOS */

SELECT * FROM horarios;


/* CRIAR RESERVA 1 - PET SITTING */

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
    1,
    1,
    '10:00:00',
    '12:00:00',
    'Ana Martins',
    '912345678',
    'ana.martins@email.pt',
    'Luna',
    'Cão',
    'Vila Nova de Famalicão',
    'Rua das Flores, 10',
    '4760-000',
    FALSE,
    NULL,
    NULL,
    NULL,
    NULL,
    'Animal sociável e habituado a visitas.',
    'pendente'
);


/* CRIAR RESERVA 2 - PASSEIO SOBREPOSTO E AINDA PENDENTE */

/*
ESTA RESERVA USA O MESMO HORÁRIO DE DISPONIBILIDADE
DA RESERVA 1 E SOBREPÕE-SE ENTRE AS 11:00 E AS 12:00.

ISTO É PERMITIDO ENQUANTO AS RESERVAS ESTIVEREM PENDENTES.
A PROTEÇÃO CONTRA DUAS CONFIRMAÇÕES SOBREPOSTAS É FEITA
PELO BACKEND.
*/

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
    2,
    1,
    '11:00:00',
    '12:00:00',
    'Miguel Silva',
    '913456789',
    'miguel.silva@email.pt',
    'Max',
    'Cão',
    'Santo Tirso',
    'Avenida Central, 25',
    '4780-000',
    FALSE,
    NULL,
    NULL,
    NULL,
    NULL,
    'Passeio de 60 minutos.',
    'pendente'
);


/* CRIAR RESERVA 3 - PACK ESSENCIAL */

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
    3,
    2,
    '09:00:00',
    '15:00:00',
    'Sofia Costa',
    '914567890',
    'sofia.costa@email.pt',
    'Mimi',
    'Gato',
    'Guimarães',
    'Rua do Parque, 8',
    '4800-000',
    FALSE,
    NULL,
    NULL,
    NULL,
    NULL,
    'Gata tranquila. Manter a rotina habitual de alimentação.',
    'confirmada'
);


/* CRIAR RESERVA 4 - PACK CONFORTO COM TAXI COMO EXTRA */

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
    4,
    3,
    '10:00:00',
    '18:00:00',
    'Rita Ferreira',
    '915678901',
    'rita.ferreira@email.pt',
    'Nala',
    'Cão',
    'Trofa',
    'Rua da Estação, 14',
    '4785-000',
    TRUE,
    'Rua da Estação, 14, Trofa',
    'Clínica Veterinária',
    '2026-11-12',
    '09:30:00',
    'Pack Conforto com Entre Patas Taxi como extra.',
    'confirmada'
);


/* CRIAR RESERVA 5 - PACK COMPLETO */

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
    5,
    4,
    '08:00:00',
    '18:00:00',
    'João Pereira',
    '916789010',
    'joao.pereira@email.pt',
    'Simba',
    'Gato',
    'Vila Nova de Famalicão',
    'Rua Nova, 32',
    '4760-100',
    FALSE,
    NULL,
    NULL,
    NULL,
    NULL,
    'Acompanhamento durante todo o período do pack.',
    'pendente'
);


/* CRIAR RESERVA 6 - TAXI COMO SERVIÇO PRINCIPAL E ESPÉCIE OUTRA */

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
    6,
    5,
    '17:00:00',
    '18:00:00',
    'Carlos Oliveira',
    '916789012',
    'carlos.oliveira@email.pt',
    'Pipoca',
    'Coelho',
    'Guimarães',
    'Rua do Castelo, 5',
    '4800-200',
    FALSE,
    'Rua do Castelo, 5, Guimarães',
    'Clínica Veterinária',
    '2026-11-14',
    '17:00:00',
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
    r.hora_inicio,
    r.hora_fim,
    r.concelho,
    r.codigo_postal,
    r.incluir_taxi,
    r.origem_taxi,
    r.destino_taxi,
    r.data_taxi,
    r.hora_taxi,
    h.data,
    r.estado

FROM reservas AS r

INNER JOIN servicos AS s
    ON r.id_servico = s.id_servico

INNER JOIN horarios AS h
    ON r.id_horario = h.id_horario

ORDER BY
    h.data,
    r.hora_inicio;


/* CONSULTAR UMA RESERVA ESPECÍFICA */

SELECT *
FROM reservas
WHERE id_reserva = 1;


/* FILTRAR RESERVAS PENDENTES */

SELECT *
FROM reservas
WHERE estado = 'pendente';


/* FILTRAR RESERVAS POR CONCELHO */

SELECT *
FROM reservas
WHERE concelho = 'Guimarães';


/* PESQUISAR RESERVAS POR ANIMAL OU TUTOR */

SELECT *
FROM reservas

WHERE
    nome_animal LIKE '%Luna%'
    OR nome_tutor LIKE '%Luna%';


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
    especie,
    id_servico,
    incluir_taxi,
    origem_taxi,
    destino_taxi,
    data_taxi,
    hora_taxi

FROM reservas

WHERE id_servico = 6;


/* CONFIRMAR A RESERVA 1 */

UPDATE reservas

SET
    estado = 'confirmada',
    observacoes =
        'Animal sociável. Reserva confirmada com o tutor.'

WHERE id_reserva = 1;


/* CONFIRMAR A ALTERAÇÃO */

SELECT *
FROM reservas
WHERE id_reserva = 1;


/* PROCURAR CONFLITO ANTES DE CONFIRMAR A RESERVA 2 */

/*
A RESERVA 2 SOBREPÕE-SE À RESERVA 1.

ESTA CONSULTA REPRESENTA A VERIFICAÇÃO QUE O BACKEND FAZ
ANTES DE ALTERAR UMA RESERVA PARA O ESTADO CONFIRMADA.

DEVE DEVOLVER A RESERVA 1.
*/

SELECT
    r.id_reserva,
    r.hora_inicio,
    r.hora_fim,
    r.estado

FROM reservas AS r

INNER JOIN horarios AS h
    ON r.id_horario = h.id_horario

WHERE
    h.data = (
        SELECT h2.data

        FROM reservas AS r2

        INNER JOIN horarios AS h2
            ON r2.id_horario = h2.id_horario

        WHERE r2.id_reserva = 2
    )

    AND r.estado = 'confirmada'
    AND r.id_reserva <> 2

    AND r.hora_inicio < (
        SELECT hora_fim
        FROM reservas
        WHERE id_reserva = 2
    )

    AND r.hora_fim > (
        SELECT hora_inicio
        FROM reservas
        WHERE id_reserva = 2
    );


/* ALTERAR O TELEFONE DO TUTOR */

UPDATE reservas

SET
    telefone = '911111111'

WHERE id_reserva = 2;


/* CONFIRMAR A ALTERAÇÃO */

SELECT
    id_reserva,
    nome_tutor,
    telefone
FROM reservas
WHERE id_reserva = 2;


/* ADICIONAR TAXI A UMA RESERVA */

UPDATE reservas

SET
    incluir_taxi = TRUE,
    origem_taxi = 'Guimarães',
    destino_taxi = 'Hospital Veterinário',
    data_taxi = '2026-11-11',
    hora_taxi = '16:00:00'

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


/* BLOQUEAR UM HORÁRIO SEM ALTERAR AS RESERVAS */

UPDATE horarios

SET
    estado = 'bloqueado'

WHERE id_horario = 6;


/* CONFIRMAR O BLOQUEIO */

SELECT *
FROM horarios
WHERE id_horario = 6;


/* VOLTAR A DISPONIBILIZAR O HORÁRIO */

UPDATE horarios

SET
    estado = 'disponivel'

WHERE id_horario = 6;


/* EDITAR UM HORÁRIO SEM RESERVAS ASSOCIADAS */

UPDATE horarios

SET
    data = '2026-11-16',
    hora_inicio = '11:00:00',
    hora_fim = '17:00:00'

WHERE id_horario = 6;


/* CONFIRMAR A ALTERAÇÃO DO HORÁRIO */

SELECT *
FROM horarios
WHERE id_horario = 6;


/* LISTAR HORÁRIOS DISPONÍVEIS */

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
    hora_inicio;


/* CONTAR RESERVAS POR ESTADO */

SELECT
    estado,
    COUNT(*) AS total

FROM reservas

GROUP BY estado

ORDER BY estado;


/* CONTAR RESERVAS POR SERVIÇO */

SELECT
    s.nome AS servico,
    COUNT(r.id_reserva) AS total_reservas

FROM servicos AS s

LEFT JOIN reservas AS r
    ON s.id_servico = r.id_servico

GROUP BY
    s.id_servico,
    s.nome

ORDER BY s.id_servico;


/* ELIMINAR UMA RESERVA */

DELETE FROM reservas
WHERE id_reserva = 6;


/* CONFIRMAR A ELIMINAÇÃO */

SELECT * FROM reservas;


/* ELIMINAR UM HORÁRIO SEM RESERVAS */

DELETE FROM horarios
WHERE id_horario = 6;


/* CONFIRMAR A ELIMINAÇÃO */

SELECT * FROM horarios;


/* TESTES DE ERRO */

/*
OS TESTES SEGUINTES DEVEM SER EXECUTADOS INDIVIDUALMENTE.

ESTÃO COMENTADOS PARA NÃO INTERROMPER A EXECUÇÃO NORMAL
DO FICHEIRO.
*/


/* TESTAR HORÁRIO DUPLICADO */

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
    '2026-11-10',
    '08:00:00',
    '18:00:00',
    'disponivel'
);

*/


/* TESTAR SERVIÇO INEXISTENTE */

/*

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
    999,
    1,
    '13:00:00',
    '14:00:00',
    'Teste Serviço',
    '910000000',
    'teste.servico@email.pt',
    'Animal Teste',
    'Cão',
    'Guimarães',
    'Rua Teste, 1',
    '4800-000',
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
    1,
    999,
    '13:00:00',
    '14:00:00',
    'Teste Horário',
    '910000001',
    'teste.horario@email.pt',
    'Animal Teste',
    'Gato',
    'Santo Tirso',
    'Rua Teste, 2',
    '4780-000',
    FALSE,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'pendente'
);

*/


/* TESTAR HORÁRIO COM HORA DE FIM INVÁLIDA */

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
    '2026-11-20',
    '18:00:00',
    '15:00:00',
    'disponivel'
);

*/


/* TESTAR RESERVA COM HORA DE FIM INVÁLIDA */

/*

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
    1,
    1,
    '15:00:00',
    '12:00:00',
    'Teste Horas',
    '910000002',
    'teste.horas@email.pt',
    'Animal Teste',
    'Cão',
    'Vila Nova de Famalicão',
    'Rua Teste, 3',
    '4760-000',
    FALSE,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'pendente'
);

*/


/* TESTAR ELIMINAÇÃO DE HORÁRIO COM RESERVAS ASSOCIADAS */

/*

DELETE FROM horarios
WHERE id_horario = 1;

*/


/* VERIFICAR O ESTADO FINAL DOS DADOS */

SELECT * FROM servicos;

SELECT * FROM horarios;

SELECT * FROM reservas;
