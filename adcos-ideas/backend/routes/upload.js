const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pool = require("../db/db");
const { autenticarToken } = require("../middleware/auth");

const router = express.Router();
const uploadDir = path.join(__dirname, "..", "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const EXT_POR_MIME = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    cb(null, `perfil-${req.usuario.id}-${Date.now()}${EXT_POR_MIME[file.mimetype]}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!EXT_POR_MIME[file.mimetype]) {
      return cb(new Error("Envie uma imagem JPG, PNG, WEBP ou GIF."));
    }
    cb(null, true);
  },
});

// Envolve o multer para devolver erros em JSON (e não uma página HTML de erro).
function receberFoto(req, res, next) {
  upload.single("foto")(req, res, (err) => {
    if (!err) return next();
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ erro: "A imagem deve ter no máximo 5 MB." });
    }
    return res.status(400).json({ erro: err.message || "Não foi possível enviar a foto." });
  });
}

router.post("/upload-foto", autenticarToken, receberFoto, async (req, res) => {
  if (!req.file) return res.status(400).json({ erro: "Selecione uma foto." });
  try {
    const antiga = await pool.query("SELECT foto FROM usuarios WHERE id = $1", [req.usuario.id]);
    await pool.query("UPDATE usuarios SET foto = $1 WHERE id = $2", [req.file.filename, req.usuario.id]);

    // Remove a foto anterior do disco para não acumular arquivos.
    const fotoAntiga = antiga.rows[0]?.foto;
    if (fotoAntiga) fs.unlink(path.join(uploadDir, path.basename(fotoAntiga)), () => {});

    res.json({ sucesso: true, foto: req.file.filename });
  } catch {
    fs.unlink(req.file.path, () => {});
    res.status(500).json({ erro: "Não foi possível salvar a foto." });
  }
});

module.exports = router;
