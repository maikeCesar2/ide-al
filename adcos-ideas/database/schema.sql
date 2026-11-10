CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(180) NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'comum',
    foto TEXT,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ideias (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(180) NOT NULL,
    descricao TEXT NOT NULL,
    categoria VARCHAR(100),
    status VARCHAR(40) NOT NULL DEFAULT 'Enviada',
    avaliacao_tecnica TEXT,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS historico_ideias (
    id SERIAL PRIMARY KEY,
    ideia_id INTEGER NOT NULL REFERENCES ideias(id) ON DELETE CASCADE,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    status_anterior VARCHAR(40),
    status_novo VARCHAR(40),
    observacao TEXT,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ideias_usuario_id ON ideias(usuario_id);
CREATE INDEX IF NOT EXISTS idx_ideias_criado_em ON ideias(criado_em DESC);
