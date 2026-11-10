import { Link, NavLink } from "react-router-dom";
import { Lightbulb, LayoutGrid } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../api";
import { APP_NAME } from "../config";

export default function Navbar() {
  const { user } = useAuth();
  const linkClass = ({ isActive }) => `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? "bg-yellow-100 text-gray-900" : "text-gray-600 hover:bg-gray-100"}`;

  return (
    <header className="sticky top-0 z-20 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brandYellow"><Lightbulb size={22}/></span>
          <span>{APP_NAME.includes(".") ? <>{APP_NAME.slice(0, APP_NAME.lastIndexOf("."))}<span className="text-yellow-600">{APP_NAME.slice(APP_NAME.lastIndexOf("."))}</span></> : APP_NAME}</span>
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-1">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          {user && <NavLink to="/minhas-ideias" className={linkClass}>Minhas Ideias</NavLink>}
          {user && <NavLink to="/nova-ideia" className={linkClass}>Nova Ideia</NavLink>}
          {user?.role === "admin" && <NavLink to="/gestao" className={linkClass}><LayoutGrid size={15} className="mr-1 inline"/> Gestão</NavLink>}
          <NavLink to="/sobre" className={linkClass}>Sobre</NavLink>
          {user ? (
            <Link to="/perfil" className="ml-2 flex items-center gap-2 rounded-full border p-1 pr-3 hover:bg-gray-50">
              {user.foto ? <img src={`${API_URL}/uploads/${user.foto}`} className="h-8 w-8 rounded-full object-cover" /> : <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 font-bold">{user.nome?.[0]?.toUpperCase()}</span>}
              <span className="max-w-28 truncate text-sm font-semibold">{user.nome}</span>
            </Link>
          ) : <NavLink to="/login" className={linkClass}>Entrar</NavLink>}
        </nav>
      </div>
    </header>
  );
}
