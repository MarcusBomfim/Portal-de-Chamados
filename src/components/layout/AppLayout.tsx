import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import '../../styles/layout.css'

export function AppLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="app-shell">
      <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {isMenuOpen && (
        <button
          className="sidebar-overlay"
          type="button"
          aria-label="Fechar menu"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <div className="app-column">
        <Header onMenuOpen={() => setIsMenuOpen(true)} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
