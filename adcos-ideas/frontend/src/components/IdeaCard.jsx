import { Link } from "react-router-dom";
import { CalendarDays, Tag } from "lucide-react";

export default function IdeaCard({ idea }) {
  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">{idea.status || "Enviada"}</span>
        {idea.categoria && <span className="flex items-center gap-1 text-xs text-gray-500"><Tag size={13}/>{idea.categoria}</span>}
      </div>
      <h3 className="mb-2 text-lg font-bold">{idea.titulo}</h3>
      <p className="mb-4 line-clamp-3 text-sm leading-6 text-gray-600">{idea.descricao}</p>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{idea.autor_nome || "Sua ideia"}</span>
        <span className="flex items-center gap-1"><CalendarDays size={13}/>{new Date(idea.criado_em).toLocaleDateString("pt-BR")}</span>
      </div>
      {idea.id && <Link to={`/ideias/${idea.id}`} className="mt-4 inline-block text-sm font-semibold text-yellow-700 hover:underline">Ver detalhes →</Link>}
    </article>
  );
}
