import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import NovaIdeia from "./pages/NovaIdeia";
import MinhasIdeias from "./pages/MinhasIdeias";
import DetalheIdeia from "./pages/DetalheIdeia";
import Gestao from "./pages/Gestao";
import Perfil from "./pages/Perfil";
import Sobre from "./pages/Sobre";
import { APP_NAME } from "./config";

function NotFound() {
  return <main className="mx-auto max-w-3xl px-5 py-20 text-center"><h1 className="text-3xl font-extrabold">Página não encontrada</h1><a href="/" className="mt-4 inline-block font-bold text-yellow-700">Voltar para o início</a></main>;
}

export default function App() {
  return <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/sobre" element={<Sobre />} />
      <Route path="/nova-ideia" element={<ProtectedRoute><NovaIdeia /></ProtectedRoute>} />
      <Route path="/minhas-ideias" element={<ProtectedRoute><MinhasIdeias /></ProtectedRoute>} />
      <Route path="/ideias/:id" element={<ProtectedRoute><DetalheIdeia /></ProtectedRoute>} />
      <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
      <Route path="/gestao" element={<ProtectedRoute admin><Gestao /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <footer className="mt-12 border-t bg-white py-6 text-center text-xs text-gray-400">{APP_NAME} · Projeto de inovação e colaboração</footer>
  </>;
}
