import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const menu = [
  { to: '/', icone: '▦', texto: 'Dashboard', fim: true },
  { to: '/obras', icone: '🏗', texto: 'Obras' },
  { to: '/clientes', icone: '👥', texto: 'Clientes' },
  { to: '/orcamentos', icone: '📋', texto: 'Orçamentos' },
  { to: '/contratos', icone: '📄', texto: 'Contratos' },
  { to: '/financeiro', icone: '💰', texto: 'Financeiro' },
  { to: '/materiais', icone: '📦', texto: 'Materiais / Estoque' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const sair = () => { logout(); navigate('/login'); };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="logo"><span>Contru-ERP</span></div>
        <nav>
          {menu.map((m) => (
            <NavLink key={m.to} to={m.to} end={m.fim}
              className={({ isActive }) => (isActive ? 'ativo' : '')}>
              <span style={{ marginRight: 10 }}>{m.icone}</span>
              <span className="txt">{m.texto}</span>
            </NavLink>
          ))}
        </nav>
        <div className="user-box">
          <div className="nome">{user?.nome}</div>
          <div style={{ opacity: .7, fontSize: 11 }}>{user?.email}</div>
          <button onClick={sair}>Sair</button>
        </div>
      </aside>
      <main className="conteudo">
        <Outlet />
      </main>
    </div>
  );
}
