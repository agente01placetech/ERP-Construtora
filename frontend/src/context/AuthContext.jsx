import { createContext, useContext, useState } from 'react';
import api from '../api.js';

const AuthContext = createContext(null);

// Leitura segura: se o valor estiver corrompido, limpa e segue como deslogado
function lerUsuarioSalvo() {
  try {
    const salvo = localStorage.getItem('user');
    if (!salvo) return null;
    const parsed = JSON.parse(salvo);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return null;
  }
}

function salvarSessao(data) {
  if (data?.token) localStorage.setItem('token', data.token);
  if (data?.user && typeof data.user === 'object') {
    localStorage.setItem('user', JSON.stringify(data.user));
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(lerUsuarioSalvo);

  const login = async (email, senha) => {
    const { data } = await api.post('/auth/login', { email, senha });
    salvarSessao(data);
    setUser(data.user || null);
    return data.user;
  };

  const registro = async (dados) => {
    const { data } = await api.post('/auth/registro', dados);
    salvarSessao(data);
    setUser(data.user || null);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, registro, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);