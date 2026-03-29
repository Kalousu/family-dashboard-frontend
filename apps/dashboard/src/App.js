import { useState, useRef } from 'react';
import { ThemeProvider, useTheme } from './ThemeContext';
import { LayoutProvider, useLayout, SIZE_SPANS } from './LayoutContext';
import './style.css';

// col/row: Position im Grid (1-basiert)
// SIZE_SPANS definiert colSpan/rowSpan je nach size
// Reihe 1: 3 medium Widgets (je 2 Spalten = 6 Spalten voll)
// Reihe 3: 1 small (2 Spalten) + 1 large (4 Spalten) = 6 Spalten voll
// Reihe 4: 1 small (2 Spalten) — beginnt eine neue Reihe
const INITIAL_WIDGETS = [
  { id: 1, title: 'Widget 1', size: 'medium', col: 1, row: 1 },
  { id: 2, title: 'Widget 2', size: 'medium', col: 3, row: 1 },
  { id: 3, title: 'Widget 3', size: 'medium', col: 5, row: 1 },
  { id: 4, title: 'Widget 4', size: 'small',  col: 1, row: 3 },
  { id: 5, title: 'Widget 5', size: 'large',  col: 3, row: 3 },
  { id: 6, title: 'Widget 6', size: 'small',  col: 1, row: 4 },
];

function Topbar({ onMenuToggle }) {
  const { darkMode, toggleDarkMode } = useTheme();
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="icon-btn" onClick={onMenuToggle} title="Menu">
          <span className="burger">&#9776;</span>
        </button>
        <span className="topbar-title">Family Dashboard</span>
      </div>
      <div className="topbar-right">
        <button className="icon-btn" onClick={toggleDarkMode} title={darkMode ? 'Light Mode' : 'Dark Mode'}>
          <span>{darkMode ? '☀️' : '🌙'}</span>
        </button>
      </div>
    </header>
  );
}

const isLoggedIn = true;

const SIDEBAR_ITEMS = [
  {
    id: 'manage-family',
    label: 'Familiengruppe verwalten',
    action: () => console.log('Familiengruppe verwalten'),
  },
  {
    id: 'manage-widgets',
    label: 'Widgets verwalten',
    action: () => console.log('Widgets verwalten'),
  },
  {
    id: 'auth',
    label: () => isLoggedIn ? 'Abmelden' : 'Anmelden',
    action: () => console.log(isLoggedIn ? 'logout' : 'login'),
    bottom: true,
  },
];

