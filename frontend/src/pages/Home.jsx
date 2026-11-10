import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Lightbulb, Users, Rocket } from "lucide-react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import IdeaCard from "../components/IdeaCard";

export default function Home() {
  const [ideas, setIdeas] = useState([]);
  const [erro, setErro] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    api("/api/ideas").then(data => setIdeas(data.slice(0, 3))).catch(e => setErro(e.message));
  }, [user]);

  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <section className="relative overflow-hidden rounded-3xl bg-gray-900 px-7 py-14 text-white md:px-14">
        <div className="relative z-10 max-w-2xl">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm"><Lightbulb size={16} className="text-yellow-300"/> Ideias que transformam</span>
          <h1 className="text-4xl font-black leading-tight md:text-6xl">Toda grande mudança começa com uma <span className="text-yellow-300">ideia.</span></h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-gray-300">Um espaço para compartilhar sugestões, colaborar e transformar boas ideias em melhorias reais.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={user ? "/nova-ideia" : "/cadastro"} className="inline-flex items-center gap-2 rounded-xl bg-brandYellow px-5 py-3 font-bold text-gray-900 hover:bg-yellow-300">Compartilhar ideia <ArrowRight size={18}/></Link>
            <Link to="/sobre" className="rounded-xl border border-white/30 px-5 py-3 font-semibold hover:bg-white/10">Saiba mais</Link>
          </div>
        </div>
        <div className="absolute -right-10 -top-16 h-80 w-80 rounded-full bg-yellow-400/20 blur-3xl"/>
      </section>

      <section className="my-10 grid gap-4 md:grid-cols-3">
        {[["Compartilhe","Sua voz pode inspirar mudanças.",Lightbulb],["Colabore","Construa soluções junto com outras pessoas.",Users],["Transforme","Acompanhe ideias saindo do papel.",Rocket]].map(([title,desc,Icon]) => <div key={title} className="rounded-2xl bg-white p-6 shadow-sm"><Icon className="mb-4 text-yellow-600" size={26}/><h2 className="font-bold">{title}</h2><p className="mt-1 text-sm text-gray-500">{desc}</p></div>)}
      </section>

      {user && <section>
        <div className="mb-5 flex items-end justify-between"><div><p className="text-sm font-semibold uppercase tracking-wider text-yellow-700">Comunidade</p><h2 className="text-2xl font-extrabold">Ideias recentes</h2></div><Link to="/minhas-ideias" className="text-sm font-semibold text-yellow-700 hover:underline">Ver minhas ideias</Link></div>
        {erro && <p className="mb-3 text-sm text-red-600">{erro}</p>}
        {ideas.length ? <div className="grid gap-5 md:grid-cols-3">{ideas.map(idea => <IdeaCard key={idea.id} idea={idea}/>)}</div> : <div className="rounded-2xl border border-dashed bg-white p-8 text-center text-gray-500">Ainda não há ideias para mostrar. Que tal cadastrar a primeira?</div>}
      </section>}
    </main>
  );
}
