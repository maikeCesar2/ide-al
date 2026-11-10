import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { APP_NAME } from "../config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault(); setErro(""); setLoading(true);
    try {
      const data = await api("/usuarios/login", { method: "POST", body: JSON.stringify({ email, senha }) });
      login(data.usuario, data.token);
      navigate("/");
    } catch (err) { setErro(err.message); }
    finally { setLoading(false); }
  }

  return <main className="mx-auto max-w-md px-5 py-14"><div className="rounded-3xl bg-white p-8 shadow-sm"><h1 className="text-3xl font-extrabold">Bem-vindo de volta!</h1><p className="mt-2 text-sm text-gray-500">Entre na sua conta do {APP_NAME}.</p>
    <form onSubmit={handleSubmit} className="mt-7 space-y-4">
      <label className="block text-sm font-semibold">Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full rounded-xl border p-3 outline-none focus:border-yellow-500"/></label>
      <label className="block text-sm font-semibold">Senha<input type="password" required value={senha} onChange={e=>setSenha(e.target.value)} className="mt-2 w-full rounded-xl border p-3 outline-none focus:border-yellow-500"/></label>
      {erro && <p className="text-sm text-red-600">{erro}</p>}
      <button disabled={loading} className="w-full rounded-xl bg-brandYellow py-3 font-bold text-gray-900 disabled:opacity-60">{loading ? "Entrando..." : "Entrar"}</button>
    </form><p className="mt-5 text-center text-sm text-gray-500">Ainda não tem conta? <Link to="/cadastro" className="font-bold text-yellow-700">Criar conta</Link></p>
  </div></main>;
}