function Sidebar({ open, onClose }) {
  const [activeItem, setActiveItem] = useState(null);

  function handleClick(item) {
    setActiveItem(item.id);
    item.action();
  }

  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} />}
      <nav className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <span className="topbar-title">Menü</span>
          <button className="icon-btn" onClick={onClose}>&#10005;</button>
        </div>
        <ul className="sidebar-nav">
          {SIDEBAR_ITEMS.filter(item => !item.bottom).map((item, i) =>
            item.type === 'divider'
              ? <li key={i} className="sidebar-divider" />
              : (
                <li
                  key={item.id}
                  className={`sidebar-item ${activeItem === item.id ? 'active' : ''}`}
                  onClick={() => handleClick(item)}
                >
                  {typeof item.label === 'function' ? item.label() : item.label}
                </li>
              )
          )}
        </ul>
        <div className="sidebar-bottom">
          {SIDEBAR_ITEMS.filter(item => item.bottom).map(item => (
            <button
              key={item.id}
              className="sidebar-bottom-btn"
              onClick={() => handleClick(item)}
            >
              {typeof item.label === 'function' ? item.label() : item.label}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}

// Prüft ob Widget an Position (col, row) platziert werden kann
function canPlace(widgets, movingWidget, col, row, gridCols) {
  const { colSpan, rowSpan } = SIZE_SPANS[movingWidget.size];
  if (col < 1 || col + colSpan - 1 > gridCols) return false;
  return !widgets.some(w => {
    if (w.id === movingWidget.id) return false;
    const s = SIZE_SPANS[w.size];
    return col < w.col + s.colSpan &&
           col + colSpan > w.col &&
           row < w.row + s.rowSpan &&
           row + rowSpan > w.row;
  });
}

function WidgetGrid({ widgets, setWidgets }) {
  const { layout } = useLayout();
  const gridCols = layout.cols;

  const dragWidget = useRef(null);
  const [dropTarget, setDropTarget] = useState(null); // { col, row }

  // Maximale Reihe berechnen für leere Zellen
  const maxRow = widgets.reduce((max, w) => {
    const { rowSpan } = SIZE_SPANS[w.size];
    return Math.max(max, w.row + rowSpan - 1);
  }, 0) + 2;

  // Alle Gitterzellen generieren
  const cells = [];
  for (let row = 1; row <= maxRow; row++) {
    for (let col = 1; col <= gridCols; col++) {
      cells.push({ col, row });
    }
  }

  function handleDragStart(widget) {
    dragWidget.current = widget;
  }

  function handleDragOverCell(col, row, e) {
    e.preventDefault();
    if (!dragWidget.current) return;
    if (canPlace(widgets, dragWidget.current, col, row, gridCols)) {
      setDropTarget({ col, row });
    } else {
      setDropTarget(null);
    }
  }

  function handleDrop(col, row, e) {
    e.preventDefault();
    if (!dragWidget.current) return;
    if (canPlace(widgets, dragWidget.current, col, row, gridCols)) {
      setWidgets(prev => prev.map(w =>
        w.id === dragWidget.current.id ? { ...w, col, row } : w
      ));
    }
    dragWidget.current = null;
    setDropTarget(null);
  }

  function handleDragEnd() {
    dragWidget.current = null;
    setDropTarget(null);
  }

  const isDropTarget = (col, row) =>
    dropTarget &&
    dragWidget.current &&
    col >= dropTarget.col &&
    col < dropTarget.col + SIZE_SPANS[dragWidget.current.size].colSpan &&
    row >= dropTarget.row &&
    row < dropTarget.row + SIZE_SPANS[dragWidget.current.size].rowSpan;

  return (
    <div
      className="widget-grid"
      style={{ '--grid-cols': gridCols }}
    >
      {/* Leere Zellen als Drop-Zonen */}
      {cells.map(({ col, row }) => (
        <div
          key={`cell-${col}-${row}`}
          className={`grid-cell ${isDropTarget(col, row) ? 'grid-cell-active' : ''}`}
          style={{ gridColumn: col, gridRow: row }}
          onDragOver={e => handleDragOverCell(col, row, e)}
          onDrop={e => handleDrop(col, row, e)}
        />
      ))}

      {/* Widgets */}
      {widgets.map(widget => {
        const { colSpan, rowSpan } = SIZE_SPANS[widget.size];
        return (
          <div
            key={widget.id}
            className={`widget-card widget-${widget.size}`}
            style={{
              gridColumn: `${widget.col} / span ${colSpan}`,
              gridRow: `${widget.row} / span ${rowSpan}`,
            }}
            draggable
            onDragStart={() => handleDragStart(widget)}
            onDragEnd={handleDragEnd}
          >
            <div className="widget-header">
              <h3 className="widget-title">{widget.title}</h3>
              <button className="icon-btn widget-options" title="Options">&#8942;</button>
            </div>
            <div className="widget-body">
              <p className="widget-placeholder">Inhalt kommt später...</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Dashboard() {
  const { darkMode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [widgets, setWidgets] = useState(INITIAL_WIDGETS);

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <Topbar onMenuToggle={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main-content">
        <div className="dashboard-header">
          <div className="dashboard-greeting-row">
            <div className="profile-avatar-default">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </div>
            <div>
              <h1 className="dashboard-greeting">Hallo User!</h1>
              <p className="dashboard-date">{new Date().toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        </div>
        <WidgetGrid widgets={widgets} setWidgets={setWidgets} />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LayoutProvider>
        <Dashboard />
      </LayoutProvider>
    </ThemeProvider>
  );
}
