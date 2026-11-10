import { useEffect, useState } from "react";
import { api } from "../api";

const statuses = ["Enviada", "Em análise", "Aprovada", "Em desenvolvimento", "Implementada", "Não aprovada"];

export default function Gestao() {
  const [ideas, setIdeas] = useState([]);
  const [erro, setErro] = useState("");
  const [editing, setEditing] = useState({});
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const load = () => api("/api/gestao/ideias").then(setIdeas).catch(e=>setErro(e.message));
  useEffect(() => { load(); }, []);

  async function save(id) {
    try {
      await api(`/api/gestao/ideias/${id}`, { method: "PATCH", body: JSON.stringify(editing[id] || {}) });
      setEditing(prev => { const next = {...prev}; delete next[id]; return next; });
      load();
    } catch (e) { setErro(e.message); }
  }

  const termo = busca.trim().toLowerCase();
  const filtradas = ideas.filter(i =>
    (!filtroStatus || i.status === filtroStatus) &&
    (!termo || [i.titulo, i.descricao, i.autor_nome, i.autor_email, i.categoria].some(v => (v || "").toLowerCase().includes(termo)))
  );

  return <main className="mx-auto max-w-7xl px-5 py-10"><p className="text-sm font-bold uppercase tracking-wider text-yellow-700">Área administrativa</p><h1 className="mt-2 text-3xl font-extrabold">Gestão de ideias</h1><p className="mt-2 text-gray-500">Acompanhe as sugestões e atualize o andamento de cada uma.</p>
    {erro && <p className="mt-4 text-red-600">{erro}</p>}
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar por título, autor, categoria..." className="min-w-64 flex-1 rounded-xl border bg-white p-3 text-sm"/>
      <select value={filtroStatus} onChange={e=>setFiltroStatus(e.target.value)} className="rounded-xl border bg-white p-3 text-sm"><option value="">Todos os status</option>{statuses.map(s=><option key={s}>{s}</option>)}</select>
      <span className="text-sm text-gray-500">{filtradas.length} de {ideas.length} ideias</span>
    </div>
    <div className="mt-5 space-y-4">{filtradas.map(idea=><article key={idea.id} className="rounded-2xl bg-white p-6 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-bold">{idea.titulo}</h2><p className="mt-1 text-sm text-gray-500">Por {idea.autor_nome} · {idea.autor_email}</p><p className="mt-3 text-sm text-gray-700">{idea.descricao}</p></div><span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold">{idea.status}</span></div>
      <div className="mt-5 grid gap-3 md:grid-cols-2"><label className="text-sm font-semibold">Status<select value={editing[idea.id]?.status ?? idea.status} onChange={e=>setEditing(p=>({...p,[idea.id]:{...p[idea.id],status:e.target.value}}))} className="mt-1 w-full rounded-lg border bg-white p-2">{statuses.map(s=><option key={s}>{s}</option>)}</select></label><label className="text-sm font-semibold">Avaliação técnica<textarea rows="2" value={editing[idea.id]?.avaliacao_tecnica ?? idea.avaliacao_tecnica ?? ""} onChange={e=>setEditing(p=>({...p,[idea.id]:{...p[idea.id],avaliacao_tecnica:e.target.value}}))} className="mt-1 w-full rounded-lg border p-2"/></label></div>
      <label className="mt-3 block text-sm font-semibold">Observação do histórico<textarea rows="2" placeholder="Opcional: descreva a atualização..." value={editing[idea.id]?.observacao ?? ""} onChange={e=>setEditing(p=>({...p,[idea.id]:{...p[idea.id],observacao:e.target.value}}))} className="mt-1 w-full rounded-lg border p-2"/></label>
      <button onClick={()=>save(idea.id)} className="mt-3 rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white">Salvar atualização</button>
    </article>)}</div>
    {ideas.length > 0 && !filtradas.length && <p className="mt-6 rounded-xl bg-white p-6 text-gray-500">Nenhuma ideia encontrada com esses filtros.</p>}
    {!ideas.length && !erro && <p className="mt-6 rounded-xl bg-white p-6 text-gray-500">Nenhuma ideia cadastrada ainda.</p>}
  </main>;
}
