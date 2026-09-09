import { useEffect, useState } from 'react';
import api from '../api.js';

const vazio = { nome: '', documento: '', email: '', telefone: '', endereco: '', cidade: '', uf: '', observacoes: '' };

export default function Clientes() {
  const [lista, setLista] = useState([]);
  const [busca, setBusca] = useState('');
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(vazio);

  const carregar = () => api.get('/clientes').then((r) => setLista(r.data));
  useEffect(() => { carregar(); }, []);

  const abrirNovo = () => { setEditando(null); setForm(vazio); setModal(true); };
  const abrirEdicao = (c) => { setEditando(c._id); setForm({ ...vazio, ...c }); setModal(true); };

  const salvar = async (e) => {
    e.preventDefault();
    if (editando) await api.put(`/clientes/${editando}`, form);
    else await api.post('/clientes', form);
    setModal(false); carregar();
  };

  const excluir = async (id) => {
    if (!window.confirm('Excluir este cliente?')) return;
    await api.delete(`/clientes/${id}`); carregar();
  };

  const filtrados = lista.filter((c) =>
    (c.nome || '').toLowerCase().includes(busca.toLowerCase()) ||
    (c.documento || '').includes(busca)
  );

  return (
    <div>
      <div className="topbar">
        <h1>Clientes</h1>
        <button className="btn btn-destaque" onClick={abrirNovo}>+ Novo cliente</button>
      </div>

      <div className="card">
        <div className="filtros">
          <div className="campo" style={{ minWidth: 260 }}>
            <label>Buscar</label>
            <input placeholder="Nome ou documento..." value={busca} onChange={(e) => setBusca(e.target.value)} />
          </div>
        </div>
        {filtrados.length === 0 ? (
          <div className="vazio">Nenhum cliente encontrado.</div>
        ) : (
          <table>
            <thead><tr><th>Nome</th><th>Documento</th><th>E-mail</th><th>Telefone</th><th>Cidade/UF</th><th>Ações</th></tr></thead>
            <tbody>
              {filtrados.map((c) => (
                <tr key={c._id}>
                  <td>{c.nome}</td>
                  <td>{c.documento || '-'}</td>
                  <td>{c.email || '-'}</td>
                  <td>{c.telefone || '-'}</td>
                  <td>{c.cidade} {c.uf ? '/' + c.uf : ''}</td>
                  <td>
                    <button className="btn btn-linha btn-mini" onClick={() => abrirEdicao(c)}>Editar</button>{' '}
                    <button className="btn btn-perigo btn-mini" onClick={() => excluir(c._id)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className="modal-fundo" onClick={() => setModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editando ? 'Editar cliente' : 'Novo cliente'}</h2>
            <form onSubmit={salvar}>
              <div className="form-grid">
                <div className="campo"><label>Nome *</label><input required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></div>
                <div className="campo"><label>CPF/CNPJ</label><input value={form.documento} onChange={(e) => setForm({ ...form, documento: e.target.value })} /></div>
                <div className="campo"><label>E-mail</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                <div className="campo"><label>Telefone</label><input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} /></div>
                <div className="campo"><label>Endereço</label><input value={form.endereco} onChange={(e) => setForm({ ...form, endereco: e.target.value })} /></div>
                <div className="campo"><label>Cidade</label><input value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} /></div>
                <div className="campo"><label>UF</label><input maxLength={2} value={form.uf} onChange={(e) => setForm({ ...form, uf: e.target.value.toUpperCase() })} /></div>
                <div className="campo"><label>Observações</label><input value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} /></div>
              </div>
              <div className="modal-acoes">
                <button type="button" className="btn btn-linha" onClick={() => setModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primario">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
