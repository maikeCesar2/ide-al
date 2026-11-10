import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { APP_NAME } from "../config";

export default function Cadastro() {
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const navigate = useNavigate();
  const change = e => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault(); setErro(""); setSucesso("");
    try {
      await api("/usuarios", { method: "POST", body: JSON.stringify(form) });
      setSucesso("Conta criada! Agora você já pode entrar.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) { setErro(err.message); }
  }

  return <main className="mx-auto max-w-md px-5 py-14"><div className="rounded-3xl bg-white p-8 shadow-sm"><h1 className="text-3xl font-extrabold">Crie sua conta</h1><p className="mt-2 text-sm text-gray-500">Faça parte da comunidade {APP_NAME}.</p>
    <form onSubmit={handleSubmit} className="mt-7 space-y-4">
      <label className="block text-sm font-semibold">Nome<input name="nome" required value={form.nome} onChange={change} className="mt-2 w-full rounded-xl border p-3"/></label>
      <label className="block text-sm font-semibold">Email<input name="email" type="email" required value={form.email} onChange={change} className="mt-2 w-full rounded-xl border p-3"/></label>
      <label className="block text-sm font-semibold">Senha<input name="senha" type="password" minLength="6" required value={form.senha} onChange={change} className="mt-2 w-full rounded-xl border p-3"/></label>
      {erro && <p className="text-sm text-red-600">{erro}</p>}{sucesso && <p className="text-sm text-green-700">{sucesso}</p>}
      <button className="w-full rounded-xl bg-brandYellow py-3 font-bold">Criar conta</button>
    </form><p className="mt-5 text-center text-sm text-gray-500">Já tem conta? <Link to="/login" className="font-bold text-yellow-700">Entrar</Link></p>
  </div></main>;
}
