import { useState, useEffect } from 'react';
import RandomTab from './components/RandomTab.jsx';
import FilterTab from './components/FilterTab.jsx';
import AddTab from './components/AddTab.jsx';
import ManageTab from './components/ManageTab.jsx';
import AuthTab from './components/AuthTab.jsx';
import { useToast, ToastContainer } from './utils.jsx';
import { getToken, setToken } from './api.js';

const TABS = [
  { id: 'random', label: 'Aleatoria' },
  { id: 'filter', label: 'Filtrar' },
  { id: 'add', label: 'Agregar' },
  { id: 'manage', label: 'Gestionar' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('random');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toasts, addToast } = useToast();

  useEffect(() => {
    // Check initial token
    if (getToken()) setIsAuthenticated(true);
  }, []);

  const handleLogout = () => {
    setToken(null);
    setIsAuthenticated(false);
    addToast('Sesión cerrada', 'info');
  };

  return (
    <>
      {/* ===== HEADER ===== */}
      <header className="header">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="header-logo" aria-hidden="true"></span>
            <div>
              <h1 className="header-title">Banco de Bromas</h1>
              <p className="header-subtitle">¡El mejor lugar para reír en familia!</p>
            </div>
          </div>
          {isAuthenticated && (
            <button onClick={handleLogout} className="btn btn-secondary" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.4)' }}>
              Cerrar Sesión
            </button>
          )}
        </div>
      </header>

      {/* ===== MAIN ===== */}
      <main className="main">
        <div className="container">
          {!isAuthenticated ? (
            <AuthTab onToast={addToast} onLogin={() => setIsAuthenticated(true)} />
          ) : (
            <>
              {/* Tabs */}
              <nav className="tabs" role="tablist" aria-label="Secciones">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    id={`tab-${tab.id}`}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    aria-controls={`panel-${tab.id}`}
                    className={`tab-btn${activeTab === tab.id ? ' active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>

              {/* Panels */}
              <div id="panel-random" role="tabpanel" aria-labelledby="tab-random" hidden={activeTab !== 'random'}>
                {activeTab === 'random' && <RandomTab onToast={addToast} />}
              </div>
              <div id="panel-filter" role="tabpanel" aria-labelledby="tab-filter" hidden={activeTab !== 'filter'}>
                {activeTab === 'filter' && <FilterTab onToast={addToast} />}
              </div>
              <div id="panel-add" role="tabpanel" aria-labelledby="tab-add" hidden={activeTab !== 'add'}>
                {activeTab === 'add' && <AddTab onToast={addToast} />}
              </div>
              <div id="panel-manage" role="tabpanel" aria-labelledby="tab-manage" hidden={activeTab !== 'manage'}>
                {activeTab === 'manage' && <ManageTab onToast={addToast} />}
              </div>
            </>
          )}
        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <p>Banco de Bromas &copy; {new Date().getFullYear()} — Hecho en React</p>
      </footer>

      {/* ===== TOASTS ===== */}
      <ToastContainer toasts={toasts} />
    </>
  );
}
