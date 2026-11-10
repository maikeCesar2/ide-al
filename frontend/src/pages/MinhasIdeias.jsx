import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import IdeaCard from "../components/IdeaCard";

export default function MinhasIdeias() {
  const [ideas, setIdeas] = useState([]);
  const [erro, setErro] = useState("");
  useEffect(() => { api("/api/ideas/minhas").then(setIdeas).catch(e=>setErro(e.message)); }, []);
  return <main className="mx-auto max-w-7xl px-5 py-10"><div className="mb-7 flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-bold uppercase tracking-wider text-yellow-700">Meu espaço</p><h1 className="text-3xl font-extrabold">Minhas ideias</h1></div><Link to="/nova-ideia" className="rounded-xl bg-brandYellow px-5 py-3 font-bold">+ Nova ideia</Link></div>
    {erro && <p className="text-red-600">{erro}</p>}
    {ideas.length ? <div className="grid gap-5 md:grid-cols-3">{ideas.map(i=><IdeaCard key={i.id} idea={i}/>)}</div> : <div className="rounded-2xl border border-dashed bg-white p-10 text-center"><p className="font-semibold">Você ainda não cadastrou nenhuma ideia.</p><Link to="/nova-ideia" className="mt-3 inline-block font-bold text-yellow-700">Cadastrar minha primeira ideia</Link></div>}
  </main>;
}
