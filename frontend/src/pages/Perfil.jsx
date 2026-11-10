import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_URL, api } from "../api";

export default function Perfil() {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    setFotoPerfil(user?.foto ? `${API_URL}/uploads/${user.foto}` : null);
  }, [user]);

  async function handleFotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("foto", file);
    setErro(""); setEnviando(true);
    try {
      const result = await api("/api/upload-foto", { method: "POST", body: formData });
      if (result.sucesso && result.foto) {
        const updated = { ...user, foto: result.foto };
        setUser(updated);
        setFotoPerfil(`${API_URL}/uploads/${result.foto}`);
      }
    } catch (err) { setErro(err.message); }
    finally { setEnviando(false); e.target.value = ""; }
  }

  function handleLogout() {
    if (window.confirm("Deseja realmente sair da conta?")) {
      logout();
      navigate("/login");
    }
  }

  return <main className="mx-auto max-w-xl px-5 py-12"><section className="rounded-3xl bg-white p-8 text-center shadow-sm"><h1 className="text-3xl font-extrabold">Meu Perfil</h1>
    <button type="button" onClick={()=>fileInputRef.current?.click()} className="group relative mx-auto mt-7 block h-28 w-28 overflow-hidden rounded-full border-4 border-yellow-200 bg-gray-100">
      {fotoPerfil ? <img src={fotoPerfil} alt="Foto de perfil" onError={()=>setFotoPerfil(null)} className="h-full w-full object-cover"/> : <span className="flex h-full w-full items-center justify-center text-3xl font-bold text-gray-500">{user?.nome?.[0]?.toUpperCase()}</span>}
      <span className="absolute inset-x-0 bottom-0 bg-black/60 py-1 text-xs font-semibold text-white">Alterar</span>
    </button>
    <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleFotoChange} className="hidden"/>
    {enviando && <p className="mt-2 text-sm text-gray-500">Enviando foto...</p>}
    {erro && <p className="mt-2 text-sm text-red-600">{erro}</p>}
    <div className="mt-7 space-y-2 text-left"><p className="rounded-xl bg-gray-50 p-3 text-sm"><strong>Usuário:</strong> {user?.nome}</p><p className="rounded-xl bg-gray-50 p-3 text-sm"><strong>Email:</strong> {user?.email}</p><p className="rounded-xl bg-gray-50 p-3 text-sm"><strong>Perfil:</strong> {user?.role === "admin" ? "Administrador" : "Comum"}</p></div>
    <button onClick={handleLogout} className="mt-7 w-full rounded-xl bg-red-500 py-3 font-bold text-white hover:bg-red-600">Sair da conta</button>
  </section></main>;
}
