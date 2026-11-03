/* ENTRE PATAS - BASE DE DADOS */


/* CRIAR A BASE DE DADOS */

DROP DATABASE IF EXISTS entre_patas;

CREATE DATABASE entre_patas
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE entre_patas;


/* TABELA SERVICOS */

CREATE TABLE servicos (

    id_servico INT AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(100) NOT NULL UNIQUE,

    descricao TEXT NOT NULL,

    preco_base DECIMAL(8,2) NULL,

    ativo BOOLEAN NOT NULL DEFAULT TRUE

);


/* TABELA HORARIOS */

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
        UNIQUE (data, hora_inicio, hora_fim),

    INDEX idx_horarios_data_estado
        (data, estado)

);


/* TABELA RESERVAS */

CREATE TABLE reservas (

    id_reserva INT AUTO_INCREMENT PRIMARY KEY,

    id_servico INT NOT NULL,

    id_horario INT NOT NULL,

    hora_inicio TIME NOT NULL,

    hora_fim TIME NOT NULL,

    nome_tutor VARCHAR(100) NOT NULL,

    telefone VARCHAR(20) NOT NULL,

    email VARCHAR(150) NOT NULL,

    nome_animal VARCHAR(100) NOT NULL,

    especie VARCHAR(100) NOT NULL,

    concelho VARCHAR(100) NOT NULL,

    morada_servico VARCHAR(255) NOT NULL,

    codigo_postal VARCHAR(8) NOT NULL,

    incluir_taxi BOOLEAN NOT NULL DEFAULT FALSE,

    origem_taxi VARCHAR(255) NULL,

    destino_taxi VARCHAR(255) NULL,

    data_taxi DATE NULL,

    hora_taxi TIME NULL,

    observacoes TEXT NULL,

    estado ENUM(
        'pendente',
        'confirmada',
        'concluida'
    ) NOT NULL DEFAULT 'pendente',

    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_reserva_horas
        CHECK (hora_fim > hora_inicio),

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

    INDEX idx_reservas_estado
        (estado),

    INDEX idx_reservas_horario
        (id_horario)

);


/* TABELA ADMINISTRADORES */

CREATE TABLE administradores (

    id_admin INT AUTO_INCREMENT PRIMARY KEY,

    utilizador VARCHAR(100) NOT NULL UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP

);


/* DADOS INICIAIS DOS SERVICOS */

INSERT INTO servicos
(
    id_servico,
    nome,
    descricao,
    preco_base,
    ativo
)

VALUES

(
    1,
    'Pet Sitting',
    'Cuidados ao animal no seu próprio ambiente, mantendo a rotina, alimentação, água, companhia e atualizações ao tutor.',
    8.00,
    TRUE
),

(
    2,
    'Passeios',
    'Passeios personalizados de 30 ou 60 minutos, adaptados à idade, condição física e necessidades de cada animal.',
    6.00,
    TRUE
),

(
    3,
    'Entre Patas Essencial',
    'Acompanhamento até 6 horas, com manutenção da rotina, alimentação e água, companhia, passeio e atualizações ao tutor.',
    45.00,
    TRUE
),

(
    4,
    'Entre Patas Conforto',
    'Inclui tudo o que está no Pack Essencial, acompanhamento até 8 horas e banho simples quando adequado e combinado previamente.',
    58.00,
    TRUE
),

(
    5,
    'Entre Patas Completo',
    'Inclui tudo o que está no Pack Conforto, acompanhamento até 10 horas, cuidados básicos de higiene e acompanhamento personalizado.',
    70.00,
    TRUE
),

(
    6,
    'Entre Patas Taxi',
    'Transporte seguro do animal. O valor é calculado de acordo com a distância da deslocação.',
    NULL,
    TRUE
);


/* O ADMINISTRADOR DEVE SER CRIADO COM UMA PASSWORD BCRYPT */

/*
EXEMPLO DA ESTRUTURA DO INSERT:

INSERT INTO administradores
(utilizador, password_hash)
VALUES
('nome_do_utilizador', 'hash_bcrypt_da_password');
*/
