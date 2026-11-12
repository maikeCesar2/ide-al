import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

export default function DetalheIdeia() {
  const { id } = useParams();
  const { user } = useAuth();
  const [idea, setIdea] = useState(null);
  const [history, setHistory] = useState([]);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api(`/api/ideas/${id}`).then(setIdea).catch(e=>setErro(e.message));
    api(`/api/ideas/${id}/historico`).then(setHistory).catch(()=>{});
  }, [id]);

  async function excluir() {
    if (!window.confirm("Deseja realmente excluir esta ideia?")) return;
    try { await api(`/api/ideas/${id}`, { method: "DELETE" }); navigate("/minhas-ideias"); }
    catch (e) { setErro(e.message); }
  }

  if (erro) return <main className="mx-auto max-w-3xl p-8 text-red-600">{erro}</main>;
  if (!idea) return <main className="mx-auto max-w-3xl p-8">Carregando ideia...</main>;

    const ehDono = idea.usuario_id === user?.id;
    const ehAdmin = user?.role === "admin";
    const statusFinal = ["Implementada", "Não aprovada"].includes(idea.status);
    const podeExcluir = (ehDono && idea.status === "Enviada") || (ehAdmin && statusFinal);

  return <main className="mx-auto max-w-3xl px-5 py-10"><Link to="/minhas-ideias" className="text-sm font-semibold text-yellow-700">← Voltar</Link><article className="mt-5 rounded-3xl bg-white p-8 shadow-sm"><span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold">{idea.status}</span><h1 className="mt-4 text-3xl font-extrabold">{idea.titulo}</h1><p className="mt-2 text-sm text-gray-500">Enviada por {idea.autor_nome} · {new Date(idea.criado_em).toLocaleDateString("pt-BR")}</p><p className="mt-7 whitespace-pre-wrap leading-7 text-gray-700">{idea.descricao}</p>{idea.avaliacao_tecnica && <div className="mt-7 rounded-xl bg-gray-50 p-5"><h2 className="font-bold">Avaliação técnica</h2><p className="mt-2 text-sm text-gray-600">{idea.avaliacao_tecnica}</p></div>}{<div className="mt-8 flex gap-3">
  {user?.id === idea.usuario_id && (
    <button
      onClick={() => navigate(`/ideias/${id}/editar`)}
      disabled={idea.status !== "Enviada"}
      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Editar
    </button>
  )}
  {(user?.id === idea.usuario_id || user?.role === "admin") && (
    <button
      onClick={excluir}
      disabled={!podeExcluir}
      className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Excluir
    </button>
  )}
</div>}</article>
    <section className="mt-6 rounded-2xl bg-white p-6"><h2 className="font-bold">Histórico</h2>{history.length ? <ul className="mt-3 space-y-3">{history.map(h=><li key={h.id} className="border-l-2 border-yellow-400 pl-3 text-sm"><p className="font-semibold">{h.status_anterior || "Início"} → {h.status_novo}</p>{h.observacao && <p className="text-gray-500">{h.observacao}</p>}<p className="text-xs text-gray-400">{new Date(h.criado_em).toLocaleString("pt-BR")}</p></li>)}</ul> : <p className="mt-2 text-sm text-gray-500">Nenhuma atualização registrada.</p>}</section>
  </main>;
}
