import { useState } from 'react';
import { login, register } from '../api';

export default function AuthTab({ onToast, onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username || !password) {
      onToast('Por favor, completa todos los campos', 'info');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(username, password);
        onToast('¡Bienvenido!', 'success');
        onLogin(); // Notifica a App.jsx
      } else {
        await register(username, password);
        onToast('Registro exitoso. Ahora puedes iniciar sesión.', 'success');
        setIsLogin(true); // Cambia a login tras registro
      }
    } catch (err) {
      onToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section aria-labelledby="auth-title">
      <h2 id="auth-title" className="section-title">
        {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
      </h2>

      <div className="card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Usuario</label>
            <input
              id="username"
              type="text"
              className="form-input"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Ingresa tu usuario"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
            {loading ? '⏳...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
          </button>
        </form>

        <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          <button
            type="button"
            className="btn btn-secondary"
            style={{ marginLeft: '0.5rem', padding: '0.2rem 0.5rem' }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
          </button>
        </p>
      </div>
    </section>
  );
}
