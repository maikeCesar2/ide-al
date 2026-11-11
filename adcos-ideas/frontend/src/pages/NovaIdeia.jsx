import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";

export default function NovaIdeia() {
  const [form, setForm] = useState({ titulo: "", categoria: "", descricao: "" });
  const [erro, setErro] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const editando = Boolean(id)

  useEffect(() => {
  if (!editando) return;
  api(`/api/ideas/${id}`)
    .then(ideia => setForm({ titulo: ideia.titulo, categoria: ideia.categoria || "", descricao: ideia.descricao }))
    .catch(err => setErro(err.message));
}, [id]);

  const change = e => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault(); setErro("");
    try { const url = editando ? `/api/ideas/${id}` : "/api/ideas";
  const metodo = editando ? "PUT" : "POST";
  await api(url, { method: metodo, body: JSON.stringify(form) });
  navigate("/minhas-ideias"); }
    catch (err) { setErro(err.message); }
  }

  return <main className="mx-auto max-w-2xl px-5 py-12"><div className="rounded-3xl bg-white p-8 shadow-sm"><p className="text-sm font-bold uppercase tracking-wider text-yellow-700">Sua contribuição</p><h1 className="mt-2 text-3xl font-extrabold">{editando ? "Editar ideia" : "Compartilhe uma ideia"}</h1><p className="mt-2 text-gray-500">Descreva sua sugestão com clareza. Toda ideia pode fazer a diferença.</p>
    <form onSubmit={submit} className="mt-7 space-y-5">
      <label className="block text-sm font-semibold">Título da ideia<input name="titulo" required value={form.titulo} onChange={change} className="mt-2 w-full rounded-xl border p-3"/></label>
      <label className="block text-sm font-semibold">Categoria<select name="categoria" value={form.categoria} onChange={change} className="mt-2 w-full rounded-xl border bg-white p-3"><option value="">Selecione uma categoria</option><option>Processos</option><option>Produto</option><option>Atendimento</option><option>Tecnologia</option><option>Ambiente</option><option>Outra</option></select></label>
      <label className="block text-sm font-semibold">Descrição<textarea name="descricao" required rows="6" value={form.descricao} onChange={change} className="mt-2 w-full rounded-xl border p-3" placeholder="Explique sua ideia, o problema que ela resolve e os benefícios..."/></label>
      {erro && <p className="text-sm text-red-600">{erro}</p>}
      <button className="rounded-xl bg-brandYellow px-6 py-3 font-bold">Enviar ideia</button>
    </form>
  </div></main>;
}
