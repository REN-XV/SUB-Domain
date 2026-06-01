import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home, Users, UtensilsCrossed, FileText, PlusCircle } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dasbor', icon: <Home size={20} /> },
  { path: '/customers', label: 'Pelanggan', icon: <Users size={20} /> },
  { path: '/transactions', label: 'Kasbon Baru', icon: <PlusCircle size={20} /> },
  { path: '/menu', label: 'Menu', icon: <UtensilsCrossed size={20} /> },
  { path: '/invoice', label: 'Cetak Nota', icon: <FileText size={20} /> },
];

export const Layout = () => {
  const location = useLocation();
  const currentNav = navItems.find(nav => nav.path === location.pathname) || navItems[0];

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
      </nav>
    </div>
  );
};
