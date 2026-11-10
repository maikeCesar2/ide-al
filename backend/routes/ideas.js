const express = require("express");
const pool = require("../db/db");
const { autenticarToken, somenteAdmin } = require("../middleware/auth");

const router = express.Router();

// IDs que não são números inteiros positivos => 404 (em vez de erro 500 do banco).
router.param("id", (_req, res, next, id) => {
  if (!/^\d{1,9}$/.test(id)) return res.status(404).json({ erro: "Ideia não encontrada." });
  next();
});

router.get("/ideas", autenticarToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT i.*, u.nome AS autor_nome
       FROM ideias i JOIN usuarios u ON u.id = i.usuario_id
       ORDER BY i.criado_em DESC`
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ erro: "Erro ao listar ideias." });
  }
});

router.get("/ideas/minhas", autenticarToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM ideias WHERE usuario_id = $1 ORDER BY criado_em DESC",
      [req.usuario.id]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ erro: "Erro ao listar suas ideias." });
  }
});

router.get("/ideas/:id", autenticarToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT i.*, u.nome AS autor_nome FROM ideias i
       JOIN usuarios u ON u.id = i.usuario_id WHERE i.id = $1`,
      [req.params.id]
    );
    const ideia = result.rows[0];
    if (!ideia) return res.status(404).json({ erro: "Ideia não encontrada." });
    if (ideia.usuario_id !== req.usuario.id && req.usuario.role !== "admin") {
      return res.status(403).json({ erro: "Você não tem acesso a esta ideia." });
    }
    res.json(ideia);
  } catch {
    res.status(500).json({ erro: "Erro ao buscar ideia." });
  }
});

router.post("/ideas", autenticarToken, async (req, res) => {
  const titulo = String(req.body.titulo || "").trim();
  const descricao = String(req.body.descricao || "").trim();
  const categoria = req.body.categoria || null;
  if (!titulo || !descricao) return res.status(400).json({ erro: "Título e descrição são obrigatórios." });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query(
      `INSERT INTO ideias (titulo, descricao, categoria, usuario_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [titulo, descricao, categoria, req.usuario.id]
    );
    const ideia = result.rows[0];
    // Primeira entrada do histórico: o envio da ideia.
    await client.query(
      `INSERT INTO historico_ideias (ideia_id, usuario_id, status_anterior, status_novo, observacao)
       VALUES ($1, $2, NULL, $3, $4)`,
      [ideia.id, req.usuario.id, ideia.status, "Ideia enviada"]
    );
    await client.query("COMMIT");
    res.status(201).json(ideia);
  } catch {
    await client.query("ROLLBACK");
    res.status(500).json({ erro: "Erro ao cadastrar ideia." });
  } finally {
    client.release();
  }
});

router.put("/ideas/:id", autenticarToken, async (req, res) => {
  const { titulo, descricao, categoria } = req.body;
  try {
    const atual = await pool.query("SELECT * FROM ideias WHERE id = $1", [req.params.id]);
    const ideia = atual.rows[0];
    if (!ideia) return res.status(404).json({ erro: "Ideia não encontrada." });
    if (ideia.usuario_id !== req.usuario.id && req.usuario.role !== "admin") {
      return res.status(403).json({ erro: "Você não pode editar esta ideia." });
    }

    const result = await pool.query(
      `UPDATE ideias SET titulo = $1, descricao = $2, categoria = $3,
       atualizado_em = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *`,
      [titulo || ideia.titulo, descricao || ideia.descricao, categoria ?? ideia.categoria, req.params.id]
    );
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ erro: "Erro ao atualizar ideia." });
  }
});

router.delete("/ideas/:id", autenticarToken, async (req, res) => {
  try {
    const atual = await pool.query("SELECT * FROM ideias WHERE id = $1", [req.params.id]);
    const ideia = atual.rows[0];
    if (!ideia) return res.status(404).json({ erro: "Ideia não encontrada." });
    if (ideia.usuario_id !== req.usuario.id && req.usuario.role !== "admin") {
      return res.status(403).json({ erro: "Você não pode excluir esta ideia." });
    }
    await pool.query("DELETE FROM ideias WHERE id = $1", [req.params.id]);
    res.json({ mensagem: "Ideia excluída com sucesso." });
  } catch {
    res.status(500).json({ erro: "Erro ao excluir ideia." });
  }
});

// Rotas administrativas de gestão
router.get("/gestao/ideias", autenticarToken, somenteAdmin, async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT i.*, u.nome AS autor_nome, u.email AS autor_email
       FROM ideias i JOIN usuarios u ON u.id = i.usuario_id
       ORDER BY i.criado_em DESC`
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ erro: "Erro ao carregar gestão." });
  }
});

router.patch("/gestao/ideias/:id", autenticarToken, somenteAdmin, async (req, res) => {
  const { status, avaliacao_tecnica, observacao } = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const atual = await client.query("SELECT * FROM ideias WHERE id = $1 FOR UPDATE", [req.params.id]);
    const ideia = atual.rows[0];
    if (!ideia) {
      await client.query("ROLLBACK");
      return res.status(404).json({ erro: "Ideia não encontrada." });
    }

    const novoStatus = status || ideia.status;
    const novaAvaliacao = avaliacao_tecnica ?? ideia.avaliacao_tecnica;
    const updated = await client.query(
      `UPDATE ideias SET status = $1, avaliacao_tecnica = $2,
       atualizado_em = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *`,
      [novoStatus, novaAvaliacao, req.params.id]
    );

    if (novoStatus !== ideia.status || observacao) {
      await client.query(
        `INSERT INTO historico_ideias
         (ideia_id, usuario_id, status_anterior, status_novo, observacao)
         VALUES ($1, $2, $3, $4, $5)`,
        [req.params.id, req.usuario.id, ideia.status, novoStatus, observacao || null]
      );
    }
    await client.query("COMMIT");
    res.json(updated.rows[0]);
  } catch {
    await client.query("ROLLBACK");
    res.status(500).json({ erro: "Erro ao atualizar a avaliação da ideia." });
  } finally {
    client.release();
  }
});

router.get("/ideas/:id/historico", autenticarToken, async (req, res) => {
  try {
    const ideia = await pool.query("SELECT usuario_id FROM ideias WHERE id = $1", [req.params.id]);
    if (!ideia.rows[0]) return res.status(404).json({ erro: "Ideia não encontrada." });
    if (ideia.rows[0].usuario_id !== req.usuario.id && req.usuario.role !== "admin") {
      return res.status(403).json({ erro: "Acesso não autorizado." });
    }
    const result = await pool.query(
      `SELECT h.*, u.nome AS responsavel FROM historico_ideias h
       LEFT JOIN usuarios u ON u.id = h.usuario_id
       WHERE h.ideia_id = $1 ORDER BY h.criado_em DESC`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ erro: "Erro ao buscar histórico." });
  }
});

module.exports = router;
