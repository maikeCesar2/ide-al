const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db/db");
const { autenticarToken } = require("../middleware/auth");

const router = express.Router();

router.post("/", async (req, res) => {
  const nome = String(req.body.nome || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const senha = String(req.body.senha || "");
  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Preencha nome, email e senha." });
  }
  if (senha.length < 6) {
    return res.status(400).json({ erro: "A senha deve ter pelo menos 6 caracteres." });
  }

  try {
    const hash = await bcrypt.hash(senha, 10);
    const result = await pool.query(
      "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email, role, foto",
      [nome, email, hash]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") return res.status(409).json({ erro: "Este email já está cadastrado." });
    res.status(500).json({ erro: "Erro ao cadastrar usuário." });
  }
});

router.post("/login", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const senha = String(req.body.senha || "");
  if (!email || !senha) return res.status(400).json({ erro: "Informe email e senha." });

  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE LOWER(email) = $1", [email]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ erro: "Email ou senha inválidos." });

    const senhaCorreta = await bcrypt.compare(senha, user.senha);
    if (!senhaCorreta) return res.status(401).json({ erro: "Email ou senha inválidos." });

    const token = jwt.sign(
      { id: user.id, email: user.email, nome: user.nome, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      mensagem: "Login bem-sucedido",
      usuario: { id: user.id, nome: user.nome, email: user.email, role: user.role, foto: user.foto },
      token
    });
  } catch {
    res.status(500).json({ erro: "Erro ao fazer login." });
  }
});

router.get("/me", autenticarToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, nome, email, role, foto FROM usuarios WHERE id = $1",
      [req.usuario.id]
    );
    if (!result.rows[0]) return res.status(404).json({ erro: "Usuário não encontrado." });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ erro: "Erro ao buscar usuário." });
  }
});

module.exports = router;
