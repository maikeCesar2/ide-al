require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const ideasRouter = require("./routes/ideas");
const usuariosRouter = require("./routes/usuarios");
const uploadRouter = require("./routes/upload");

const app = express();
const port = process.env.PORT || 3001;

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET não definido. Configure o arquivo .env.");
  process.exit(1);
}

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", ideasRouter);
app.use("/usuarios", usuariosRouter);
app.use("/api", uploadRouter);

app.get("/", (_req, res) => res.send("API ide.al funcionando!"));

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
