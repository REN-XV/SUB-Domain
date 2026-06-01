import React, { useContext } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, UtensilsCrossed, FileText, PlusCircle, LogOut } from 'lucide-react';
import { WarungContext } from '../context/WarungContext';

const navItems = [
  { path: '/', label: 'Dasbor', icon: <Home size={20} /> },
  { path: '/customers', label: 'Pelanggan', icon: <Users size={20} /> },
  { path: '/transactions', label: 'Kasbon Baru', icon: <PlusCircle size={20} /> },
  { path: '/menu', label: 'Menu', icon: <UtensilsCrossed size={20} /> },
  { path: '/invoice', label: 'Cetak Nota', icon: <FileText size={20} /> },
];

export const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, session } = useContext(WarungContext);
  const currentNav = navItems.find(nav => nav.path === location.pathname) || navItems[0];

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  return (
    <div className="app-container">
      {/* Desktop Sidebar */}
      <aside className="desktop-sidebar">
        <div className="sidebar-logo">
          <UtensilsCrossed size={28} className="text-sambal" />
          <span>WarungKu</span>
        </div>
        <nav className="nav-links">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
          <button onClick={handleLogout} className="nav-item" style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', marginTop: 'auto', borderTop: '1px solid var(--color-border)', color: 'var(--color-sambal)' }}>
            <LogOut size={20} />
            Keluar
          </button>
        </nav>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Mobile Top Header */}
        <header className="top-header">
          <h1>{currentNav.icon} {currentNav.label}</h1>
        </header>

        {/* Main Content Area */}
        <main className="main-content animate-slide-up">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="bottom-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
        <button onClick={handleLogout} className="bottom-nav-item" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-sambal)' }}>
          <LogOut size={20} />
          <span>Keluar</span>
        </button>
      </nav>
    </div>
  );
};
