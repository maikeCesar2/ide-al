import { Lightbulb, Target, Users } from "lucide-react";
import { APP_NAME } from "../config";

export default function Sobre() {
  return <main className="mx-auto max-w-4xl px-5 py-12"><section className="rounded-3xl bg-white p-8 shadow-sm md:p-12"><p className="text-sm font-bold uppercase tracking-wider text-yellow-700">Sobre o projeto</p><h1 className="mt-2 text-4xl font-extrabold">{APP_NAME}</h1><p className="mt-5 text-lg leading-8 text-gray-600">O {APP_NAME} é um espaço para reunir sugestões, incentivar a participação e transformar ideias em oportunidades de melhoria.</p><div className="mt-9 grid gap-4 md:grid-cols-3">{[[Lightbulb,"Inovação","Dar espaço para novas ideias."],[Users,"Participação","Valorizar a contribuição das pessoas."],[Target,"Resultados","Acompanhar sugestões até sua realização."]].map(([Icon,title,desc])=><div key={title} className="rounded-2xl bg-gray-50 p-5"><Icon className="text-yellow-600" size={26}/><h2 className="mt-3 font-bold">{title}</h2><p className="mt-1 text-sm text-gray-500">{desc}</p></div>)}</div></section></main>;
}
