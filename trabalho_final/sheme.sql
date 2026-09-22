/* =========================================================
   ENTRE PATAS
   Base de Dados - schema.sql
   ========================================================= */


/* =========================================================
   1. CRIAR A BASE DE DADOS
   ========================================================= */

DROP DATABASE IF EXISTS entre_patas;

CREATE DATABASE entre_patas
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE entre_patas;



/* =========================================================
   2. TABELA SERVICOS
   ========================================================= */

CREATE TABLE servicos (

    id_servico INT AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(100) NOT NULL UNIQUE,

    descricao TEXT NOT NULL,

    preco_base DECIMAL(8,2) NULL,

    ativo BOOLEAN NOT NULL DEFAULT TRUE

);



/* =========================================================
   3. TABELA HORARIOS
   ========================================================= */

CREATE TABLE horarios (

    id_horario INT AUTO_INCREMENT PRIMARY KEY,

    data DATE NOT NULL,

    hora_inicio TIME NOT NULL,

    hora_fim TIME NOT NULL,

    estado ENUM(
        'disponivel',
        'bloqueado'
    ) NOT NULL DEFAULT 'disponivel',

    CONSTRAINT chk_horario
        CHECK (hora_fim > hora_inicio),

    CONSTRAINT uq_horario
        UNIQUE (data, hora_inicio, hora_fim)

);



/* =========================================================
   4. TABELA RESERVAS
   ========================================================= */

CREATE TABLE reservas (

    id_reserva INT AUTO_INCREMENT PRIMARY KEY,

    id_servico INT NOT NULL,

    id_horario INT NOT NULL,

    nome_tutor VARCHAR(100) NOT NULL,

    telefone VARCHAR(20) NOT NULL,

    email VARCHAR(150) NOT NULL,

    nome_animal VARCHAR(100) NOT NULL,

    especie VARCHAR(50) NOT NULL,

    distrito ENUM(
        'Braga',
        'Porto'
    ) NOT NULL,

    morada_servico VARCHAR(255) NOT NULL,

    destino_taxi VARCHAR(255) NULL,

    observacoes TEXT NULL,

    estado ENUM(
        'pendente',
        'confirmada',
        'concluida'
    ) NOT NULL DEFAULT 'pendente',

    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,


    CONSTRAINT fk_reserva_servico
        FOREIGN KEY (id_servico)
        REFERENCES servicos(id_servico)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,


    CONSTRAINT fk_reserva_horario
        FOREIGN KEY (id_horario)
        REFERENCES horarios(id_horario)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,


    CONSTRAINT uq_reserva_horario
        UNIQUE (id_horario)

);



/* =========================================================
   5. DADOS INICIAIS - SERVICOS
   ========================================================= */

INSERT INTO servicos
(nome, descricao, preco_base, ativo)

VALUES

(
    'Pet Sitting',
    'Cuidados ao animal no seu próprio ambiente, mantendo a sua rotina, alimentação, companhia e atualizações ao tutor.',
    NULL,
    TRUE
),

(
    'Passeios',
    'Passeios personalizados, adaptados à idade, condição física e necessidades de cada animal.',
    NULL,
    TRUE
),

(
    'Entre Patas Essencial',
    'Pet sitting, manutenção da rotina, alimentação e água, companhia e atualizações ao tutor.',
    NULL,
    TRUE
),

(
    'Entre Patas Conforto',
    'Inclui todos os serviços do Pack Essencial, passeio e banho.',
    NULL,
    TRUE
),

(
    'Entre Patas Completo',
    'Inclui todos os serviços do Pack Conforto e cuidados básicos de higiene.',
    NULL,
    TRUE
),

(
    'Entre Patas Taxi',
    'Transporte seguro do animal. O valor é calculado de acordo com a distância da deslocação.',
    NULL,
    TRUE
);



/* =========================================================
   6. DADOS INICIAIS - HORARIOS
   ========================================================= */

INSERT INTO horarios
(data, hora_inicio, hora_fim, estado)

VALUES

(
    '2026-09-15',
    '08:00:00',
    '10:00:00',
    'disponivel'
),

(
    '2026-09-15',
    '10:00:00',
    '12:00:00',
    'disponivel'
),

(
    '2026-09-15',
    '14:00:00',
    '16:00:00',
    'disponivel'
),

(
    '2026-09-15',
    '16:00:00',
    '18:00:00',
    'disponivel'
),

(
    '2026-09-15',
    '18:00:00',
    '21:00:00',
    'disponivel'
);