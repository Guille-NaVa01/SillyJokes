import { useState } from 'react';
import { createJoke } from '../api';
import { JOKE_TYPES, typeEmoji } from '../utils.jsx';

export default function AddTab({ onToast }) {
  const [jokeText, setJokeText] = useState('');
  const [jokeType, setJokeType] = useState('');
  const [loading, setLoading]   = useState(false);
  const [lastAdded, setLastAdded] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!jokeText.trim()) { onToast('Escribe la broma primero 😅', 'info'); return; }
    if (!jokeType)        { onToast('Elige un tipo de broma', 'info'); return; }

    setLoading(true);
    try {
      const created = await createJoke(jokeText.trim(), jokeType);
      setLastAdded(created);
      setJokeText('');
      setJokeType('');
      onToast('¡Broma agregada con éxito! 🎉', 'success');
    } catch (err) {
      onToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section aria-labelledby="add-title">
      <h2 id="add-title" className="section-title">
        ➕ Agregar broma
      </h2>

      <div className="card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="new-joke-text">
              Texto de la broma
            </label>
            <textarea
              id="new-joke-text"
              className="form-textarea"
              placeholder="¿Por qué los programadores prefieren el modo oscuro? Porque la luz atrae a los bugs 🐛"
              value={jokeText}
              onChange={e => setJokeText(e.target.value)}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="new-joke-type">
              Tipo de broma
            </label>
            <select
              id="new-joke-type"
              className="form-select"
              value={jokeType}
              onChange={e => setJokeType(e.target.value)}
            >
              <option value="">-- Selecciona un tipo --</option>
              {JOKE_TYPES.map(t => (
                <option key={t} value={t}>{typeEmoji(t)} {t}</option>
              ))}
            </select>
          </div>

          <button
            id="btn-add-joke"
            type="submit"
            className="btn btn-primary btn-lg btn-block"
            disabled={loading}
          >
            {loading ? '⏳ Guardando…' : '✨ Agregar broma'}
          </button>
        </form>
      </div>

      {lastAdded && (
        <div className="card" style={{ borderColor: 'var(--green)', background: 'var(--green-light)' }}>
          <p style={{ fontWeight: 700, color: 'var(--green-dark)', marginBottom: '0.4rem' }}>
            ✅ Última broma agregada (ID: {lastAdded.id})
          </p>
          <p style={{ color: 'var(--gray-700)' }}>{lastAdded.joketext}</p>
        </div>
      )}
    </section>
  );
}
