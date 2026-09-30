import { useState } from 'react';
import { getJokeById, updateJoke, patchJoke, deleteJoke } from '../api';
import { JOKE_TYPES, typeEmoji, typeBadgeClass } from '../utils.jsx';

// ---- Edit Modal ----
function EditModal({ joke, onClose, onSaved, onToast }) {
  const [text, setText] = useState(joke.joketext || '');
  const [type, setType] = useState(joke.joketype || '');
  const [loading, setLoading] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await updateJoke(joke.id, text, type);
      onToast('Broma actualizada ✏️', 'success');
      onSaved(updated);
    } catch (err) {
      onToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="edit-modal-title">
      <div className="modal">
        <h3 id="edit-modal-title" className="modal-title">✏️ Editar broma #{joke.id}</h3>
        <form onSubmit={handleSave} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="edit-text">Texto</label>
            <textarea
              id="edit-text"
              className="form-textarea"
              value={text}
              onChange={e => setText(e.target.value)}
              rows={3}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="edit-type">Tipo</label>
            <select
              id="edit-type"
              className="form-select"
              value={type}
              onChange={e => setType(e.target.value)}
            >
              <option value="">-- Selecciona --</option>
              {JOKE_TYPES.map(t => (
                <option key={t} value={t}>{typeEmoji(t)} {t}</option>
              ))}
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button id="btn-edit-save" type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '⏳' : '💾 Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---- Delete confirm modal ----
function DeleteModal({ joke, onClose, onDeleted, onToast }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      await deleteJoke(joke.id);
      onToast(`Broma #${joke.id} eliminada 🗑️`, 'success');
      onDeleted();
    } catch (err) {
      onToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
      <div className="modal">
        <h3 id="delete-modal-title" className="modal-title">Eliminar broma</h3>
        <p style={{ color: 'var(--gray-600)', marginBottom: '0.75rem' }}>
          ¿Seguro que quieres eliminar esta broma?
        </p>
        <div className="card" style={{ background: 'var(--red-light)', border: '1px solid var(--red)', margin: 0 }}>
          <p style={{ fontWeight: 700, color: 'var(--gray-800)' }}>{joke.joketext}</p>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button id="btn-delete-confirm" type="button" className="btn btn-delete" onClick={handleDelete} disabled={loading}>
            {loading ? 'Cargando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- Main Tab ----
export default function ManageTab({ onToast }) {
  const [jokeId, setJokeId] = useState('');
  const [joke, setJoke] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    const id = parseInt(jokeId, 10);
    if (!id || id < 1) { onToast('Ingresa un ID válido (número mayor a 0)', 'info'); return; }
    setLoading(true);
    setJoke(null);
    try {
      const data = await getJokeById(id);
      if (!data) throw new Error(`No se encontró la broma con ID ${id}`);
      setJoke(data);
    } catch (err) {
      onToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  function handleSaved(updated) {
    setJoke(updated);
    setEditOpen(false);
  }

  function handleDeleted() {
    setJoke(null);
    setJokeId('');
    setDelOpen(false);
  }

  return (
    <section aria-labelledby="manage-title">
      <h2 id="manage-title" className="section-title">
        Buscar y gestionar
      </h2>

      {/* Search by ID */}
      <div className="card">
        <form onSubmit={handleSearch} noValidate>
          <div className="form-row" style={{ alignItems: 'flex-end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="search-id">ID de la broma</label>
              <input
                id="search-id"
                type="number"
                min="1"
                className="form-input"
                placeholder="Ej. 42"
                value={jokeId}
                onChange={e => setJokeId(e.target.value)}
              />
            </div>
            <button id="btn-search-id" type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Cargando...' : 'Buscar'}
            </button>
          </div>
        </form>
      </div>

      {/* Result card */}
      {joke && (
        <div className="card joke-card" style={{ borderColor: 'var(--yellow-dark)' }}>
          <div className="joke-header">
            <span className="joke-emoji">{typeEmoji(joke.joketype)}</span>
            <p className="joke-text">{joke.joketext}</p>
          </div>
          <div className="joke-meta">
            <span className={`badge ${typeBadgeClass(joke.joketype)}`}>{joke.joketype}</span>
            <span className="joke-id">ID: {joke.id}</span>
          </div>
          <div className="joke-actions">
            <button id="btn-open-edit" className="btn btn-edit" onClick={() => setEditOpen(true)}>
              Editar
            </button>
            <button id="btn-open-delete" className="btn btn-delete" onClick={() => setDelOpen(true)}>
              Eliminar
            </button>
          </div>
        </div>
      )}

      {editOpen && (
        <EditModal
          joke={joke}
          onClose={() => setEditOpen(false)}
          onSaved={handleSaved}
          onToast={onToast}
        />
      )}
      {delOpen && (
        <DeleteModal
          joke={joke}
          onClose={() => setDelOpen(false)}
          onDeleted={handleDeleted}
          onToast={onToast}
        />
      )}
    </section>
  );
}
