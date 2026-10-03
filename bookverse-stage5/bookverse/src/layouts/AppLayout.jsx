import { Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Sidebar, Navbar, Footer } from '../components/Navigation';
import { PageTurnBackground } from '../components/PageTurnBackground';

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="app-shell">
      {/* 3D Background Page-Turn Animation on Scroll (Active on Home page journey) */}
      {isHomePage && <PageTurnBackground />}

      <Sidebar open={open} onClose={() => setOpen(false)} />
      {open && <div className="drawer-backdrop" onClick={() => setOpen(false)} />}
      
      <div className="main-shell">
        <Navbar onMenu={() => setOpen(true)} />
        <main className={isHomePage ? 'main-book-scroll' : ''}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
