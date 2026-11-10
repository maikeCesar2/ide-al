const jwt = require("jsonwebtoken");
const pool = require("../db/db");

// Valida o token e carrega os dados ATUAIS do usuário no banco,
// assim mudanças de perfil (ex.: virar admin) valem sem precisar de novo login.
async function autenticarToken(req, res, next) {
  const header = req.headers.authorization;
  const token = header && header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ erro: "Token não informado." });

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ erro: "Sessão expirada. Entre novamente." });
  }

  try {
    const result = await pool.query(
      "SELECT id, nome, email, role FROM usuarios WHERE id = $1",
      [payload.id]
    );
    if (!result.rows[0]) return res.status(401).json({ erro: "Usuário não encontrado. Entre novamente." });
    req.usuario = result.rows[0];
    next();
  } catch {
    res.status(500).json({ erro: "Erro ao validar sessão." });
  }
}

function somenteAdmin(req, res, next) {
  if (req.usuario?.role !== "admin") {
    return res.status(403).json({ erro: "Acesso permitido somente à gestão." });
  }
  next();
}

module.exports = { autenticarToken, somenteAdmin };
