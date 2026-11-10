export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function api(path, options = {}) {
  const token = sessionStorage.getItem("token");
  const headers = { ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.body && !(options.body instanceof FormData)) headers["Content-Type"] = "application/json";

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  // Token expirado/inválido: avisa o AuthContext para deslogar.
  // (Só quando havia token; um 401 de login com senha errada não conta.)
  if (response.status === 401 && token) {
    window.dispatchEvent(new Event("auth:expired"));
  }

  if (!response.ok) throw new Error(data.erro || "Ocorreu um erro na solicitação.");
  return data;
}
