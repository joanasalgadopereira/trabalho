/* =========================================================
   ENTRE PATAS
   Base de Dados - testes.sql
   ========================================================= */


/* =========================================================
   1. SELECIONAR A BASE DE DADOS
   ========================================================= */

USE entre_patas;



/* =========================================================
   2. LIMPAR RESERVAS DE TESTES ANTERIORES
   ========================================================= */

/*
   Apaga todas as reservas de teste
   e reinicia o AUTO_INCREMENT.
*/

TRUNCATE TABLE reservas;



/* =========================================================
   3. VERIFICAR OS SERVICOS
   ========================================================= */

SELECT * FROM servicos;



/* =========================================================
   4. VERIFICAR OS HORARIOS
   ========================================================= */

SELECT * FROM horarios;



/* =========================================================
   5. TESTE INSERT
   CRIAR RESERVAS VALIDAS
   ========================================================= */


/* ---------- RESERVA 1 ---------- */

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
    destino_taxi,
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
    NULL,
    'Animal sociável e habituado a visitas.',
    'pendente'
);



/* ---------- RESERVA 2 ---------- */

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
    destino_taxi,
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
    NULL,
    'Passeio adaptado a um cão jovem e energético.',
    'confirmada'
);



/* ---------- RESERVA 3 ---------- */

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
    destino_taxi,
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
    NULL,
    'Gata tranquila. Manter a rotina habitual de alimentação.',
    'pendente'
);



/* ---------- RESERVA 4 ---------- */

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
    destino_taxi,
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
    NULL,
    'Banho incluído no Pack Entre Patas Conforto.',
    'confirmada'
);



/* ---------- RESERVA 5 - ENTRE PATAS TAXI ---------- */

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
    destino_taxi,
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
    'Clínica Veterinária',
    'Transporte para consulta veterinária.',
    'pendente'
);



/* =========================================================
   6. TESTE SELECT
   CONSULTAR TODAS AS RESERVAS
   ========================================================= */

SELECT * FROM reservas;



/* =========================================================
   7. TESTE JOIN
   RESERVAS + SERVICOS + HORARIOS
   ========================================================= */

SELECT

    r.id_reserva,

    r.nome_tutor,

    r.nome_animal,

    r.especie,

    s.nome AS servico,

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



/* =========================================================
   8. CONSULTAR UMA RESERVA ESPECIFICA
   ========================================================= */

SELECT *
FROM reservas
WHERE id_reserva = 1;



/* =========================================================
   9. FILTRAR RESERVAS POR ESTADO
   ========================================================= */

SELECT *
FROM reservas
WHERE estado = 'pendente';



/* =========================================================
   10. FILTRAR RESERVAS POR DISTRITO
   ========================================================= */

SELECT *
FROM reservas
WHERE distrito = 'Braga';



/* =========================================================
   11. TESTE UPDATE
   ALTERAR ESTADO DE UMA RESERVA
   ========================================================= */

UPDATE reservas

SET
    estado = 'confirmada',

    observacoes =
    'Animal sociável. Reserva confirmada com o tutor.'

WHERE id_reserva = 1;



/* Confirmar alteração */

SELECT *
FROM reservas
WHERE id_reserva = 1;



/* =========================================================
   12. TESTE UPDATE
   ALTERAR TELEFONE DO TUTOR
   ========================================================= */

UPDATE reservas

SET
    telefone = '911111111'

WHERE id_reserva = 2;



/* Confirmar alteração */

SELECT *
FROM reservas
WHERE id_reserva = 2;



/* =========================================================
   13. TESTE DELETE
   CANCELAR / ELIMINAR UMA RESERVA
   ========================================================= */

/*
   Neste modelo inicial, cancelar uma reserva
   significa eliminar o registo.
*/

DELETE FROM reservas
WHERE id_reserva = 5;



/* Confirmar eliminação */

SELECT * FROM reservas;



/* =========================================================
   14. VERIFICAR HORARIOS LIVRES
   ========================================================= */

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



/* =========================================================
   15. MOSTRAR TODOS OS HORARIOS
   COM ESTADO DE OCUPACAO
   ========================================================= */

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



/* =========================================================
   TESTES DE ERRO
   ========================================================= */

/*
   ATENÇÃO:

   Os testes seguintes estão comentados porque
   DEVEM dar erro.

   Testa-os individualmente.

   Não os executes todos juntamente com o resto
   do ficheiro.
*/



/* =========================================================
   16. TESTE DE ERRO
   DUPLA RESERVA DO MESMO HORARIO
   ========================================================= */

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
    destino_taxi,
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
    NULL,
    NULL,
    'pendente'
);

*/

/*
   RESULTADO ESPERADO:

   O MySQL deve recusar a operação.

   O horário 1 já está associado
   à reserva 1.

   Isto testa a restrição:

   UNIQUE (id_horario)
*/



/* =========================================================
   17. TESTE DE ERRO
   SERVICO INEXISTENTE
   ========================================================= */

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
    destino_taxi,
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
    NULL,
    NULL,
    'pendente'
);

*/

/*
   RESULTADO ESPERADO:

   Deve dar erro porque não existe
   nenhum serviço com id_servico = 999.

   Isto testa a FOREIGN KEY.
*/



/* =========================================================
   18. TESTE DE ERRO
   HORARIO INEXISTENTE
   ========================================================= */

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
    destino_taxi,
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
    NULL,
    NULL,
    'pendente'
);

*/

/*
   RESULTADO ESPERADO:

   Deve dar erro porque não existe
   nenhum horário com id_horario = 999.

   Isto testa a FOREIGN KEY.
*/



/* =========================================================
   19. TESTE DE ERRO
   HORARIO INVALIDO
   ========================================================= */

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

/*
   RESULTADO ESPERADO:

   Deve dar erro porque a hora de fim
   é anterior à hora de início.

   Isto testa a restrição:

   CHECK (hora_fim > hora_inicio)
*/



/* =========================================================
   20. ESTADO FINAL DOS DADOS
   ========================================================= */

SELECT * FROM servicos;

SELECT * FROM horarios;

SELECT * FROM reservas;